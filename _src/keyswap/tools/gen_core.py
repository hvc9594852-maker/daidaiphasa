#!/usr/bin/env python3
"""Regenerate js/core.js from the website's index.html so KeySwap converts exactly like the site.
usage: python3 tools/gen_core.py /path/to/daidaiphasa/index.html js/core.js"""
import sys
src, dst = sys.argv[1], sys.argv[2]
L = open(src, encoding='utf-8').read().split('\n')
def find(prefix, start=0):
    for i in range(start, len(L)):
        if L[i].startswith(prefix):
            return i
    raise SystemExit('marker not found: ' + prefix)
a = find('  var EN = "1234567890')          # keyboard tables, braille, morse, romanizer
b = find('  var GROUPS = [', a)               # (stop before the group-language data)
c = find('  var EN_TH_DICT = {', b)           # English -> Thai reading
d = find('  function en2th(s){', c) + 3       # end of en2th
part1, part2 = '\n'.join(L[a:b]), '\n'.join(L[c:d + 1])
tail = open(__file__.replace('gen_core.py', 'core_tail.js'), encoding='utf-8').read()
open(dst, 'w', encoding='utf-8').write(
    '// KeySwap core — generated from daidaiphasa.com index.html by tools/gen_core.py; do not edit by hand.\n'
    'var KS = (function(){\n' + part1 + '\n' + part2 + '\n' + tail)
print('wrote', dst)
