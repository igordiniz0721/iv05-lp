# LJ Climatização e Elétrica · site

Landing page de página única para a LJ Climatização e Elétrica (Cascavel – PR).
Feita em HTML, CSS e JS puros, sem build. É só subir a pasta em qualquer hospedagem estática (Hostinger, Netlify, Vercel, GitHub Pages…).

## Arquivos

| Arquivo | Para quê |
|---|---|
| `index.html` | O site inteiro (estilos e scripts embutidos) |
| `favicon.svg` | Ícone da aba do navegador |
| `apple-touch-icon.png` | Ícone ao salvar o site na tela inicial do iPhone |
| `og-image.jpg` | Imagem de prévia quando o link é compartilhado (WhatsApp, Instagram, Facebook) |

## O que tem no site

- Hero animado: o ar-condicionado "esfria" a página de 34° para 22°
- Serviços em abas (Climatização / Elétrica), cada um com orçamento pronto no WhatsApp
- Seção do diferencial "ar + elétrica num só time"
- Calculadora de BTUs, que manda o resultado para o WhatsApp
- Antes e depois da higienização (arrastar para comparar)
- Check-up elétrico interativo, que manda os sinais marcados para o WhatsApp
- Formulário de orçamento que monta a mensagem e abre o WhatsApp
- Indicador "Aberto agora / Fechado" pelo horário de Brasília
- Mapa, FAQ, botão flutuante de WhatsApp e barra fixa "Ligar / WhatsApp" no celular
- SEO local com dados estruturados (`HVACBusiness` + `Electrician`)

## Ajustes rápidos

No final do `index.html`, no bloco `CONFIGURAÇÃO`:

```js
const CFG = {
  whatsapp: '5545999973564',   // DDI + DDD + número
  hours: { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18] } // 0 = domingo … 6 = sábado
};
```

Se o horário mudar, atualize também os textos "Seg. a sex. · 8h às 18h" e o `openingHoursSpecification` do JSON-LD no `<head>`.

## Publicação (Vercel)

Projeto estático, sem build. Na Vercel: **Add New → Project → importar `igordiniz0721/iv05-lp`**, com:

- **Root Directory:** `lj-climatizacao`
- **Framework Preset:** Other (sem build command e sem output directory)

Depois do primeiro deploy:

- Troque `og-image.jpg` no `og:image` e no `image` do JSON-LD pela URL completa (`https://SEU-PROJETO.vercel.app/og-image.jpg` ou o domínio próprio), senão a prévia do link não aparece no WhatsApp.
- Se for usar Meta Pixel ou Google Analytics, cole o código antes do `</head>`.

## Para confirmar com o cliente

- Horário de abertura (o perfil do Google mostra só "fecha às 18h") e se atende aos sábados
- Lista de serviços (ex.: se instala piso-teto/cassete, se faz carga de gás)
- Cidades atendidas na região
- Logo oficial em vetor: o do site é uma recriação em SVG a partir do perfil do Instagram
