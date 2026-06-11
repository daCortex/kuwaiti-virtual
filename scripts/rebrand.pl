#!/usr/bin/perl -0pi
# Site-wide Starlux -> Finnair text rebrand. Run via xargs -0 over text files.
s/Starlux Virtual Group/Finnair Virtual/g;
s/Starlux Virtual/Finnair Virtual/g;
s/STARLUX Airlines/Finnair/g;
s/Starlux Airlines/Finnair/g;
s/STARLUX/FINNAIR/g;
s/Starwalker (\d+)JX/Finnair $1/g;
s/Starlux/Finnair/g;

s/Virtual Aviation beyond Horizons/The Nordic Way to Fly/g;
s/beyond Horizons/the Nordic Way/g;
s/Beyond Horizons/The Nordic Way to Fly/g;
s/Fly with elegance/Fly the Nordic way/g;

s/Taipei Taoyuan and Taichung/Helsinki and Rovaniemi/g;
s/Taipei Taoyuan/Helsinki-Vantaa/g;
s/Taichung/Rovaniemi/g;
s/Taipei/Helsinki/g;
s/Anchored in Taiwan/Anchored in Finland/g;
s/anchored in Taiwan/anchored in Finland/g;
s/based in Taiwan/based in Finland/g;
s/two Taiwan hubs/two Finnish hubs/g;
s/Taiwan/Finland/g;

s/recent JX flights/recent Finnair flights/g;
s/No recent JX flights/No recent Finnair flights/g;
s/\bJX flights\b/Finnair flights/g;
s/callsign ending in JX/callsign \x{201c}Finnair\x{201d}/g;

s/\bJX870\b/AY531/g;
s/\bSJX001\b/AY873/g;
s/\bJX2\b/AY15/g;
s/RCTP KLAX/EFHK EGLL/g;
s/\bRCTP\b/EFHK/g;
s/B-585\d\d/OH-LWP/g;
