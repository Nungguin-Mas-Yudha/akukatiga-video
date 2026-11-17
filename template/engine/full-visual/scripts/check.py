#!/usr/bin/env python3
"""The mechanical review. Each check is a defect measured on the reference reels; it fails here so he never sees it.

  check.py stage <slug> <n>       the gate at the end of stage n: that stage's work is actually on disk
  check.py plan <slug>            before any pixel: caption, blocks, scene boundaries, type sizes in the scenes
  check.py render <slug> <mp4>    after a render: dead holds and bare ground inside a handover
  check.py compare <slug> <mp4> --ref <reference.mp4>
                                  side by side against a reference reel: review/side-by-side.jpg + scorecard.md
  check.py calibrate <ref.mp4>    rewrite scripts/targets.json from the reference the creator named
A format-2 reel (words.json "format": 2) is checked by check2.py instead.

Exit code 1 if anything is marked FAIL. WARN is a judgement call: read it, decide, move on.
"""
import json, os, re, shutil, subprocess, sys, tempfile, time
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT.parent.parent / "videos"  # videos/<slug>/{plans,storyboard,assets,composition}
FORMATS = ("reels", "landscape")
MIN_TYPE = 32       # px at 1080 wide: below this a claim is texture on a phone
MAX_BLOCK_WORDS = 8
MIN_SILENCE = 0.15  # s: a scene can only hand over in a real gap between sentences
MAX_STILL = 1.2     # s with nothing moving, caption included
PACE = (3.3, 3.5)   # words a second, a reel: the creator's touchscreen pace (2026-10-21)
PACE_LANDSCAPE = (2.5, 2.7)  # 150-160 words a minute, a 16:9 film (script-recipe.md)
fails = 0


def say(level, msg):
    global fails
    fails += level == "FAIL"
    print(f"{level:4}  {msg}")


def pace(reel, d, targets=None):
    """his voice rule (2026-10-21, touchscreen): 3.3 to 3.5 words a second, a 0.30 s breath at each paragraph start,
    every other pause 0.2 s. Paragraph starts come from the blank lines of script.txt."""
    targets = targets or [(PACE, "a reel")]
    words, dur = d["words"], d["duration"]
    rate = len(words) / dur
    ok = any(lo <= round(rate, 1) <= hi for (lo, hi), _ in targets)
    want = " or ".join(f"{lo} to {hi} ({why})" for (lo, hi), why in targets)
    say("ok" if ok else "FAIL", f"pace {rate:.2f} words a second over {dur:.1f} s"
        + ("" if ok else f": the target is {want}. Faster tags and commas in the script,"
           " or one uniform atempo on the RAW take before tighten.py (full-visual references/01, \"Pace\")"))
    script = reel / "script.txt"
    if not script.exists():
        return
    starts, n = set(), 0
    for para in re.split(r"\n\s*\n", script.read_text().strip()):
        starts.add(n)
        n += len(para.split())
    if n != len(words):
        say("WARN", f"script.txt has {n} words, words.json {len(words)}: paragraph breaths not checked")
        return
    for a, b in d["silences"]:
        nxt = next((i for i, x in enumerate(words) if x["t"] >= b - 0.06), None)
        if nxt is None or nxt < d["scenes"][1]["firstWord"] or b - a <= 0.25:  # the hook is never trimmed
            continue
        if nxt in starts and nxt > 1:
            if b - a > 0.45:
                say("WARN", f"breath before \"{words[nxt]['w']}\" at {a:.2f} s is {b - a:.2f} s: the paragraph breath is 0.30 s")
        else:
            say("WARN", f"pause before \"{words[nxt]['w']}\" at {a:.2f} s is {b - a:.2f} s inside a paragraph: every pause but the paragraph breath is 0.2 s")


def plan(slug, strict_scenes=False):
    reel = VIDEOS / slug / "plans"
    d = json.loads((reel / "words.json").read_text())
    words, blocks, scenes = d["words"], d["blocks"], d["scenes"]

    for a, b in zip(words, words[1:]):
        if b["t"] - a["t"] < 0.03:
            say("WARN", f"\"{a['w']}\" and \"{b['w']}\" start {b['t'] - a['t']:.2f} s apart: check the alignment there")
    since_key = 0
    for i, b in enumerate(blocks):
        text = " ".join(words[w]["w"] for w in b["words"])
        keys = sum(1 for w in b["words"] if words[w].get("key"))
        emoji = sum(1 for w in b["words"] if words[w].get("emoji"))
        if len(b["words"]) > MAX_BLOCK_WORDS:
            say("FAIL", f"block {i} has {len(b['words'])} words (\"{text}\"): {MAX_BLOCK_WORDS} at most")
        if keys > 1:
            say("FAIL", f"block {i} marks {keys} key words (\"{text}\"): one per block, or the mark means nothing")
        if emoji > 1:
            say("FAIL", f"block {i} has {emoji} emoji (\"{text}\"): one per block")
        since_key = 0 if keys else since_key + 1
        if since_key == 3:
            say("WARN", f"three blocks in a row without a key word, ending at \"{text}\": every number, name and obligation verb gets one")

    for s, nxt in zip(scenes, scenes[1:]):
        a, b = words[nxt["firstWord"] - 1]["e"], words[nxt["firstWord"]]["t"]
        gap = max((min(b, y) - max(a, x) for x, y in d["silences"]), default=0)
        level = "FAIL" if gap < MIN_SILENCE else "ok"
        say(level, f"scene \"{s['id']}\" -> \"{nxt['id']}\" hands over at {(a + b) / 2:.2f} s inside {max(gap, 0):.2f} s of silence"
            + ("" if level == "ok" else f": it needs {MIN_SILENCE} s. Start the scene at a sentence boundary"))

    base = reel.parent
    fmts = [f for f in FORMATS if (base / "compositions" / f).is_dir()]
    if len(fmts) == 1:
        pace(reel, d, [(PACE_LANDSCAPE, "a 16:9 film")] if fmts[0] == "landscape" else [(PACE, "a reel")])
    elif not fmts:
        pace(reel, d, [(PACE, "a reel")])
    else:
        pace(reel, d, [(PACE, "a reel"), (PACE_LANDSCAPE, "a 16:9 film")])

    base = reel.parent
    known = {s["id"] for s in scenes}
    composition_checks(base, known, strict_scenes)
    print(f"plan: {len(scenes)} scenes, {len(blocks)} blocks, {len(words)} words, {d['duration']} s")


def composition_checks(base, known, strict=False, only=None, required=False):
    """Scenes must sit in a format folder and be registered. Missing anything renders as bare ground."""
    flat = next((base / n for n in ("compositions", "composition")
                 if (base / n).is_dir() and any(p.name != "index.tsx" for p in (base / n).glob("*.tsx"))), None)
    if flat is not None:
        say("FAIL", f"{flat.name}/ has scene files directly inside it: name the format, "
                    f"compositions/reels/ or compositions/landscape/ (videos/example/README.md)")
    root_index = base / "compositions" / "index.tsx"
    if root_index.exists():
        say("FAIL", "compositions/index.tsx sits one level too high: each format folder has its own "
                    "compositions/<format>/index.tsx")
    fmts = [only] if only else [f for f in FORMATS if (base / "compositions" / f).is_dir()]
    if not fmts:
        if required and flat is None:
            say("FAIL", "no compositions/reels/ or compositions/landscape/: nothing to render")
        return
    for f in fmts:
        d = base / "compositions" / f
        idx = d / "index.tsx"
        if not idx.exists():
            say("FAIL", f"compositions/{f}/index.tsx missing: the scenes in this format are not registered")
            continue
        keys = set(re.findall(r'^\s*"?([\w-]+)"?\s*:', idx.read_text(), re.M))
        if known and not (keys & known):
            say("FAIL", f"compositions/{f}/index.tsx registers none of the take's scenes: it is not the index "
                        f"for this video")
            continue
        for sid in sorted(known - keys):
            say("WARN" if not strict else "WARN",
                f"scene \"{sid}\" from words.json is not in compositions/{f}/index.tsx: fine only if this "
                f"format deliberately leaves that beat out, otherwise it renders as caption over bare ground")
        for tsx in sorted(d.glob("*.tsx")):
            for n, line in enumerate(tsx.read_text().splitlines(), 1):
                for size in re.findall(r"fontSize:\s*(\d+)", line):
                    if int(size) < MIN_TYPE and "texture" not in line:
                        say("WARN", f"{tsx.name}:{n} type at {size} px: under {MIN_TYPE} px nobody reads it on a phone. "
                                    f"Enlarge it, or end the line with // texture")


def frames(mp4, w=90, h=160, fps=30):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-vf", f"fps={fps},scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.int16), fps


def render(slug, mp4):
    d = json.loads((VIDEOS / slug / "plans" / "words.json").read_text())
    a, fps = frames(mp4)
    diff = np.abs(a[1:] - a[:-1]).mean(axis=(1, 2))
    still, start, worst = diff < 0.12, None, (0.0, 0.0)
    for i, q in enumerate(list(still) + [False]):
        if q and start is None:
            start = i
        elif not q and start is not None:
            if (i - start) / fps > worst[0] and i < len(diff) - 2:  # the last frame may hold
                worst = ((i - start) / fps, start / fps)
            start = None
    say("FAIL" if worst[0] > MAX_STILL else "ok", f"longest stretch with nothing moving: {worst[0]:.2f} s at {worst[1]:.2f} s (limit {MAX_STILL} s)")

    # bare ground inside a handover: the stage band is flat for more than 2 frames
    stage = a[:, int(160 * 520 / 1920):int(160 * 1450 / 1920), :]
    for s, nxt in zip(d["scenes"], d["scenes"][1:]):
        mid = (d["words"][nxt["firstWord"] - 1]["e"] + d["words"][nxt["firstWord"]]["t"]) / 2
        lo, hi = max(0, int((mid - 0.4) * fps)), min(len(stage), int((mid + 0.4) * fps))
        bare = [i for i in range(lo, hi) if stage[i].std() < 2.0]
        run = max((len(g) for g in np.split(bare, np.where(np.diff(bare) != 1)[0] + 1)), default=0) if bare else 0
        say("FAIL" if run > 1 else "ok", f"handover into \"{nxt['id']}\" at {mid:.2f} s: {run} bare frames at 30 fps (more than 1 reads as a dropped frame)")

    against_targets(mp4)


def words_of(base):
    f = base / "plans" / "words.json"
    return json.loads(f.read_text()) if f.exists() else None


def asset_rows(base):
    """Rows of plans/assets*.md (one file, or one per format), without the header and the separator.
    None when no assets file exists at all."""
    files = [base / "plans" / "assets.md"] if (base / "plans" / "assets.md").exists() else \
        sorted((base / "plans").glob("assets-*.md"))
    if not files:
        return None
    rows = []
    for f in files:
        for line in f.read_text().splitlines():
            s = line.strip()
            if not s.startswith("|"):
                continue
            cells = [c.strip().strip("`") for c in s.strip("|").split("|")]
            if not any(cells) or all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
                continue
            if cells[0].lower() in ("objek", "object", "obj"):
                continue
            rows.append(cells)
    return rows


def stage_checks(base, n):
    """One stage's gate: is that stage's work actually on disk.

    1 script · 2 voice · 3 treatment and plan · 4 assets · 5 composition · 6 deliver
    """
    plans, assets = base / "plans", base / "assets"
    d = words_of(base)

    if n == 1:
        scripts = [p for p in [plans / "script.txt", *(plans / f"script-{f}.txt" for f in FORMATS)] if p.exists()]
        if not scripts:
            say("FAIL", "no script: write plans/script.txt before stage 2")
        for p in scripts:
            count = len(p.read_text().split())
            say("ok" if count >= 30 else "FAIL",
                f"{p.name}: {count} words" + ("" if count >= 30 else " — under 30 words is a placeholder, not a script"))
        cap = plans / "caption.txt"
        if cap.exists() and cap.read_text().strip():
            say("ok", "caption.txt exists")
        else:
            say("WARN", "no plans/caption.txt: stage 1 writes the caption together with the script")

    elif n == 2:
        voices = sorted(assets.glob("voice*.mp3")) if assets.is_dir() else []
        say("ok" if voices else "FAIL", "voice take: " + (", ".join(v.name for v in voices) if voices
            else "no assets/voice*.mp3 — never splice a take, regenerate it whole"))
        if d is None:
            say("FAIL", "no plans/words.json: run align.py after the take")
            return
        say("ok", f"words.json: {len(d['words'])} words, {d['duration']} s")
        if not (plans / "voice.alignment.json").exists():
            say("WARN", "no plans/voice.alignment.json: keep the alignment file the voice step writes")
        plan(base.name)  # blocks, one key word, scene handovers, pace, type sizes

    elif n == 3:
        for name, why in (("treatment.md", "the concept, the thread object, the HANDOFF table, plant-and-payoff"),
                          ("plan.md", "one line per beat: actor, place, trigger word, angle, why the camera moves")):
            p = plans / name
            if not p.exists() or len(p.read_text().strip()) < 40:
                say("FAIL", f"plans/{name} missing or a stub: {why}")
        t = (plans / "treatment.md").read_text() if (plans / "treatment.md").exists() else ""
        if t and "HANDOFF" not in t and (base / "compositions" / "reels").is_dir():
            say("WARN", "treatment.md has no HANDOFF table: the thread object is what the reel hangs on")
        p = plans / "plan.md"
        if d:
            body = "\n".join(f.read_text() for f in sorted(plans.glob("plan*.md")))
            for sid in (s["id"] for s in d["scenes"]):
                if sid not in body:
                    say("FAIL", f"scene \"{sid}\" is in words.json but not in plan.md: every scene needs its beat")

    elif n == 4:
        rows = asset_rows(base)
        if rows is None:
            say("FAIL", "no plans/assets.md: stage 4 is not done and stage 5 may not start")
            return
        if not rows:
            say("FAIL", "plans/assets.md has no object rows")
        covered = set()
        for cells in rows:
            obj = cells[0] or "(no name)"
            if len(cells) < 7:
                say("FAIL", f"assets.md row \"{obj}\": {len(cells)} columns, the table needs 7 "
                            f"(objek | scene | jenis | file | sumber | lisensi | status)")
                continue
            _, scene, kind, file, src, lic, _ = cells[:7]
            covered.update(x for x in re.split(r"[,\s]+", scene) if x)
            code = file in ("(kode)", "kode") or kind.lower() in ("kode", "code")
            if not file:
                say("FAIL", f"assets.md row \"{obj}\": no file")
            elif not code and file.startswith("_source/"):
                say("FAIL", f"assets.md row \"{obj}\": assets/{file} is a mood reference, not a screen asset. "
                            f"Draw or fetch the object itself and name the file after it")
            elif not code and not (assets / file).exists():
                say("FAIL", f"assets.md row \"{obj}\": assets/{file} does not exist")
            if not src:
                say("FAIL", f"assets.md row \"{obj}\": no source — even an object drawn in code needs its reference")
            if not code and not lic:
                say("FAIL", f"assets.md row \"{obj}\": no licence (write \"tidak diketahui\" when it could not be read)")
        for sid in sorted({s["id"] for s in (d or {}).get("scenes", [])} - covered):
            say("FAIL", f"scene \"{sid}\" has no row in assets.md: list its objects, or write the scene as "
                        f"\"tanpa aset\" if it truly shows nothing")
        if rows:
            say("ok", f"assets.md: {len(rows)} object rows")
        only_mood = assets.is_dir() and not any(p.is_file() for p in assets.iterdir())
        if only_mood and (base / "compositions").is_dir():
            say("FAIL", "assets/ holds only _source/: mood references are not screen assets. A scene already exists, "
                        "so the object files it is supposed to use were never collected")

    elif n == 5:
        if asset_rows(base) is None:
            say("FAIL", "scenes exist but plans/assets.md does not: that is the skipped stage, not the work. "
                        "Do stage 4 first, scene files stay as they are until the objects are collected")
        known = {s["id"] for s in d["scenes"]} if d else set()
        fmts = [f for f in FORMATS if (base / "compositions" / f).is_dir()]
        composition_checks(base, known, strict=True, required=True)
        for f in fmts:
            say("ok", f"compositions/{f}/ present")

    elif n == 6:
        outs = sorted((base / "out").rglob("*.mp4")) if (base / "out").is_dir() else []
        if not outs:
            say("FAIL", "no master in videos/<slug>/out/<day>/: render it before delivering")
        else:
            m = max(outs, key=lambda p: p.stat().st_mtime)
            srcs = [p for p in base.rglob("*") if p.is_file() and p.suffix != ".mp4" and "out" not in p.parts]
            newer = [p for p in srcs if p.stat().st_mtime > m.stat().st_mtime + 1]
            if newer:
                say("FAIL", f"{m.relative_to(base)} is older than {newer[0].relative_to(base)}: render again")
            else:
                say("ok", f"master {m.relative_to(base)}, {m.stat().st_size / 1e6:.1f} MB")
            r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(m)],
                               capture_output=True, text=True)
            try:
                length = float(r.stdout.strip())
            except ValueError:
                length = 0.0
            if d and length and abs(length - float(d["duration"])) > 0.6:
                say("FAIL", f"master is {length:.2f} s but words.json says {d['duration']} s: picture and take disagree")
        cap = plans / "caption.txt"
        reels = any((base / n).is_dir() for n in ("compositions", "composition"))
        if reels:
            if not cap.exists() or not cap.read_text().strip():
                say("FAIL", "no plans/caption.txt: the upload needs its caption")
            else:
                text = cap.read_text().strip()
                lines = [l for l in text.splitlines() if l.strip() and not l.lstrip().startswith(("#", "=="))]
                say("ok", f"caption.txt: {len(lines)} caption line" + ("s" if len(lines) != 1 else ""))
                if "—" in text or "–" in text:
                    say("WARN", "caption.txt has an em or en dash: banned on this channel")
        say("WARN", "loudness is normalized by render.mjs to -14 LUFS / -1.5 dBTP: confirm on the final file with ffmpeg ebur128")

    else:
        sys.exit("check.py stage <slug> <1-6>")


def stage(slug, n):
    """The gate is cumulative: stage 5 cannot pass while assets is empty, however good the scenes look."""
    base = VIDEOS / slug
    if not base.is_dir():
        say("FAIL", f"no video folder {base}")
        return
    blocked = []
    for k in range(1, n + 1):
        before = fails
        print(f"-- stage {k}")
        stage_checks(base, k)
        if fails != before:
            blocked.append(k)
            print(f"stage {k}: FAILED")
    if blocked:
        print(f"stage {n}: {slug} BLOCKED by stage {', '.join(map(str, blocked))}")
    else:
        print(f"stage {n}: {slug} ok")


def compare(slug, mp4, ref):
    """Side by side against a reference reel, at the same three moments, plus the numbers that judge them."""
    base = VIDEOS / slug
    ours, theirs = Path(mp4), Path(ref)
    missing = [str(p) for p in (ours, theirs) if not p.exists()]
    if missing:
        say("FAIL", "no file: " + ", ".join(missing))
        return

    def length(p):
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                           capture_output=True, text=True)
        return float(r.stdout.strip() or 0)

    do, dt = length(ours), length(theirs)
    if do and dt and abs(do - dt) / max(do, dt) > 0.25:
        say("WARN", f"length {do:.1f} s against {dt:.1f} s: compare the same moments, not the same fraction of a different edit")

    out = base / "review"
    out.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="check-compare-"))
    rows = []
    for i, frac in enumerate((0.1, 0.45, 0.8)):
        tiles = []
        for j, (p, total) in enumerate(((theirs, dt), (ours, do))):
            f = tmp / f"{i}-{j}.png"
            subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(0.0, frac * total):.3f}", "-i", str(p),
                            "-frames:v", "1", "-vf", "scale=270:480", "-y", str(f)], check=True)
            tiles.append(f)
        row = tmp / f"row{i}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(tiles[0]), "-i", str(tiles[1]),
                        "-filter_complex", "hstack=inputs=2", "-y", str(row)], check=True)
        rows.append(row)
    args = []
    for r in rows:
        args += ["-i", str(r)]
    sheet = out / "side-by-side.jpg"
    subprocess.run(["ffmpeg", "-v", "error", *args, "-filter_complex", f"vstack=inputs={len(rows)}",
                    "-y", str(sheet)], check=True)
    shutil.rmtree(tmp, ignore_errors=True)

    a, _ = frames(ours)
    b, _ = frames(theirs)
    card = out / "scorecard.md"
    card.write_text(f"""# Scorecard — {slug}

| | reference | this reel |
|---|---|---|
| file | `{theirs.name}` | `{ours.name}` |
| duration | {dt:.2f} s | {do:.2f} s |
| mean luma | {float(b.mean()):.1f} | {float(a.mean()):.1f} |
| contrast (std) | {float(b.std()):.1f} | {float(a.std()):.1f} |

Reference on the left, this reel on the right, at 10%, 45% and 80% of each: `side-by-side.jpg`.
Judge the same three moments in both — hook, middle, close — and write the verdict in `storyboard-and-qc.md`.
""")
    say("ok", f"wrote {sheet.relative_to(base)} and {card.relative_to(base)}")


def measured(mp4, w=90, h=160):
    """The five numbers this script can measure without a reference: brightness, contrast, motion, crushed and blown."""
    a, _ = frames(mp4, w, h)
    diff = np.abs(a[1:] - a[:-1]).mean(axis=(1, 2))
    return {"luma": round(float(a.mean()), 1),
            "contrast": round(float(a.std(axis=(1, 2)).mean()), 1),
            "motion": round(float(diff.mean()), 2),
            "black": round(float((a < 16).mean()), 3),
            "white": round(float((a > 240).mean()), 3)}


TARGETS = ROOT / "scripts" / "targets.json"


def calibrate(ref):
    """Write targets.json from a reference video the creator named: the bar for grade, tone and pace of motion."""
    p = Path(ref)
    if not p.exists():
        say("FAIL", f"no file {p}")
        return
    m = measured(p)
    tolerances = {"luma": 0.25, "contrast": 0.25, "motion": 0.40, "black": 0.05, "white": 0.05}
    data = {k: {"value": v, "tolerance": tolerances[k]} for k, v in m.items()}
    data["_source"] = p.name
    data["_date"] = time.strftime("%Y-%m-%d")
    TARGETS.write_text(json.dumps(data, indent=2) + "\n")
    say("ok", f"wrote {TARGETS.relative_to(ROOT)} from {p.name}: " + ", ".join(f"{k} {v}" for k, v in m.items()))


def against_targets(mp4):
    """A render is judged against the reference the creator named, not against a fixed taste."""
    if not TARGETS.exists():
        return
    t = json.loads(TARGETS.read_text())
    m = measured(mp4)
    for k, v in m.items():
        if k not in t:
            continue
        want, tol = t[k]["value"], t[k]["tolerance"]
        ok = abs(v - want) <= tol if k in ("black", "white") else abs(v - want) <= abs(want) * tol
        say("ok" if ok else "WARN",
            f"{k} {v} against the reference {want} ({t.get('_source', 'targets.json')}): outside {tol:.0%} is a judgement call")


def is_v2(slug):
    f = VIDEOS / slug / "plans" / "words.json"
    return f.exists() and json.loads(f.read_text()).get("format") == 2


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) >= 3 and a[0] == "stage":
        stage(a[1], int(a[2]))
    elif len(a) >= 2 and a[0] == "plan":
        plan(a[1])
    elif len(a) >= 3 and a[0] == "render":
        render(a[1], a[2])
    elif len(a) >= 2 and a[0] == "calibrate":
        calibrate(a[1])
    elif len(a) >= 3 and a[0] == "compare":
        ref = a[a.index("--ref") + 1] if "--ref" in a[:-1] else None
        if not ref:
            sys.exit("check.py compare <slug> <mp4> --ref <reference.mp4>")
        compare(a[1], a[2], ref)
    else:
        sys.exit(__doc__)
    sys.exit(1 if fails else 0)
