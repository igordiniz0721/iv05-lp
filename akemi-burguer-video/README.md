# Akemi Burguer — vídeo promocional (Remotion)

Vídeo vertical **9:16 · 1080×1920 · 30 fps · 15 s (450 frames)** para o Akemi
Smash & Burguer, em Santa Tereza do Oeste, feito com Remotion, React e Tailwind CSS v4.

```bash
cd akemi-burguer-video
npm install
npm run dev       # Remotion Studio (preview + edição de props)
npm run render    # gera out/akemi-promo.mp4
npm run lint      # checagem de tipos
```

## Roteiro → código

| Frames  | Cena (`src/scenes/`)       | O que acontece                                                                                   | Transição de saída                 |
| ------- | -------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| 0–90    | `Scene1_Hook`              | Logo cai do topo com bounce elástico; "Alô, SANTA TEREZA DO OESTE!" → corte em flash → "O MELHOR BURGER DA CIDADE CHEGOU!" | zoom + desfoque e flash branco    |
| 90–210  | `Scene2_PromoHighlight`    | Hambúrguer duplo salta e flutua (translateY + rotação), raios de luz, fumaça e brilho no pão; etiqueta marrom/vermelha "R$ 44,99" entra pela lateral; selos "+ Batata Frita Crocante" e "+ Refri" | faixas diagonais amarelo/laranja/marrom |
| 210–330 | `Scene3_GridCombos`        | Tela dividida: Combo Bacon (R$ 47,99) e Combo Smash (R$ 59,90) entram por lados opostos, com tags "Bacon crocante", "Cheddar cremoso", "Smash burgers", "100% artesanal", selo giratório "160g" e faixa correndo. O foco alterna entre os dois no ritmo das batidas | íris marrom                        |
| 330–450 | `Scene4_CTA_Website`       | Lanches desfocados ao fundo, "PEÇA PELO NOSSO SITE", URL em caixa alta sendo digitada, celular abrindo o cardápio digital, dedo tocando o botão "FAZER PEDIDO ONLINE" (com pulso de escala) | —                                  |

Os frames de cada cena ficam centralizados em `TIMELINE` (`src/schema.ts`), e
as cenas, os SFX e as transições usam essa mesma constante.

## Props editáveis

Definidas com Zod em `src/schema.ts` (o Studio mostra um formulário com color
picker). Os valores padrão ficam em `src/Root.tsx`:

| Prop               | Padrão                                     |
| ------------------ | ------------------------------------------ |
| `siteUrl`          | `pedidos.akemiburguer.com.br`              |
| `city`             | `Santa Tereza do Oeste`                    |
| `logoSrc`          | `staticFile("assets/logo-akemi.png")`      |
| `burgerDoubleSrc`  | `staticFile("assets/foto-duplo.png")`      |
| `comboBaconSrc`    | `staticFile("assets/foto-combo-bacon.png")`|
| `comboSmashSrc`    | `staticFile("assets/foto-combo-smash.png")`|
| `bgTextureSrc`     | `staticFile("assets/bg-texture.png")`      |
| `primaryColor`     | `#FF5E00`                                  |
| `secondaryColor`   | `#2B1104`                                  |
| `accentColor`      | `#FDBA25`                                  |
| `prices`           | `{ comboDuplo: "44,99", comboBacon: "47,99", comboSmash: "59,90" }` |
| `withSfx`          | `true`                                     |
| `musicSrc`         | `""` (sem trilha; ex.: `"audio/trilha.mp3"`) |

As cores viram as variáveis CSS `--akemi-primary/secondary/accent` no elemento
raiz, e o `@theme inline` de `src/index.css` liga essas variáveis às classes
do Tailwind (`bg-primary`, `text-accent`, `bg-secondary/70` etc.). Quando você
muda a cor no Studio, o vídeo inteiro acompanha.

Os campos de imagem aceitam o retorno de `staticFile()`, um caminho relativo a
`public/` (ex.: `assets/foto-nova.png`) ou uma URL.

Para renderizar com outras props:

```bash
npx remotion render AkemiPromo out/akemi.mp4 --props='{"siteUrl":"akemiburguer.com.br"}'
```

## Estrutura

```
src/
  index.ts              registerRoot
  Root.tsx              <Composition> + defaultProps
  Composition.tsx       AkemiPromo: <Sequence> de cada cena + transições + som
  schema.ts             schema Zod das props + TIMELINE
  fonts.ts              carrega as fontes locais (public/fonts)
  index.css             Tailwind v4 + tema da marca
  theme.ts              tons de apoio (vermelho das artes, creme do cardápio)
  scenes/               Scene1_Hook, Scene2_PromoHighlight, Scene3_GridCombos, Scene4_CTA_Website
  components/           fundo, logo, preço, tags, selo, transições, celular, ícones, som
  lib/                  presets de spring/helpers de animação, assets, quebra de texto
public/
  assets/               logo e fotos recortadas (PNG transparente) + textura de fundo
  fonts/                Anton, Bowlby One, Pacifico, Poppins (woff2, licença OFL)
  sfx/                  efeitos sonoros (placeholders sintéticos)
scripts/
  prepare_assets.py     recorte + remoção de fundo dos lanches, logo e textura
  generate_sfx.sh       gera os SFX com ffmpeg
```

## Assets

Os PNGs de `public/assets/` foram gerados a partir das artes enviadas:

- `logo-akemi.png`: logo oficial em alta. O preto **de fora** do selo virou
  transparente e o preto de dentro foi mantido.
- `foto-duplo.png`, `foto-combo-bacon.png`, `foto-combo-smash.png`: recortados
  das artes "Dia de Combo!" e "Combos". O fundo foi removido com
  [rembg](https://github.com/danielgatis/rembg) (modelo `birefnet-general-lite`).
  Como as artes têm baixa resolução, as fotos foram ampliadas 2,5×. Se
  tiver as fotos originais em alta, é só trocar os arquivos mantendo os mesmos nomes.
- `bg-texture.png`: textura laranja com a marca repetida, grão e respingos.

Para gerar tudo de novo:

```bash
pip install "rembg[cpu]" pillow numpy
python3 scripts/prepare_assets.py --menu combos.jpg --story dia-de-combo.jpg --logo logo-akemi.png
```

## Som

`SoundDesign.tsx` dispara os SFX nos momentos do roteiro: bass drop e chapa
chiando no gancho, impactos na tipografia, whoosh nas transições, estalo no
preço, kick a cada troca da cena 3 e toque no botão. Os arquivos em `public/sfx/`
são **placeholders sintéticos** (`npm run sfx`). Para a versão final, troque
por SFX de banco usando os mesmos nomes. Para pôr uma trilha, coloque o MP3 em
`public/` e preencha `musicSrc` (ela entra e sai com fade).

## Observações

- As fontes ficam em `public/fonts/`, então o render não depende de internet
  e também funciona no Remotion Lambda.
- Áreas seguras para Reels/Stories: o texto principal fica entre ~250 px e
  ~1600 px de altura. A legenda "Cardápio digital • cidade" fica na faixa de
  baixo e é decorativa.
