#!/bin/bash
# Render one reel on the VPS Labkom GPU (RTX A4000) and bring it home, leaving the VPS clean.
# usage: ./render-labkom.sh <slug> [render.mjs flags]     env: HOST (labkm-vps), CONC (12), KEEP=1 keeps the job folder
# One job folder per run; NVIDIA GL libraries matching the host driver are extracted into it (nothing system-wide);
# Chrome for Testing with --gl angle-egl draws on the GPU. The mp4 lands in videos/<slug>/out/YYYY-MM-DD/, checked with ffprobe
# before the job folder and the Chrome profiles it left in /tmp are deleted.
set -e
HOST=${HOST:-labkm-vps}
SLUG=$1; shift
[ -z "$SLUG" ] && { echo "usage: ./render-labkom.sh <slug> [flags]"; exit 1; }
ENGINE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$ENGINE/../.." && pwd)
J=/root/render-$SLUG-$(date +%Y%m%d-%H%M%S)
echo "job $J"
ssh "$HOST" "mkdir -p $J/gpu $J/engine/full-visual $J/scripts $J/videos"
rsync -a -e ssh "$ROOT/package.json" "$ROOT/package-lock.json" "$HOST:$J/"
rsync -a -e ssh "$ROOT/scripts/" "$HOST:$J/scripts/" --exclude node_modules
rsync -a -e ssh --exclude output --exclude public --exclude node_modules "$ENGINE/" "$HOST:$J/engine/full-visual/"
# the video: plans, assets (not _source), composition; never its scratch, out or local node_modules
rsync -a -e ssh --exclude scratch --exclude out --exclude 'assets/_source' --exclude node_modules "$ROOT/videos/$SLUG" "$HOST:$J/videos/"
ssh "$HOST" bash -s <<EOF
set -e
cd $J
npm_config_cache=$J/.npm-cache npm ci --no-audit --no-fund --ignore-scripts > npm-ci.log 2>&1
v=\$(nvidia-smi --query-gpu=driver_version --format=csv,noheader | head -1)
curl -sSfo gpu/nv.run https://us.download.nvidia.com/XFree86/Linux-x86_64/\$v/NVIDIA-Linux-x86_64-\$v.run
sh gpu/nv.run --extract-only --target gpu/drv > /dev/null; rm gpu/nv.run
cd gpu/drv && ln -sf libEGL_nvidia.so.\$v libEGL_nvidia.so.0 && ln -sf libGLX_nvidia.so.\$v libGLX_nvidia.so.0 && cd $J
node -e "require('@remotion/renderer').ensureBrowser({ chromeMode: 'chrome-for-testing' })" > /dev/null
CFT=\$(ls -d $J/node_modules/.remotion/chrome-for-testing/*/*/chrome | head -1)
printf '#!/bin/sh\nexec %s --disable-gpu-watchdog --disable-gpu-process-crash-limit "\$@"\n' "\$CFT" > gpu/chrome; chmod +x gpu/chrome
touch .started
cat > run.sh <<RUN
D=$J/gpu/drv
export LD_LIBRARY_PATH=\\\$D:$J/node_modules/@remotion/compositor-linux-x64-gnu
export PATH=$J/node_modules/@remotion/compositor-linux-x64-gnu:\\\$PATH
export __EGL_VENDOR_LIBRARY_FILENAMES=\\\$D/10_nvidia.json CHROME=$J/gpu/chrome FV_RENDER_SLOTS=1
cd $J/engine/full-visual && node render.mjs $SLUG --gl angle-egl --concurrency ${CONC:-12} $* --out $J/out.mp4 > $J/render.log 2>&1 && echo ALLDONE >> $J/render.log || echo FAILED >> $J/render.log
RUN
setsid nohup bash run.sh > /dev/null 2>&1 < /dev/null &
EOF
echo "rendering (log: ssh $HOST tail -c 300 $J/render.log)"
until ssh "$HOST" "grep -qE '^(ALLDONE|FAILED)' $J/render.log 2>/dev/null"; do sleep 30; done
ssh "$HOST" "tail -c 600 $J/render.log"
ssh "$HOST" "grep -q '^ALLDONE' $J/render.log" || { echo "FAILED, job folder kept: $J"; exit 1; }
DAY=$(date +%F); mkdir -p "$ROOT/videos/$SLUG/out/$DAY"
LOCAL="$ROOT/videos/$SLUG/out/$DAY/$SLUG.mp4"
rsync -a -e ssh "$HOST:$J/out.mp4" "$LOCAL"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$LOCAL")
[ -n "$d" ] || { echo "download broken, job folder kept: $J"; exit 1; }
echo "ok $LOCAL ${d} s"
if [ -z "$KEEP" ]; then
  ssh "$HOST" "find /tmp -maxdepth 1 -name 'puppeteer_dev_chrome_profile-*' -newer $J/.started -exec rm -rf {} + ; rm -rf $J"
  echo "VPS clean ($J removed)"
fi
