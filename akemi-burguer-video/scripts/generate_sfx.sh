#!/usr/bin/env bash
# Gera efeitos sonoros sintéticos (placeholders) em public/sfx/ usando ffmpeg.
# São suficientes para marcar o ritmo do roteiro; troque por SFX de banco
# (mesmos nomes de arquivo) para a versão final.
set -euo pipefail

OUT="$(cd "$(dirname "$0")/.." && pwd)/public/sfx"
mkdir -p "$OUT"
SR=44100
ff() { ffmpeg -hide_banner -loglevel error -y "$@"; }

# Batida grave (bass drop): seno descendo de 150 Hz para 40 Hz com saturação
ff -f lavfi -i "aevalsrc='0.95*sin(2*PI*(40*t+110*(1-exp(-5*t))/5))*exp(-1.6*t)':s=$SR:d=1.8" \
  -af "asoftclip=type=tanh,volume=1.4,afade=t=out:st=1.5:d=0.3" "$OUT/bass-drop.wav"

# Impacto seco: thump + estalo de ruído
ff -f lavfi -i "aevalsrc='0.9*sin(2*PI*(45*t+80*(1-exp(-18*t))/18))*exp(-9*t)':s=$SR:d=0.6" \
  -f lavfi -i "anoisesrc=c=white:d=0.6:a=0.6:r=$SR" \
  -filter_complex "[1]lowpass=f=2500,volume='exp(-30*t)':eval=frame[n];[0][n]amix=inputs=2:weights='1 0.5':normalize=0,asoftclip" \
  "$OUT/impact.wav"

# Whoosh: ruído rosa filtrado com envelope em sino
ff -f lavfi -i "anoisesrc=c=pink:d=0.7:a=0.9:r=$SR" \
  -af "highpass=f=350,lowpass=f=4200,volume='pow(sin(PI*t/0.7),2)*1.6':eval=frame" "$OUT/whoosh.wav"

# Chapa chiando (sizzle): ruído agudo com estalos aleatórios
ff -f lavfi -i "anoisesrc=c=white:d=3:a=0.5:r=$SR" \
  -af "highpass=f=2800,lowpass=f=9000,volume='0.25+0.75*gt(random(0),0.82)':eval=frame,afade=t=in:d=0.2,afade=t=out:st=2.3:d=0.7,volume=0.6" \
  "$OUT/sizzle.wav"

# Pop / estalo curto (tags e preço)
ff -f lavfi -i "aevalsrc='0.8*sin(2*PI*(320*t+600*(1-exp(-30*t))/30))*exp(-28*t)':s=$SR:d=0.16" "$OUT/pop.wav"

# Kick para os cortes da cena 3
ff -f lavfi -i "aevalsrc='0.95*sin(2*PI*(50*t+110*(1-exp(-25*t))/25))*exp(-11*t)':s=$SR:d=0.4" \
  -af "asoftclip" "$OUT/kick.wav"

# Toque na tela (tap)
ff -f lavfi -i "aevalsrc='0.6*sin(2*PI*1400*t)*exp(-90*t)':s=$SR:d=0.08" \
  -f lavfi -i "anoisesrc=c=white:d=0.08:a=0.5:r=$SR" \
  -filter_complex "[1]bandpass=f=2500,volume='exp(-120*t)':eval=frame[n];[0][n]amix=inputs=2:normalize=0" \
  "$OUT/tap.wav"

echo "SFX gerados em $OUT:"
ls -1 "$OUT"
