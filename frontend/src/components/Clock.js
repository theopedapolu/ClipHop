import React from 'react';

function Clock({spin=true,color='black',width}) {
return (
    <svg className={`absolute top-1/2 left-1/2 w-full translate-x-[-50%] md:translate-y-[-50%] ${spin ? (width > 768 ? 'spin-logo-md' : 'spin-logo') : ''}`} version="1.0" xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 300.000000 300.000000"
 preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
fill={`${spin ? 'DarkOrange' :'black'}`} stroke="none">
<path d="M1360 2990 c-331 -23 -669 -181 -919 -431 -211 -212 -350 -472 -411
-769 -31 -150 -31 -430 0 -580 92 -452 376 -829 780 -1039 133 -69 252 -111
400 -141 150 -31 430 -31 580 0 148 30 267 72 400 141 404 210 688 587 780
1039 18 85 22 140 22 290 0 150 -4 205 -22 290 -92 452 -376 829 -780 1039
-256 133 -512 182 -830 161z m430 -55 c298 -66 526 -190 740 -405 218 -217
342 -447 407 -750 26 -121 26 -439 0 -560 -65 -303 -189 -533 -407 -750 -217
-218 -447 -342 -750 -407 -121 -26 -439 -26 -560 0 -303 65 -533 189 -750 407
-218 217 -342 447 -407 750 -26 121 -26 439 0 560 65 303 189 533 407 750 231
232 473 357 800 416 103 18 418 12 520 -11z"/>
<path d="M1440 2838 c0 -29 3 -97 7 -150 5 -86 8 -98 25 -98 17 0 18 11 18
150 l0 150 -25 0 c-23 0 -25 -3 -25 -52z"/>
<path d="M1587 2858 c-11 -63 -19 -193 -12 -186 9 9 33 218 24 218 -4 0 -9
-15 -12 -32z"/>
<path d="M1300 2868 c0 -12 13 -104 25 -175 3 -18 10 -33 16 -33 5 0 7 10 5
23 -3 12 -10 61 -17 110 -6 48 -15 87 -20 87 -5 0 -9 -6 -9 -12z"/>
<path d="M1711 2770 c-23 -112 -24 -120 -13 -120 4 0 16 41 26 92 11 50 21
100 24 110 2 10 0 18 -5 18 -6 0 -20 -45 -32 -100z"/>
<path d="M1160 2850 c0 -31 44 -210 52 -210 12 0 10 13 -13 114 -19 83 -39
132 -39 96z"/>
<path d="M1876 2830 c-3 -8 -17 -53 -32 -99 -14 -47 -28 -91 -31 -98 -3 -7 0
-13 6 -13 12 0 74 195 68 213 -3 8 -7 7 -11 -3z"/>
<path d="M1020 2803 c0 -19 75 -203 83 -203 5 0 7 6 5 13 -3 6 -20 54 -38 105
-18 50 -37 92 -41 92 -5 0 -9 -3 -9 -7z"/>
<path d="M1970 2690 c-23 -56 -40 -104 -36 -107 3 -4 7 -4 9 -2 3 3 55 125 84
197 3 6 1 12 -4 12 -6 0 -29 -45 -53 -100z"/>
<path d="M890 2751 c0 -22 91 -202 99 -196 6 3 -12 50 -40 105 -45 93 -59 114
-59 91z"/>
<path d="M2060 2599 c-65 -122 -69 -132 -53 -144 10 -8 19 -13 19 -12 1 1 34
62 74 136 57 105 69 135 59 142 -8 5 -17 9 -21 9 -3 0 -38 -59 -78 -131z"/>
<path d="M768 2688 c-14 -12 -7 -27 62 -136 42 -68 79 -124 81 -125 2 0 12 3
21 9 15 8 8 24 -57 128 -41 66 -78 123 -83 128 -4 4 -15 2 -24 -4z"/>
<path d="M2202 2561 c-33 -49 -58 -91 -55 -95 5 -5 133 167 133 179 0 19 -25
-8 -78 -84z"/>
<path d="M643 2596 c11 -28 131 -175 139 -170 9 6 -122 183 -136 183 -4 1 -6
-5 -3 -13z"/>
<path d="M2311 2485 c-40 -47 -70 -89 -67 -92 4 -4 10 -2 14 3 5 5 36 42 71
81 34 40 61 78 59 83 -2 6 -36 -28 -77 -75z"/>
<path d="M530 2502 c0 -4 36 -43 80 -87 44 -44 80 -73 80 -65 0 8 -33 47 -72
87 -68 69 -88 83 -88 65z"/>
<path d="M2407 2393 c-43 -42 -76 -80 -75 -84 2 -4 41 28 87 70 47 43 80 80
75 84 -5 3 -44 -29 -87 -70z"/>
<path d="M430 2402 c0 -14 160 -144 172 -140 9 3 -153 148 -166 148 -3 0 -6
-4 -6 -8z"/>
<path d="M2498 2294 c-49 -37 -88 -70 -88 -76 0 -12 10 -6 103 64 42 33 77 63
77 68 0 14 4 16 -92 -56z"/>
<path d="M341 2283 c1 -13 180 -124 190 -118 5 4 -31 33 -81 66 -87 57 -111
68 -109 52z"/>
<path d="M2530 2159 c-115 -64 -132 -80 -111 -101 5 -6 248 119 270 138 5 5
-19 34 -28 33 -3 0 -62 -31 -131 -70z"/>
<path d="M273 2172 c-13 -22 -22 -16 139 -101 111 -59 117 -61 127 -42 10 18
0 26 -117 88 -70 37 -129 69 -132 71 -3 1 -10 -6 -17 -16z"/>
<path d="M2635 2064 c-49 -25 -91 -49 -93 -54 -5 -15 -3 -14 107 38 56 26 98
51 95 55 -10 10 -10 10 -109 -39z"/>
<path d="M210 2036 c0 -10 168 -86 193 -86 29 0 -2 19 -90 56 -67 28 -103 38
-103 30z"/>
<path d="M2685 1938 c-97 -33 -101 -35 -92 -44 7 -8 207 58 207 68 0 13 -19 9
-115 -24z"/>
<path d="M162 1900 c5 -17 198 -74 209 -63 6 6 -32 21 -88 37 -54 16 -104 31
-112 34 -8 3 -12 0 -9 -8z"/>
<path d="M2727 1815 c-54 -13 -101 -26 -104 -29 -16 -16 12 -15 93 4 118 28
124 30 124 41 0 11 7 12 -113 -16z"/>
<path d="M132 1760 c6 -18 208 -61 208 -45 0 6 -41 19 -90 28 -50 10 -97 20
-106 24 -11 4 -15 2 -12 -7z"/>
<path d="M2765 1684 c-49 -7 -99 -13 -109 -13 -12 -1 -16 -4 -10 -10 9 -9 200
12 211 23 12 12 -4 12 -92 0z"/>
<path d="M110 1612 c0 -5 39 -13 88 -17 48 -3 97 -9 110 -12 12 -3 22 -1 22 5
0 13 -28 19 -132 27 -57 5 -88 4 -88 -3z"/>
<path d="M2703 1553 c-125 -3 -133 -5 -133 -23 0 -19 7 -20 150 -20 l150 0 0
25 c0 18 -5 24 -17 23 -10 -1 -78 -4 -150 -5z"/>
<path d="M100 1480 c0 -19 7 -20 155 -20 148 0 155 1 155 20 0 19 -7 20 -155
20 -148 0 -155 -1 -155 -20z"/>
<path d="M2650 1422 c0 -6 21 -13 48 -16 134 -16 172 -17 172 -8 0 5 -42 13
-92 17 -51 3 -101 9 -110 11 -10 3 -18 1 -18 -4z"/>
<path d="M193 1348 c-40 -6 -73 -14 -73 -19 0 -12 25 -11 132 2 48 6 85 15 82
20 -6 11 -43 10 -141 -3z"/>
<path d="M2633 1294 c7 -7 172 -43 200 -44 9 0 17 4 17 8 0 5 -44 16 -97 25
-105 18 -130 21 -120 11z"/>
<path d="M265 1220 c-38 -10 -83 -21 -99 -24 -17 -4 -25 -11 -20 -16 6 -6 39
-2 84 9 41 11 87 22 103 25 15 4 27 11 27 16 0 13 -11 12 -95 -10z"/>
<path d="M2605 1179 c-3 -4 39 -21 94 -38 104 -33 121 -36 121 -23 0 10 -210
71 -215 61z"/>
<path d="M275 1088 c-100 -34 -101 -35 -91 -45 9 -9 206 57 206 69 0 13 -18 9
-115 -24z"/>
<path d="M2566 1063 c-5 -6 43 -28 182 -84 16 -6 23 -6 20 2 -2 6 -46 28 -97
50 -107 45 -96 41 -105 32z"/>
<path d="M340 965 c-47 -24 -89 -45 -95 -48 -5 -2 -7 -7 -4 -11 9 -10 199 80
199 93 0 15 -5 14 -100 -34z"/>
<path d="M2441 991 c-12 -22 -22 -14 153 -116 78 -45 100 -55 107 -44 5 8 9
17 9 21 0 5 -161 104 -252 155 -4 2 -12 -5 -17 -16z"/>
<path d="M495 935 c-27 -18 -84 -55 -127 -82 -68 -44 -75 -50 -63 -66 12 -17
21 -13 126 54 135 85 142 90 133 112 -8 22 -10 22 -69 -18z"/>
<path d="M2446 842 c19 -18 172 -122 178 -122 3 0 6 4 6 8 0 11 -166 122 -182
122 -7 0 -8 -3 -2 -8z"/>
<path d="M475 739 c-75 -57 -97 -79 -80 -79 12 0 175 123 175 132 0 16 -16 7
-95 -53z"/>
<path d="M2377 754 c-3 -3 33 -39 80 -81 46 -41 87 -72 91 -68 4 4 -11 22 -33
41 -114 98 -133 113 -138 108z"/>
<path d="M555 630 c-44 -44 -73 -80 -65 -80 15 0 160 138 160 152 0 19 -20 3
-95 -72z"/>
<path d="M2290 664 c0 -14 146 -171 154 -163 3 3 -30 43 -74 90 -43 46 -79 79
-80 73z"/>
<path d="M659 545 c-65 -76 -78 -96 -62 -94 8 1 135 145 141 161 2 4 0 8 -6 8
-5 0 -38 -34 -73 -75z"/>
<path d="M2043 582 c-9 -6 8 -46 61 -145 67 -125 74 -135 91 -123 17 12 13 21
-51 144 -38 73 -73 132 -79 132 -5 0 -16 -4 -22 -8z"/>
<path d="M2200 584 c0 -12 124 -174 133 -174 12 0 9 5 -58 97 -54 74 -75 95
-75 77z"/>
<path d="M919 498 c-23 -40 -57 -99 -75 -131 -19 -32 -34 -62 -34 -66 0 -9 30
-24 35 -19 1 2 36 63 78 135 70 123 75 134 57 143 -17 9 -24 1 -61 -62z"/>
<path d="M765 470 c-61 -88 -73 -110 -57 -110 5 0 12 6 15 13 2 6 30 47 60 89
31 43 52 80 47 83 -4 3 -34 -31 -65 -75z"/>
<path d="M1990 451 c0 -18 94 -205 97 -194 5 13 -79 202 -89 203 -5 0 -8 -4
-8 -9z"/>
<path d="M1001 347 c-36 -89 -50 -138 -34 -122 11 11 83 182 83 196 0 28 -19
-1 -49 -74z"/>
<path d="M1484 338 c3 -50 6 -120 6 -155 0 -56 2 -63 20 -63 19 0 20 7 20 155
l0 155 -26 0 -27 0 7 -92z"/>
<path d="M1872 402 c2 -4 18 -52 37 -105 19 -53 38 -97 43 -97 11 0 7 12 -34
128 -17 45 -34 82 -40 82 -5 0 -8 -4 -6 -8z"/>
<path d="M1126 298 c-16 -50 -30 -98 -33 -105 -3 -7 -1 -13 5 -13 6 0 24 45
41 99 34 110 35 111 23 111 -5 0 -21 -41 -36 -92z"/>
<path d="M1760 372 c0 -13 38 -179 45 -201 3 -8 8 -11 11 -8 8 7 -35 199 -47
212 -6 5 -9 5 -9 -3z"/>
<path d="M1265 338 c-6 -27 -35 -188 -35 -194 0 -2 4 -4 9 -4 5 0 16 42 26 93
9 50 18 100 21 110 3 9 1 17 -5 17 -6 0 -13 -10 -16 -22z"/>
<path d="M1397 343 c-3 -5 -8 -57 -11 -118 -7 -130 8 -104 18 33 7 84 5 105
-7 85z"/>
<path d="M1648 243 c14 -109 17 -121 28 -111 9 10 -20 211 -32 215 -7 2 -6
-31 4 -104z"/>
</g>
</svg>
    )
}

export default Clock;