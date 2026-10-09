# Quântica Assessoria Digital · linktree

Página de links da Quântica, no ar em **https://quantica-linktree.vercel.app/**.
HTML, CSS e JS puros, sem build.

| Arquivo | Para quê |
|---|---|
| `index.html` | A página inteira (estilos e scripts embutidos) |
| `logo-quantica.png` | Logo com fundo transparente, usada como núcleo do átomo animado |

## Trocar a logo

A logo fica por cima das órbitas animadas, então ela precisa de fundo transparente,
com o miolo do átomo preenchido de preto (é isso que esconde os elétrons quando passam por trás).
Se a proporção da imagem mudar, atualize no `index.html`:

- `aspect-ratio` do `.stage` e `width`/`height` do `<img id="logo">`
- `left`/`top` do `.aura` e do `.orbits`: o centro do átomo dentro da imagem

## Publicação (Vercel)

Rode dentro desta pasta:

```bash
npx vercel@latest deploy --prod
```

Na primeira vez, escolha o projeto existente `quantica-linktree` quando a CLI perguntar.
