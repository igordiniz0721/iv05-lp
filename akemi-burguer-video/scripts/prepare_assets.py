"""
Gera os assets de public/assets/ a partir das artes originais do Akemi Burguer.

Uso:
    pip install "rembg[cpu]" pillow numpy
    python3 scripts/prepare_assets.py --menu caminho/combos.jpg \
        --story caminho/dia-de-combo.jpg --logo caminho/logo-akemi.png

  --menu   arte "Combos" (872x1280) com Combo Bacon / Classic / 01 / Smash
  --story  arte "Dia de Combo!" (900x1600) com o hambúrguer duplo
  --logo   logo oficial em alta (selo com fundo preto). O preto de FORA do
           selo vira transparente; o preto de dentro é mantido. Sem --logo,
           o logo é recortado (em baixa) da arte --story.

As coordenadas de recorte abaixo foram medidas nessas duas artes. Se você tiver
as fotos originais em alta (ou o logo em vetor), basta substituir os PNGs em
public/assets/ mantendo os mesmos nomes.
"""

from __future__ import annotations

import argparse
import io
import random
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets"

PRIMARY = (255, 94, 0)  # #FF5E00
SECONDARY = (43, 17, 4)  # #2B1104

# (left, top, right, bottom) em pixels da arte original + % da base a esmaecer.
# O duplo encosta na faixa "Hambúrguer duplo" da arte, então a base recebe um
# fade para não ficar um corte reto flutuando no vídeo.
CROPS = {
    "foto-duplo.png": ("story", (196, 762, 812, 1286), 0.12),
    "foto-combo-bacon.png": ("menu", (288, 136, 604, 356), 0.0),
    "foto-combo-smash.png": ("menu", (0, 934, 416, 1236), 0.0),
}
LOGO_CENTER = (460, 88)  # na arte "story"
LOGO_RADIUS = 44


def remove_bg(img: Image.Image) -> Image.Image:
    from rembg import new_session, remove

    # birefnet separa bem batata frita de fundo laranja (isnet/u2net falham aqui)
    session = new_session("birefnet-general-lite")
    cut = remove(img, session=session, post_process_mask=True)
    return cut if isinstance(cut, Image.Image) else Image.open(io.BytesIO(cut))


def trim(img: Image.Image, pad: int = 12) -> Image.Image:
    bbox = img.getchannel("A").point(lambda a: 255 if a > 16 else 0).getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    return img.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, img.width), min(b + pad, img.height)))


def upscale(img: Image.Image, factor: float) -> Image.Image:
    size = (round(img.width * factor), round(img.height * factor))
    big = img.resize(size, Image.Resampling.LANCZOS)
    return big.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))


def fade_bottom(img: Image.Image, fraction: float) -> Image.Image:
    if fraction <= 0:
        return img
    h = round(img.height * fraction)
    ramp = Image.linear_gradient("L").resize((img.width, h))  # 0 no topo -> 255 na base
    alpha = img.getchannel("A")
    bottom = alpha.crop((0, img.height - h, img.width, img.height))
    faded = Image.composite(Image.new("L", bottom.size, 0), bottom, ramp)
    alpha.paste(faded, (0, img.height - h))
    img.putalpha(alpha)
    return img


def make_food(src: Image.Image, box: tuple[int, int, int, int], fade: float, name: str) -> None:
    crop = upscale(src.crop(box).convert("RGB"), 2.5)
    cut = fade_bottom(trim(remove_bg(crop)), fade)
    cut.save(OUT / name, optimize=True)
    print(f"  {name}: {cut.size}")


def make_logo(story: Image.Image) -> None:
    cx, cy = LOGO_CENTER
    r = LOGO_RADIUS
    crop = story.crop((cx - r, cy - r, cx + r, cy + r)).convert("RGB")
    size = 640
    big = upscale(crop, size / crop.width).resize((size, size), Image.Resampling.LANCZOS)
    # máscara circular com antialias (desenha em 4x e reduz)
    mask = Image.new("L", (size * 4, size * 4), 0)
    inset = 10 * 4
    ImageDraw.Draw(mask).ellipse((inset, inset, size * 4 - inset, size * 4 - inset), fill=255)
    mask = mask.resize((size, size), Image.Resampling.LANCZOS)
    big.putalpha(mask)
    big.save(OUT / "logo-akemi.png", optimize=True)
    print(f"  logo-akemi.png: {big.size}")


def make_logo_from_file(path: Path) -> None:
    """Remove o fundo preto externo do logo oficial (flood fill a partir das bordas)."""
    import numpy as np

    rgb = Image.open(path).convert("RGB")
    w, h = rgb.size
    arr = np.asarray(rgb).astype(np.float32)
    brightness = arr.max(axis=2)

    # candidatos a fundo = pixels quase pretos; só o que encosta na borda some
    # .copy(): fromarray pode devolver imagem só-leitura e o floodfill seria ignorado
    cand = Image.fromarray(np.where(brightness < 40, 255, 0).astype(np.uint8)).copy()
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if cand.getpixel(seed) == 255:
            ImageDraw.floodfill(cand, seed, 128)
    outside = np.asarray(cand) == 128

    # faixa de 2px na borda externa: alpha proporcional ao brilho (antialias)
    grown = np.asarray(
        Image.fromarray((outside * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
    ) == 255
    edge = grown & ~outside
    alpha = np.where(outside, 0.0, 255.0)
    soft = np.clip(brightness / 200.0, 0, 1)
    alpha[edge] = soft[edge] * 255.0

    # desfaz a mistura com o preto nos pixels de borda
    safe = np.maximum(alpha / 255.0, 1e-3)[..., None]
    color = np.where(edge[..., None], np.clip(arr / safe, 0, 255), arr)

    rgba = np.dstack([color, alpha]).astype(np.uint8)
    logo = trim(Image.fromarray(rgba, "RGBA"), pad=8)
    side = 900
    scale = side / max(logo.size)
    logo = logo.resize((round(logo.width * scale), round(logo.height * scale)), Image.Resampling.LANCZOS)
    logo.save(OUT / "logo-akemi.png", optimize=True)
    print(f"  logo-akemi.png: {logo.size} (logo oficial)")


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        req = urllib.request.Request(
            "https://fonts.googleapis.com/css2?family=Anton", headers={"User-Agent": "curl/8"}
        )
        css = urllib.request.urlopen(req, timeout=10).read().decode()
        url = css.split("url(")[1].split(")")[0]
        data = urllib.request.urlopen(url, timeout=10).read()
        return ImageFont.truetype(io.BytesIO(data), size)
    except Exception:  # sem rede: cai para uma fonte do sistema
        for path in (
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/System/Library/Fonts/Supplemental/Impact.ttf",
            "C:/Windows/Fonts/impact.ttf",
        ):
            if Path(path).exists():
                return ImageFont.truetype(path, size)
        return ImageFont.load_default()


def make_texture() -> None:
    w, h = 1080, 1920
    rnd = random.Random(7)

    # gradiente radial laranja (centro mais claro, bordas mais queimadas)
    base = Image.new("RGB", (w, h), PRIMARY)
    glow = Image.radial_gradient("L").resize((w * 2, h * 2)).crop((w // 2, h // 2, w // 2 + w, h // 2 + h))
    burnt = Image.new("RGB", (w, h), (214, 64, 0))
    base = Image.composite(burnt, base, glow)

    # repetição da marca: faixas diagonais com "AKEMI · SMASH & BURGUER"
    layer = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    font = load_font(150)
    line = "AKEMI  •  SMASH & BURGUER  •  " * 4
    for i, y in enumerate(range(0, h * 2, 210)):
        offset = -(i % 2) * 380
        draw.text((offset, y), line, font=font, fill=(255, 255, 255, 22))
    layer = layer.rotate(-12, resample=Image.Resampling.BICUBIC).crop((w // 2, h // 2, w // 2 + w, h // 2 + h))
    base = Image.alpha_composite(base.convert("RGBA"), layer)

    # respingos tipo "grunge" (como na arte Dia de Combo)
    splats = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(splats)
    for _ in range(2600):
        x = rnd.gauss(w * 0.85, w * 0.25)
        y = rnd.gauss(h * 0.62, h * 0.18)
        r = rnd.choice((1, 1, 2, 2, 3, 4))
        sd.ellipse((x - r, y - r, x + r, y + r), fill=(120, 30, 0, rnd.randint(40, 110)))
    base = Image.alpha_composite(base, splats)

    # grão fino
    noise = Image.effect_noise((w, h), 26).convert("L")
    noise_rgba = Image.merge("RGBA", (noise, noise, noise, Image.new("L", (w, h), 18)))
    base = Image.alpha_composite(base, noise_rgba)

    # vinheta escura (marrom da marca)
    vign = Image.radial_gradient("L").resize((w, h)).point(lambda v: int(max(0, v - 120) * 0.9))
    dark = Image.new("RGBA", (w, h), SECONDARY + (0,))
    dark.putalpha(vign)
    base = Image.alpha_composite(base, dark)

    base.convert("RGB").save(OUT / "bg-texture.png", optimize=True)
    print("  bg-texture.png: (1080, 1920)")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--menu", required=True, type=Path)
    ap.add_argument("--story", required=True, type=Path)
    ap.add_argument("--logo", type=Path, help="logo oficial em alta (fundo preto)")
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    sources = {"menu": Image.open(args.menu), "story": Image.open(args.story)}

    print("Gerando assets em", OUT)
    if args.logo:
        make_logo_from_file(args.logo)
    else:
        make_logo(sources["story"])
    for name, (src, box, fade) in CROPS.items():
        make_food(sources[src], box, fade, name)
    make_texture()


if __name__ == "__main__":
    main()
