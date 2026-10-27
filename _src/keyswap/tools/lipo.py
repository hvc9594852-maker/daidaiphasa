#!/usr/bin/env python3
"""Minimal 'lipo -create': join thin Mach-O binaries into one universal (fat) binary."""
import struct, sys
out_path, ins = sys.argv[1], sys.argv[2:]
slices = []
for p in ins:
    data = open(p, 'rb').read()
    magic, cpu, sub = struct.unpack('<III', data[:12])
    assert magic == 0xFEEDFACF, p + ' is not a 64-bit Mach-O'
    align = 14 if cpu == 0x0100000C else 12   # arm64 pages are 16 KB
    slices.append((cpu, sub, data, align))
out = bytearray(struct.pack('>II', 0xCAFEBABE, len(slices)))
off = 8 + 20 * len(slices); heads = []; blobs = []
for cpu, sub, data, align in slices:
    a = 1 << align; off = (off + a - 1) // a * a
    heads.append(struct.pack('>IIIII', cpu, sub, off, len(data), align)); blobs.append((off, data)); off += len(data)
for h in heads: out += h
for o, d in blobs:
    out += b'\0' * (o - len(out)); out += d
open(out_path, 'wb').write(out)
