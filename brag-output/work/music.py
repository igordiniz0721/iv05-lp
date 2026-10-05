"""Trilha do /brag: 120 BPM, Dó maior (C–G–Am–F), 22 s, com efeitos no mesmo tom."""
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
DUR = 22.0
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)
BEAT = 0.5


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(SR * d)) / SR


def add(sig, start, gain=1.0, pan=0.0):
    i = int(round(start * SR))
    if i >= N:
        return
    sig = sig[: N - i]
    gl = gain * np.cos((pan + 1) * np.pi / 4)
    gr = gain * np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gl
    R[i:i + len(sig)] += sig * gr


def filt(x, kind, f):
    sos = butter(2, f, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x)


# ---------- instrumentos ----------
def kick():
    t = tt(0.35)
    f = 48 + 75 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 12)
    click = filt(rng.standard_normal(len(t)), 'highpass', 2500) * np.exp(-t * 400) * 0.15
    return body + click


def clap():
    t = tt(0.25)
    n = filt(rng.standard_normal(len(t)), 'bandpass', [900, 3200])
    env = np.zeros(len(t))
    for k, d in enumerate([0, 0.011, 0.022]):
        i = int(d * SR)
        env[i:] += np.exp(-(t[: len(t) - i]) * (90 if k < 2 else 22))
    return n * env * 0.5


def hat(open_=False):
    t = tt(0.18 if open_ else 0.06)
    n = filt(rng.standard_normal(len(t)), 'highpass', 7500)
    return n * np.exp(-t * (18 if open_ else 70))


def bass(m, d):
    t = tt(d)
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)
    env = np.minimum(t / 0.006, 1) * np.exp(-t * 3.2)
    return s * env


def epiano(m, d, detune=0.0):
    t = tt(d + 0.6)
    f = hz(m) * (1 + detune)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2)
         + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 4.5)
         + 0.12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 7)
         + 0.08 * np.sin(2 * np.pi * 4.02 * f * t) * np.exp(-t * 12))
    env = np.minimum(t / 0.004, 1)
    rel = np.clip((d + 0.6 - t) / 0.6, 0, 1)
    return s * env * rel


def pad(ms, d):
    t = tt(d)
    s = sum(np.sin(2 * np.pi * hz(m) * t) + 0.3 * np.sin(2 * np.pi * hz(m) * 1.003 * t) for m in ms)
    env = np.minimum(t / 0.4, 1) * np.clip((d - t) / 0.4, 0, 1)
    return filt(s * env, 'lowpass', 1800)


def lead(m, d):
    t = tt(d + 0.25)
    f = hz(m)
    s = sum((1 / k) * np.sin(2 * np.pi * k * f * t) * np.exp(-t * (3 + k * 1.2)) for k in range(1, 9))
    env = np.minimum(t / 0.005, 1) * np.clip((d + 0.25 - t) / 0.25, 0, 1)
    return filt(s * env, 'lowpass', 6500)


def bell(ms, d=0.9):
    t = tt(d)
    s = sum(np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 4) + 0.3 * np.sin(2 * np.pi * hz(m) * 2.76 * t) * np.exp(-t * 9) for m in ms)
    return s * np.minimum(t / 0.003, 1)


def blip(m):
    t = tt(0.09)
    return np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 55) * np.minimum(t / 0.002, 1)


def whoosh(d=0.45, up=True):
    n = rng.standard_normal(int(SR * d))
    t = tt(d)
    # filtro passa-baixa de um polo com corte que varre no tempo
    fc = (400 + 5200 * (t / d) ** 1.5) if up else (5600 - 5200 * (t / d) ** 0.7)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(n)
    acc = 0.0
    for i in range(len(n)):
        acc = (1 - a[i]) * n[i] + a[i] * acc
        y[i] = acc
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return filt(y * env, 'highpass', 250)


# ---------- arranjo ----------
CHORDS = {'C': [60, 64, 67], 'G': [59, 62, 67], 'Am': [57, 60, 64], 'F': [57, 60, 65]}
ROOT = {'C': 36, 'G': 43, 'Am': 45, 'F': 41}
PROG = ['C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G', 'C']
K, CL = kick(), clap()

for b, ch in enumerate(PROG):
    t0 = b * 2.0
    final = b == 10
    # pad o tempo todo, baixinho
    add(pad(CHORDS[ch], 2.2 if not final else 2.0), t0, 0.05, 0)
    if final:
        for m, pn in zip(CHORDS['C'] + [72], [-.4, .1, .4, -.1]):
            add(epiano(m, 1.4), t0, 0.32, pn)
        add(bass(36, 1.6), t0, 0.38)
        add(K, t0, 0.55)
        add(filt(hat(True), 'lowpass', 12000), t0, 0.3, 0.2)
        continue
    # acordes em pluck: 1, "e" do 2, 4
    for off in (0, 0.75, 1.5):
        for m, pn in zip(CHORDS[ch], [-.35, 0, .35]):
            add(epiano(m, 0.35, 0.0015), t0 + off, 0.2, pn - .05)
            add(epiano(m, 0.35, -0.0015), t0 + off, 0.2, pn + .05)
    # bumbo em todos os tempos (pausa na metade do compasso 8 para respirar)
    for k in range(4):
        if b == 8 and k in (2, 3):
            continue
        add(K, t0 + k * BEAT, 0.5)
    # baixo a partir do compasso 1
    if b >= 1:
        for k, (off, oct_) in enumerate([(0, 0), (0.5, 0), (0.75, 12), (1.0, 0), (1.5, 0), (1.75, 12)]):
            add(bass(ROOT[ch] + oct_, 0.24), t0 + off, 0.3)
    # palmas e chimbal a partir do compasso 2
    if b >= 2:
        for k in (1, 3):
            add(CL, t0 + k * BEAT, 0.5, 0.05)
        for e in range(8):
            add(hat(e % 2 == 1 and e == 7), t0 + e * 0.25 + (0.012 if e % 2 else 0), 0.26 if e % 2 else 0.16, 0.3)
    # virada antes do desfecho
    if b == 9:
        for k in range(4):
            add(CL, t0 + 1.5 + k * 0.125, 0.12 + 0.05 * k, 0.05)

# melodia a partir da cena 3 (t = 8 s)
MEL = [(8.0, 76, .3), (8.5, 79, .2), (8.75, 81, .3), (9.25, 79, .4),
       (10.0, 74, .3), (10.5, 79, .2), (10.75, 83, .3), (11.25, 81, .4),
       (12.0, 76, .3), (12.5, 72, .2), (12.75, 76, .3), (13.25, 79, .4),
       (14.0, 77, .3), (14.5, 76, .2), (14.75, 74, .3), (15.25, 72, .5),
       (16.0, 76, .3), (16.5, 79, .2), (16.75, 81, .3), (17.25, 84, .5),
       (18.0, 83, .3), (18.5, 81, .2), (18.75, 79, .3), (19.25, 74, .4),
       (20.0, 84, 1.2)]
for t0, m, d in MEL:
    add(lead(m, d), t0, 0.3, -0.15)
    add(lead(m - 12, d), t0 + 0.01, 0.08, 0.25)

# ---------- efeitos no mesmo tom ----------
for t0, m in [(0.25, 72), (0.35, 76), (0.45, 79)]:  # círculos do logo encaixando
    add(epiano(m, 0.25), t0, 0.16, (m - 76) / 10)
add(bell([84, 88]), 1.45, 0.05, 0.1)                 # "estampar" entra no registro
for t0 in (3.0, 7.0, 11.5, 15.5):                     # trocas de cena
    add(whoosh(0.42), t0 - 0.2, 0.09, 0)
add(whoosh(0.5), 18.25, 0.11, 0)                      # cortina do desfecho
for t0 in (8.5, 9.5, 12.5, 13.5, 14.5, 20.5):         # cliques do cursor
    add(blip(91), t0, 0.06, 0.2)
    add(filt(rng.standard_normal(200), 'highpass', 3000) * np.exp(-np.arange(200) / 30), t0, 0.03, 0.2)
add(bell([84, 88, 91], 1.0), 9.56, 0.07, 0)           # ampliação abre
for i, t0 in enumerate((15.65, 15.75, 15.85)):        # cards de datas
    add(epiano([79, 83, 86][i], 0.15), t0, 0.07, -.3 + .3 * i)

# ---------- mixagem ----------
mix = np.stack([L, R])
mix = filt(mix, 'highpass', 30)
# equalização do master: menos embolado em 150–400 Hz, mais brilho acima de 2,5 kHz
mix = mix - 0.35 * filt(mix, 'bandpass', [150, 400]) + 0.9 * filt(mix, 'highpass', 2500)
fade = np.ones(N)
fi = int(21.0 * SR)
fade[fi:] = np.linspace(1, 0, N - fi) ** 1.5
fade[:int(0.01 * SR)] = np.linspace(0, 1, int(0.01 * SR))
mix *= fade
# compressão suave + limitador
peak = np.max(np.abs(mix))
mix = mix / peak
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
rms = np.sqrt(np.mean(mix[:, :fi] ** 2))
mix = mix * (10 ** (-16.5 / 20) / rms)
mix = mix * min(1.0, 0.89 / np.max(np.abs(mix)))
rms = np.sqrt(np.mean(mix[:, :fi] ** 2))
print('peak', np.max(np.abs(mix)), 'rms dBFS', 20 * np.log10(rms))
wavfile.write('audio.wav', SR, (mix.T * 32767).astype(np.int16))
