#!/bin/sh
# Build KeySwap.app (universal: Apple Silicon + Intel) without a Mac. Output: build/KeySwap-Mac.zip
set -e
cd "$(dirname "$0")/.."
for a in arm64 amd64; do GOOS=darwin GOARCH=$a CGO_ENABLED=0 go build -trimpath -ldflags "-s -w" -o build/KeySwap-$a .; done
python3 tools/lipo.py build/KeySwap-universal build/KeySwap-amd64 build/KeySwap-arm64
rm -rf build/KeySwap.app && mkdir -p build/KeySwap.app/Contents/MacOS build/KeySwap.app/Contents/Resources
cp build/KeySwap-universal build/KeySwap.app/Contents/MacOS/KeySwap && chmod 755 build/KeySwap.app/Contents/MacOS/KeySwap
cp tools/Info.plist build/KeySwap.app/Contents/Info.plist
cd build && rm -f KeySwap-Mac.zip && zip -qry KeySwap-Mac.zip KeySwap.app && ls -la KeySwap-Mac.zip
