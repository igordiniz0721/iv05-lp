# Akemi Burguer — vídeo promocional (Remotion)

Vídeo vertical **9:16 · 1080×1920 · 30 fps · 30,5 s (915 frames)** para o Akemi
Smash & Burguer, em Santa Tereza do Oeste, feito com Remotion, React e Tailwind CSS v4.
O vídeo é guiado pela **locução da cliente**: cada cena e cada palavra de
destaque entram no tempo da fala.

```bash
cd akemi-burguer-video
npm install
npm run dev       # Remotion Studio (preview + edição de props)
npm run render    # gera out/akemi-promo.mp4
npm run lint      # checagem de tipos
```

## Roteiro → código

| Tempo        | Cena (`src/scenes/`)    | Fala da cliente                                               | O que acontece                                                                                                                                              | Saída                 |
| ------------ | ----------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 0–7,6 s      | `Scene1_Hook`           | "Alô Santa Tereza do Oeste, o melhor burger da cidade acabou de chegar por aqui." | Logo entra grande no centro (bounce elástico) e sobe; "Alô, SANTA / TEREZA / DO OESTE!" caem palavra por palavra; corte em flash; "O MELHOR BURGER DA CIDADE CHEGOU!" | zoom + flash          |
| 7,6–15,8 s   | `Scene2_PromoHighlight` | "Dá uma olhada nesse combo duplo, super suculento, com batata crocante e refri por apenas R$ 44,99." | Hambúrguer duplo salta e flutua, raios, fumaça, brilho e zoom no "suculento"; selos "+ Batata Frita Crocante" e "+ Refri"; etiqueta "R$ 44,99" bate no preço falado | faixas diagonais     |
| 15,8–20,1 s  | `Scene3_GridCombos`     | "Prefere bacon ou quer dois smashes artesanais?"              | "BACON ou SMASH?" e os cards dos combos entram junto com cada palavra; selo "100% artesanal" no "artesanais"                                                  | flash                 |
| 20,1–24,1 s  | `Scene4_MoreBurgers`    | "Temos opções irresistíveis para matar a sua fome."           | "e fora esses, temos… DIVERSOS OUTROS LANCHES deliciosos!" + carrossel rápido com 8 lanches reais do cardápio (nome e preço), miniaturas e faixa "PARA MATAR SUA FOME!" | íris                  |
| 24,1–30,5 s  | `Scene5_CTA_Website`    | "Tá esperando o quê? Acesse agora o nosso site e faça o seu pedido online." | "TÁ ESPERANDO O QUÊ?!" em tela cheia; depois "ACESSE AGORA NOSSO SITE", URL digitada, celular abrindo o cardápio real da Saipos e rolando, dedo tocando "FAZER PEDIDO ONLINE" no "online" | —                     |

Os tempos ficam em `TIMELINE` (`src/schema.ts`), e cada cena converte os
segundos da fala em frames com `sec()`. Se trocar a locução, ajuste esses
tempos.

## Props editáveis

Definidas com Zod em `src/schema.ts` (o Studio mostra um formulário com color
picker). Os valores padrão ficam em `src/Root.tsx`:

| Prop               | Padrão                                     |
| ------------------ | ------------------------------------------ |
| `siteUrl`          | `hamburgueriaconteiner.saipos.com`         |
| `city`             | `Santa Tereza do Oeste`                    |
| `logoSrc`          | `staticFile("assets/logo-akemi.png")`      |
| `burgerDoubleSrc`  | `staticFile("assets/foto-duplo.png")`      |
| `comboBaconSrc`    | `staticFile("assets/foto-combo-bacon.png")`|
| `comboSmashSrc`    | `staticFile("assets/foto-combo-smash.png")`|
| `bgTextureSrc`     | `staticFile("assets/bg-texture.png")`      |
| `siteScreenshotSrc`| `staticFile("assets/site-cardapio.jpg")` (print do cardápio que rola no celular) |
| `primaryColor`     | `#FF5E00`                                  |
| `secondaryColor`   | `#2B1104`                                  |
| `accentColor`      | `#FDBA25`                                  |
| `prices`           | `{ comboDuplo: "44,99", comboBacon: "47,99", comboSmash: "59,90" }` |
| `moreBurgers`      | 8 lanches do cardápio: `{ name, price, src }` |
| `voiceoverSrc`     | `staticFile("audio/locucao-cliente.mp3")`  |
| `musicSrc`         | `staticFile("audio/beat.wav")` (vazio = sem trilha) |
| `withSfx`          | `true`                                     |

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
  scenes/               Scene1_Hook, Scene2_PromoHighlight, Scene3_GridCombos,
                        Scene4_MoreBurgers, Scene5_CTA_Website
  components/           fundo, logo, preço, tags, selo, transições, celular, ícones, som
  lib/                  presets de spring/helpers de animação, assets, quebra de texto
public/
  assets/               logo, fotos recortadas (PNG transparente), textura de fundo
  assets/menu/          lanches do cardápio Saipos recortados (carrossel)
  assets/site-cardapio.jpg  print do cardápio digital (celular da cena final)
  audio/                locução da cliente (tratada) + batida de fundo
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

`SoundDesign.tsx` monta três camadas:

- **Locução da cliente** (`public/audio/locucao-cliente.mp3`): o áudio do
  WhatsApp tratado com filtro, compressor e normalização em -14 LUFS.
- **Trilha** (`public/audio/beat.wav`): batida de 120 BPM gerada por
  `scripts/generate_beat.py`. Ela abaixa enquanto a cliente fala, para no
  "Tá esperando o quê?" e volta com impacto. É um placeholder: para a versão
  final, troque por uma trilha licenciada (mesmo nome ou prop `musicSrc`).
- **SFX** (`public/sfx/`): bass drop, chapa chiando, impactos, whoosh nas
  transições, kick a cada troca do carrossel e toque no botão. Também são
  placeholders sintéticos (`npm run sfx`).

Os trechos de fala que fazem a trilha abaixar ficam em `SPEECH`, e os SFX em
`CUES`, ambos em `SoundDesign.tsx`.

## Cardápio real

Os lanches do carrossel e o print do celular vêm do cardápio digital em
https://hamburgueriaconteiner.saipos.com. As fotos foram recortadas com o
mesmo rembg dos combos. No print, o aviso de horário ("Loja fechada no
momento…"), o pop-up "Abrir no navegador" e a barra inferior foram ocultados.

## Observações

- As fontes ficam em `public/fonts/`, então o render não depende de internet
  e também funciona no Remotion Lambda.
- Áreas seguras para Reels/Stories: o texto principal fica entre ~250 px e
  ~1600 px de altura. A legenda "Cardápio digital • cidade" fica na faixa de
  baixo e é decorativa.
