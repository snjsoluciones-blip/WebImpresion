import s from "./LuigiEgg.module.css";

// Personaje propio de SNJ: un gánster tano canoso de traje gris a rayas, sombrero negro y habano.
export default function Nonno() {
  return (
    <svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="lg-raya" width="11" height="11" patternUnits="userSpaceOnUse">
          <rect width="11" height="11" fill="#26272c" />
          <path d="M5.5 0V11" stroke="#4b4d55" strokeWidth="0.9" />
        </pattern>
        <radialGradient id="lg-piel" cx="0.42" cy="0.38" r="0.72">
          <stop offset="0" stopColor="#f3c19c" />
          <stop offset="0.65" stopColor="#dfa07a" />
          <stop offset="1" stopColor="#b97654" />
        </radialGradient>
        <radialGradient id="lg-brasa">
          <stop offset="0" stopColor="#fff4c8" />
          <stop offset="0.45" stopColor="#ff8a1e" />
          <stop offset="1" stopColor="#ff3d00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lg-bigote" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4e4e0" />
          <stop offset="1" stopColor="#9d9d98" />
        </linearGradient>
        <linearGradient id="lg-habano" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5530" />
          <stop offset="1" stopColor="#4e2c15" />
        </linearGradient>
      </defs>

      {/* Saco a rayas, camisa y corbata roja */}
      <path d="M28 620 L28 480 C38 396 108 360 200 355 C292 360 362 396 372 480 L372 620Z" fill="url(#lg-raya)" />
      <path d="M162 358 L200 452 L238 358Z" fill="#f4f2ec" />
      <path d="M191 374 L209 374 L205 392 L195 392Z" fill="#8f1d17" />
      <path d="M195 392 L205 392 L214 440 L200 454 L186 440Z" fill="#b3261e" />
      <path d="M162 358 L200 454 L176 480 L124 404 C138 382 150 366 162 358Z" fill="#1c1d21" />
      <path d="M238 358 L200 454 L224 480 L276 404 C262 382 250 366 238 358Z" fill="#1c1d21" />
      <path d="M92 432 l32 -5 l-5 -12 l-8 7 l-6 -9 l-5 10 l-7 -4Z" fill="#f4f2ec" />
      <circle cx="200" cy="470" r="4" fill="#0e0e10" />

      <g className={s.cabeza}>
        {/* Cuello */}
        <path d="M164 326 L164 366 Q200 392 236 366 L236 326Z" fill="#cf8d68" />
        <path d="M162 356 L200 398 L178 410Z M238 356 L200 398 L222 410Z" fill="#fbfaf6" />

        {/* Orejas y cabeza */}
        <ellipse cx="108" cy="248" rx="16" ry="25" fill="url(#lg-piel)" />
        <ellipse cx="292" cy="248" rx="16" ry="25" fill="url(#lg-piel)" />
        <path d="M104 238 q6 10 0 22 M296 238 q-6 10 0 22" stroke="#a9694a" strokeWidth="2" fill="none" />
        <path d="M108 236 C108 160 150 128 200 128 C250 128 292 160 292 236 C292 300 252 348 200 348 C148 348 108 300 108 236Z" fill="url(#lg-piel)" />
        <path d="M124 300 C140 340 170 352 200 352 C230 352 260 340 276 300" stroke="#b97654" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Pelo blanco a los costados */}
        <path d="M110 200 C94 216 96 254 112 274 C108 250 116 226 128 206Z" fill="#efefec" />
        <path d="M290 200 C306 216 304 254 288 274 C292 250 284 226 272 206Z" fill="#efefec" />

        {/* Sombrero negro con cinta bordó */}
        <ellipse cx="200" cy="190" rx="124" ry="19" fill="#121215" />
        <path d="M114 184 C112 128 140 94 200 94 C262 94 290 128 288 184Z" fill="#1b1b1f" />
        <path d="M168 102 Q200 124 234 102" stroke="#2f2f36" strokeWidth="3" fill="none" />
        <path d="M114 164 C152 156 250 156 288 164 L288 184 C250 176 152 176 114 184Z" fill="#7a1d18" />
        <path d="M130 120 C140 108 160 100 180 98" stroke="#3a3a42" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M112 202 C150 214 250 214 288 202 L288 196 C250 206 150 206 112 196Z" fill="#000" opacity="0.18" />

        {/* Cejas: una enojada, otra levantada */}
        <path d="M130 226 C146 220 170 224 186 238 C168 232 148 230 130 234Z" fill="#efefec" />
        <path d="M270 216 C256 204 230 206 214 220 C232 214 252 216 270 224Z" fill="#efefec" />

        {/* Ojos entrecerrados de malo */}
        <g className={s.abierto}>
          <ellipse cx="160" cy="250" rx="13" ry="7" fill="#fbf7f0" />
          <ellipse cx="240" cy="246" rx="13" ry="8" fill="#fbf7f0" />
          <circle cx="164" cy="251" r="5" fill="#2a1c13" />
          <circle cx="244" cy="247" r="5" fill="#2a1c13" />
          <circle cx="166" cy="249" r="1.5" fill="#fff" />
          <circle cx="246" cy="245" r="1.5" fill="#fff" />
          <path d="M145 251 C146 238 174 240 175 251Z" fill="#d99a74" />
          <path d="M225 246 C228 236 252 236 255 246Z" fill="#d99a74" />
          <path d="M145 251 C152 246 168 246 175 251 M225 246 C232 242 248 242 255 246" stroke="#4a2c1d" strokeWidth="2.2" fill="none" />
        </g>
        <g className={s.cerrado}>
          <path d="M146 250 Q160 258 174 250 M226 246 Q240 254 254 246" stroke="#4a2c1d" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <path d="M139 244 l-9 -4 M138 251 l-10 0 M139 258 l-9 4 M261 240 l9 -4 M262 247 l10 0 M261 254 l9 4" stroke="#b97654" strokeWidth="1.8" strokeLinecap="round" />

        {/* Cachetes */}
        <g className={s.cachetes}>
          <ellipse cx="146" cy="290" rx="19" ry="12" fill="#e07b6c" opacity="0.35" />
        </g>
        <g className={s.cachetes}>
          <ellipse cx="254" cy="290" rx="19" ry="12" fill="#e07b6c" opacity="0.35" />
        </g>

        {/* Nariz aguilena */}
        <path d="M196 236 C190 256 182 272 184 286 C188 296 212 296 216 286 C218 272 210 256 204 236Z" fill="#d88e6c" />
        <ellipse cx="195" cy="266" rx="4" ry="10" fill="#f4c6ab" opacity="0.7" />
        <ellipse cx="192" cy="290" rx="4.5" ry="2.6" fill="#7d4030" />
        <ellipse cx="208" cy="290" rx="4.5" ry="2.6" fill="#7d4030" />

        {/* Pliegues y cicatriz */}
        <path d="M166 302 Q156 326 168 348 M234 302 Q244 326 232 348" stroke="#b97654" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M262 266 l12 18" stroke="#c98b7a" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        {/* Boca */}
        <ellipse cx="212" cy="314" rx="10" ry="5.5" fill="#5a2620" />
        <circle id="luigi-boca" cx="212" cy="314" r="1" fill="none" />

        {/* Bigote canoso con puntas */}
        <g className={s.bigote}>
          <path
            id="lg-bigote-izq"
            d="M200 296 C186 285 160 287 145 300 C130 313 110 311 102 295 C98 286 104 277 113 281 C107 288 113 297 122 294 C134 290 141 279 161 279 C181 279 193 285 200 291Z"
            fill="url(#lg-bigote)"
          />
          <use href="#lg-bigote-izq" transform="matrix(-1 0 0 1 400 0)" />
          <path d="M150 292 q14 -6 30 -4 M250 292 q-14 -6 -30 -4" stroke="#868681" strokeWidth="1.4" fill="none" />
        </g>
      </g>

      {/* Brazo con el habano */}
      <g className={s.brazo}>
        <path d="M296 640 L394 640 L342 392 L284 380Z" fill="url(#lg-raya)" />
        <path d="M285 382 L341 394 L338 410 L282 398Z" fill="#f4f2ec" />
        <g transform="rotate(-10 290 352)">
          <rect x="250" y="344" width="68" height="14" rx="6" fill="url(#lg-habano)" />
          <rect x="262" y="344" width="8" height="14" fill="#c9a24a" />
          <rect x="312" y="344" width="7" height="14" rx="2" fill="#8d8a85" />
          <circle id="luigi-brasa" className={s.brasa} cx="320" cy="351" r="8" fill="url(#lg-brasa)" />
        </g>
        <ellipse cx="300" cy="370" rx="27" ry="22" fill="url(#lg-piel)" />
        <path d="M280 362 q11 -7 24 -3 M278 372 q12 -7 27 -3 M281 382 q11 -5 23 -2" stroke="#a9694a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <rect x="282" y="372" width="9" height="7" rx="2" fill="#c9a24a" />
      </g>
    </svg>
  );
}
