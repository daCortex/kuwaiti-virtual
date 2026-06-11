#!/usr/bin/perl -0pi
# Site-wide Finnair -> Kuwaiti rebrand. Run via xargs -0 over text files.

# ---- Brand name (specific before generic) ----
s/Finnair Virtual/Kuwaiti Virtual/g;
s/Finnair Plus/BlueBird Rewards/g;

# ---- Logo asset paths ----
s/finnair-emblem-navy\.png/kuva-emblem-navy.svg/g;
s/finnair-emblem-white\.png/kuva-emblem-white.svg/g;
s/finnair-emblem-black\.png/kuva-emblem-navy.svg/g;
s/finnair-wordmark\.png/kuva-emblem-navy.svg/g;

# ---- Generic name / callsign / identifiers ----
s/FINNAIR/KUWAITI/g;
s/Finnair/Kuwaiti/g;

# ---- Points economy ----
s/Aurora Points/BlueBird Miles/g;
s/Aurora-Points/BlueBird Miles/g;
s/Aurora Pts/Miles/g;
s/Aurora Point/BlueBird Mile/g;
s/Aurora Banking/BlueBird Banking/g;
s/AURORA Bank/BlueBird Bank/g;
s/Aurora Bank/BlueBird Bank/g;
s/Aurora Track/BlueBird Track/g;
s/Aurora wash/Brand wash/g;
s/Aurora Run/Desert Falcon/g;

# ---- Rank renames (old ladder -> new). Standalone Aurora LAST. ----
s/\bLuminary\b/Sovereign/g;
s/\bCelestia\b/Oryx/g;
s/\bAstralis\b/Mirage/g;
s/\bZenith\b/Mirage/g;
s/\bElysian\b/Oasis/g;
s/\bSolstice\b/Oasis/g;
s/\bPolaris\b/Falcon/g;
s/\bAurora\b/Starter/g;

# ---- Geography ----
s/Helsinki-Vantaa/Kuwait International/g;
s/Helsinki/Kuwait City/g;
s/\bEFHK\b/OKBK/g;
s/Nordic Regional /Kuwaiti /g;
s/Nordic/Arabian/g;
s/Finnish/Kuwaiti/g;
s/Scandinavia/the Gulf/g;
s/\bBaltic\b/Gulf/g;
s/Arctic/Gulf/g;

# ---- Alliance ----
s/oneworld Discover/Alliance Discover/g;
s/oneworld/alliance/g;

# ---- Counts / numbers ----
s/Nine ranks/Seven ranks/g;
s/nine ranks/seven ranks/g;
s/nine-rank/seven-rank/g;
s/221-route/70-route/g;
s/221 routes/70 routes/g;
s/5,000 hours/1,000 hours/g;
