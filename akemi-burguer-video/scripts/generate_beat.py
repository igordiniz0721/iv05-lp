"""
Gera public/audio/beat.wav: batida 120 BPM (kick, palma, chimbal e sub)
para ficar por baixo da locução. Placeholder — troque por uma trilha
licenciada mantendo o nome do arquivo ou mudando a prop `musicSrc`.

    python3 scripts/generate_beat.py

O beat "some" durante o "Tá esperando o quê?" (BREAK) e volta com impacto.
"""

import wave
from pathlib import Path

import numpy as np

SR = 44100
BPM = 120
DURATION = 30.5
BREAK = (23.95, 25.3)  # segundos sem batida (só o riser antes)
OUT = Path(__file__).resolve().parent.parent / "public" / "audio" / "beat.wav"

rng = np.random.default_rng(7)
beat = 60 / BPM
n = int(SR * DURATION)
mix = np.zeros(n)


def place(sample: np.ndarray, at: float, gain: float = 1.0) -> None:
    i = int(at * SR)
    if i >= n:
        return
    end = min(n, i + len(sample))
    mix[i:end] += sample[: end - i] * gain


def kick() -> np.ndarray:
    t = np.arange(int(0.38 * SR)) / SR
    phase = 2 * np.pi * (48 * t + 110 * (1 - np.exp(-28 * t)) / 28)
    return np.tanh(1.6 * np.sin(phase) * np.exp(-9 * t))


def clap() -> np.ndarray:
    t = np.arange(int(0.22 * SR)) / SR
    noise = rng.standard_normal(len(t))
    band = np.convolve(np.diff(noise, prepend=0), np.ones(6) / 6, mode="same")
    env = np.zeros_like(t)
    for k, off in enumerate((0, 0.012, 0.024)):
        env += (t >= off) * np.exp(-(t - off).clip(0) * (90 if k < 2 else 22))
    return band * env * 0.9


def hat() -> np.ndarray:
    t = np.arange(int(0.05 * SR)) / SR
    noise = np.diff(rng.standard_normal(len(t) + 1))
    return noise * np.exp(-70 * t) * 0.35


def sub(freq: float, length: float) -> np.ndarray:
    t = np.arange(int(length * SR)) / SR
    env = np.minimum(1, t / 0.01) * np.exp(-1.2 * t)
    return np.sin(2 * np.pi * freq * t) * env * 0.55


def riser(length: float) -> np.ndarray:
    t = np.arange(int(length * SR)) / SR
    noise = np.diff(rng.standard_normal(len(t) + 1))
    return noise * (t / length) ** 2 * 0.5


in_break = lambda s: BREAK[0] <= s < BREAK[1]
roots = [41.2, 41.2, 49.0, 55.0]  # Mi, Mi, Sol, Lá (uma nota por compasso)

step = 0
s = 0.0
while s < DURATION:
    bar, pos = divmod(step, 4)
    if not in_break(s):
        place(kick(), s, 0.95)
        place(hat(), s + beat / 2, 0.8)
        if pos in (1, 3):
            place(clap(), s, 0.55)
        place(sub(roots[bar % 4], beat * 0.9), s + 0.02, 0.8)
    step += 1
    s = step * beat

place(riser(BREAK[0] - 22.6), 22.6, 0.6)
place(kick(), BREAK[1], 1.0)  # volta do beat

# sidechain leve: o sub/chimbal "respiram" a cada kick
t = np.arange(n) / SR
duck = 1 - 0.45 * np.exp(-((t % beat) * 14))
mix *= duck
mix[: int(0.4 * SR)] *= np.linspace(0, 1, int(0.4 * SR))
fade = int(1.2 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)

mix = mix / np.max(np.abs(mix)) * 0.89
OUT.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUT), "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes((mix * 32767).astype(np.int16).tobytes())
print("beat gerado em", OUT)
