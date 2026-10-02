"use client";

import { Crimson_Pro } from "next/font/google";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});



export default function StyleLabPage() {
const colors = {
  paper: "#E4C28A",
  paperLight: "#EFD39D",
  paperDark: "#C9A86F",

  graphite: "#4A443E",
  graphiteLight: "#6F6255",
  graphiteDark: "#3D352E",

  green: "#71805C",
  greenLight: "#9AA47A",

  red: "#935A5B",
  redLight: "#DA9FA0",

  blue: "#657C82",
  blueLight: "#91A5A5",

  ochre: "#B69A63",
  brown: "#795F43",

  white: "#FFF5D2",
};

  return (
    <main
      style={{
        height: "100vh",
        overflowY: "auto",
        boxSizing: "border-box",
        padding: "40px",
        color: "#3D352E",

        backgroundColor: "#E4C28A",

        backgroundImage: `
          radial-gradient(
            ellipse at center,
            transparent 55%,
            rgba(92, 58, 28, 0.16) 100%
          ),

          url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035 0.12' numOctaves='2' seed='8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.12'/%3E%3C/svg%3E"),

          url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.18'/%3E%3C/svg%3E"),

          radial-gradient(
            ellipse at 20% 20%,
            rgba(255, 240, 190, 0.35) 0%,
            transparent 45%
          ),
          radial-gradient(
            ellipse at 80% 30%,
            rgba(120, 80, 40, 0.08) 0%,
            transparent 40%
          ),
          radial-gradient(
            ellipse at 30% 80%,
            rgba(100, 65, 35, 0.07) 0%,
            transparent 45%
          ),
          radial-gradient(
            ellipse at 90% 90%,
            rgba(255, 230, 170, 0.25) 0%,
            transparent 40%
          )
        `,

        backgroundBlendMode: "multiply",
      }}
    >
      <h1
      className={crimsonPro.className}
       style={{
        margin: 0,
        color: colors.graphiteDark,
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: "-0.5px",
        lineHeight: 1.1,
    }}
      >Salmorize Style Lab</h1>

      <p
       style={{
        marginTop: 12,
        color: colors.graphiteLight,
        fontSize: 16,
        lineHeight: 1.6,
        maxWidth: 620,
        }}
      >
        Ambiente experimental para testar a nova linguagem visual do Salmorize.
      </p>

      <div
        style={{
            marginTop: 40,
            padding: 32,
            maxWidth: 600,
            backgroundColor: "rgba(239, 211, 157, 0.72)",
            border: `1px solid ${colors.graphiteLight}`,
            borderRadius: "6px 9px 7px 8px",
            boxShadow: `
                inset 0 0 24px rgba(121, 95, 67, 0.08),
                2px 3px 0 rgba(74, 68, 62, 0.06)
            `,
        }}
        
      >
        <h2>Papel</h2>

        <p>
          Esta área representa a superfície de papel que vamos usar como base
          para os próximos testes.
        </p>

        <div
          style={{
            marginTop: "32px",
            height: "120px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="pencilPressure"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="#5A534B"
                  stopOpacity="0.35"
                />
                <stop
                  offset="20%"
                  stopColor="#3D3833"
                  stopOpacity="0.8"
                />
                <stop
                  offset="45%"
                  stopColor="#514A43"
                  stopOpacity="0.55"
                />
                <stop
                  offset="65%"
                  stopColor="#39342F"
                  stopOpacity="0.85"
                />
                <stop
                  offset="85%"
                  stopColor="#625A52"
                  stopOpacity="0.45"
                />
                <stop
                  offset="100%"
                  stopColor="#4A443E"
                  stopOpacity="0.7"
                />
              </linearGradient>

              <filter
                id="pencilTexture"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="2"
                  seed="4"
                  result="noise"
                />

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="1.5"
                />
              </filter>

              <filter
                id="pencilSoftness"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="1.2" />
              </filter>

              <filter
                id="watercolorTexture"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.025"
                  numOctaves="3"
                  seed="12"
                  result="watercolorNoise"
                />

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="watercolorNoise"
                  scale="8"
                />
              </filter>
            </defs>

            {/* Colina — pigmento distante */}
            <path
              d="
                M 205 78
                C 255 52, 310 48, 365 67
                C 420 86, 480 82, 535 62
                C 560 54, 580 55, 600 60
                L 600 112
                C 520 100, 450 108, 380 96
                C 310 84, 255 92, 205 102
                Z
              "
              fill="#9EAF86"
              opacity="0.08"
              filter="url(#watercolorTexture)"
            />

            {/* Colina — primeiro pigmento */}
            <path
              d="
                M 225 108
                C 275 75, 335 72, 400 100
                C 455 124, 515 119, 590 96
                L 590 120
                L 225 120
                Z
              "
              fill="#B89A62"
              opacity="0.12"
              filter="url(#watercolorTexture)"
            />

            {/* Colina — segunda passagem */}
            <path
              d="
                M 245 106
                C 295 82, 342 80, 399 103
                C 450 124, 510 120, 580 100
                L 580 116
                C 510 128, 450 130, 395 113
                C 335 94, 290 96, 245 110
                Z
              "
              fill="#8D7650"
              opacity="0.07"
              filter="url(#watercolorTexture)"
            />

            {/* Manchas de pigmento */}
            <g
              fill="#8D7650"
              opacity="0.06"
              filter="url(#watercolorTexture)"
            >
              <ellipse cx="285" cy="92" rx="32" ry="8" />
              <ellipse cx="355" cy="101" rx="42" ry="7" />
              <ellipse cx="438" cy="106" rx="35" ry="9" />
              <ellipse cx="520" cy="103" rx="45" ry="7" />
            </g>

            {/* Transparência do papel */}
            <g fill="#E4C28A" opacity="0.12">
              <ellipse cx="310" cy="91" rx="18" ry="5" />
              <ellipse cx="390" cy="103" rx="22" ry="4" />
              <ellipse cx="475" cy="105" rx="16" ry="5" />
            </g>

            {/* Sombra do traço */}
            <path
              d="M 20 65 C 120 45, 180 75, 280 58 S 450 45, 580 62"
              fill="none"
              stroke="#4A443E"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.12"
              filter="url(#pencilSoftness)"
            />

            {/* Traço principal */}
            <path
              d="M 20 65 C 120 45, 180 75, 280 58 S 450 45, 580 62"
              fill="none"
              stroke="url(#pencilPressure)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.75"
              filter="url(#pencilTexture)"
            />

            {/* Traço secundário */}
            <path
              d="M 20 68 C 120 48, 180 78, 280 61 S 450 48, 580 65"
              fill="none"
              stroke="#6B6259"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* Mancha */}
            <path
              d="
                M 120 95
                C 145 82, 175 86, 195 98
                C 178 108, 145 111, 120 95
                Z
              "
              fill="#4A443E"
              opacity="0.18"
            />

            <path
              d="
                M 122 94
                C 145 84, 172 88, 193 98
              "
              fill="none"
              stroke="#3D3833"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.55"
              strokeDasharray="2 3"
              transform="rotate(-2 155 96)"
            />

            {/* Hachura */}
            <g opacity="0.35">
              <path
                d="M 125 96 L 141 88"
                stroke="#4A443E"
                strokeWidth="1"
                opacity="0.7"
              />

              <path
                d="M 132 101 L 151 89"
                stroke="#4A443E"
                strokeWidth="0.8"
                opacity="0.5"
              />

              <path
                d="M 141 104 L 158 91"
                stroke="#4A443E"
                strokeWidth="1.1"
                opacity="0.75"
              />

              <path
                d="M 151 105 L 167 95"
                stroke="#4A443E"
                strokeWidth="0.7"
                opacity="0.45"
              />

              <path
                d="M 161 104 L 179 97"
                stroke="#4A443E"
                strokeWidth="1"
                opacity="0.6"
              />

              <path
                d="M 169 103 L 184 98"
                stroke="#4A443E"
                strokeWidth="0.8"
                opacity="0.4"
              />
            </g>

            {/* Pedra */}
            <path
              d="
                M 360 82
                C 378 68, 402 69, 415 84
                C 429 100, 421 112, 402 116
                C 382 120, 358 111, 354 96
                C 351 90, 354 85, 360 82
              "
              fill="none"
              stroke="#4A443E"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
              filter="url(#pencilTexture)"
            />

            <path
              d="
                M 358 84
                C 377 70, 400 71, 413 86
                C 426 100, 419 110, 401 114
                C 382 118, 360 109, 356 95
              "
              fill="none"
              stroke="#6B6259"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.3"
              transform="translate(1 1)"
            />

            {/* Pigmento da árvore */}
            <path
              d="
                M 260 58
                C 270 38, 292 30, 311 42
                C 326 52, 319 72, 302 79
                C 285 86, 263 78, 260 58
                Z
              "
              fill="#B6A36A"
              opacity="0.18"
              filter="url(#watercolorTexture)"
            />

            <path
              d="
                M 272 61
                C 279 45, 293 38, 306 44
                C 316 50, 314 64, 303 72
                C 292 80, 277 76, 272 61
                Z
              "
              fill="#7E9162"
              opacity="0.13"
              filter="url(#watercolorTexture)"
            />

            {/* Colina */}
            <path
              d="
                M 250 105
                C 300 72, 350 72, 405 104
                C 450 130, 500 125, 580 102
              "
              fill="none"
              stroke="#4A443E"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.65"
              filter="url(#pencilTexture)"
            />

            {/* Árvore */}
            <path
              d="
                M 285 94
                C 280 80, 281 68, 286 55
                M 286 55
                C 274 58, 269 49, 278 43
                C 270 36, 282 29, 291 37
                C 297 27, 310 35, 307 45
                C 318 46, 318 57, 305 59
                C 306 73, 302 83, 298 94
              "
              fill="none"
              stroke="#3D3833"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
              filter="url(#pencilTexture)"
            />

            {/* Casa */}
            <path
              d="
                M 440 101
                L 440 82
                L 463 65
                L 487 82
                L 487 101
                Z
              "
              fill="none"
              stroke="#4A443E"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
              filter="url(#pencilTexture)"
            />

            {/* Porta */}
            <path
              d="
                M 458 101
                L 458 88
                L 468 88
                L 468 101
              "
              fill="none"
              stroke="#4A443E"
              strokeWidth="1.2"
              opacity="0.6"
            />

            {/* Linhas auxiliares */}
            <g
              fill="none"
              stroke="#5A534B"
              strokeLinecap="round"
              opacity="0.22"
            >
              <path
                d="M 252 107 C 300 76, 351 76, 404 106"
                strokeWidth="1"
              />

              <path
                d="M 283 93 C 280 79, 282 68, 287 56"
                strokeWidth="0.8"
              />

              <path
                d="M 438 102 L 438 83 L 462 64 L 489 82 L 489 102"
                strokeWidth="0.8"
              />

              <path
                d="M 454 80 L 462 74 L 471 81"
                strokeWidth="0.7"
              />
            </g>

            {/* Carneiro */}
            <path
              d="
                M 175 103
                C 168 96, 169 87, 177 84
                C 184 81, 193 84, 197 90
                C 204 91, 208 96, 205 101
                C 200 106, 187 108, 175 103
                Z
              "
              fill="#D8C9A8"
              opacity="0.35"
              filter="url(#watercolorTexture)"
            />

            <path
              d="
                M 175 103
                C 168 96, 169 87, 177 84
                C 184 81, 193 84, 197 90
                C 204 91, 208 96, 205 101
                C 200 106, 187 108, 175 103
                Z
              "
              fill="none"
              stroke="#4A443E"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
              filter="url(#pencilTexture)"
            />

            {/* Cabeça */}
            <path
              d="
                M 202 91
                C 209 88, 216 91, 216 97
                C 216 103, 210 105, 204 102
              "
              fill="none"
              stroke="#3D3833"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
              filter="url(#pencilTexture)"
            />

            {/* Pernas */}
            <path
              d="
                M 180 103 L 179 111
                M 193 104 L 194 111
              "
              fill="none"
              stroke="#4A443E"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.65"
            />
          </svg>
        </div>

          {/* Barra de progresso */}
        <div
            style={{
                marginTop: 40,
                maxWidth: 600,
            }}
            >
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 10,
                color: colors.graphiteDark,
                }}
            >
                <span
                style={{
                    fontSize: 15,
                    fontWeight: 600,
                }}
                >
                Progresso
                </span>

                <span
                style={{
                    fontSize: 14,
                    color: colors.graphiteLight,
                }}
                >
                6 / 10
                </span>
            </div>

            <div
                style={{
                height: 12,
                padding: 2,
                backgroundColor: "rgba(239, 211, 157, 0.65)",
                border: `1px solid ${colors.graphiteLight}`,
                borderRadius: "7px 9px 8px 10px",
                boxShadow: "inset 0 1px 4px rgba(74, 68, 62, 0.12)",
                }}
            >
                <div
                style={{
                    width: "60%",
                    height: "100%",
                    backgroundColor: colors.green,
                    borderRadius: "5px 7px 6px 8px",
                    boxShadow: "inset 0 1px 3px rgba(255, 245, 210, 0.18)",
                }}
                />
            </div>
        </div>

        {/* Campo de texto */}
        <div
            style={{
                marginTop: 40,
                maxWidth: 600,
            }}
            >
            <label
                style={{
                display: "block",
                marginBottom: 10,
                color: colors.graphiteDark,
                fontSize: 15,
                fontWeight: 600,
                }}
            >
                Escreva esta frase:
            </label>

            <textarea
                placeholder="Digite o verso aqui..."
                rows={4}
                style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "16px 18px",
                resize: "vertical",
                backgroundColor: "rgba(255, 245, 210, 0.38)",
                color: colors.graphiteDark,
                border: `1px solid ${colors.graphiteLight}`,
                borderRadius: "7px 9px 8px 10px",
                outline: "none",
                fontSize: 16,
                lineHeight: 1.6,
                fontFamily: "inherit",
                boxShadow: "inset 0 2px 8px rgba(74, 68, 62, 0.08)",
                }}
            />
        </div>

        <div
            style={{
                marginTop: 40,
                maxWidth: 600,
                display: "grid",
                gap: 16,
            }}
            >
            <div
                style={{
                padding: "16px 18px",
                backgroundColor: "rgba(113, 128, 92, 0.18)",
                border: `2px solid ${colors.green}`,
                borderRadius: "7px 10px 8px 9px",
                color: colors.graphiteDark,
                boxShadow: "inset 0 0 14px rgba(113, 128, 92, 0.08)",
                }}
            >
                <strong>Muito bem!</strong>
                <div
                style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: colors.graphiteLight,
                }}
                >
                Você acertou o verso.
                </div>
            </div>

            <div
                style={{
                padding: "16px 18px",
                backgroundColor: `${colors.redLight}`,
                border: `2px solid ${colors.red}`,
                borderRadius: "9px 7px 10px 8px",
                color: colors.graphiteDark,
                boxShadow: "inset 0 0 14px rgba(121, 95, 67, 0.07)",
                }}
            >
                <strong>Quase lá</strong>
                <div
                style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: colors.graphiteLight,
                }}
                >
                Revise o verso e tente novamente.
                </div>
            </div>
        </div>

        {/* Recompensas */}
        <div
            style={{
                marginTop: 40,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
            }}
            >
            <div
                style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                backgroundColor: "rgba(182, 154, 99, 0.22)",
                border: `1px solid ${colors.ochre}`,
                borderRadius: "8px 10px 7px 9px",
                color: colors.graphiteDark,
                fontSize: 14,
                fontWeight: 600,
                }}
            >
                <span>★</span>
                <span>+10 pontos</span>
            </div>

            <div
                style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                backgroundColor: "rgba(113, 128, 92, 0.18)",
                border: `1px solid ${colors.green}`,
                borderRadius: "10px 8px 9px 7px",
                color: colors.graphiteDark,
                fontSize: 14,
                fontWeight: 600,
                }}
            >
                <span>✦</span>
                <span>+25 XP</span>
            </div>
        </div>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Botão primário */}
          <button
            onMouseDown={(e) => {
              e.currentTarget.style.transform =
                "rotate(-0.4deg) translateY(2px)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "rotate(-0.4deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotate(-0.4deg)";
            }}
            style={{
              position: "relative",
              padding: "14px 28px",
              cursor: "pointer",

              backgroundColor: "#B69A63",
              backgroundImage: `
                radial-gradient(
                    circle at 30% 40%,
                    rgba(255, 245, 210, 0.12) 0,
                    transparent 45%
                ),
                radial-gradient(
                    circle at 70% 60%,
                    rgba(74, 68, 62, 0.08) 0,
                    transparent 50%
                )
                `,
              backgroundBlendMode: "multiply",

              color: "#3D352E",

              border: "1.5px solid #4A443E",
              outline: "1px solid rgba(74, 68, 62, 0.18)",
              outlineOffset: "1px",
              borderRadius: "9px 11px 8px 10px",

              fontSize: "16px",
              fontWeight: 600,

              boxShadow: `
                2px 2px 0 rgba(74, 68, 62, 0.16),
                3px 3px 5px rgba(74, 68, 62, 0.08),
                inset 0 0 12px rgba(255, 245, 210, 0.18)
                `,

              transform: "rotate(-0.4deg)",
              transition: "transform 100ms ease",
            }}
          >
            Continuar
          </button>

          {/* Botão secundário */}
          <button
            style={{
              padding: "14px 28px",

              backgroundColor: "rgba(239, 211, 157, 0.55)",
              backgroundImage: `
                radial-gradient(
                    circle at 25% 35%,
                    rgba(255, 245, 210, 0.10) 0,
                    transparent 45%
                ),
                radial-gradient(
                    circle at 75% 65%,
                    rgba(74, 68, 62, 0.06) 0,
                    transparent 50%
                )
                `,
              backgroundBlendMode: "multiply",

              color: "#4A443E",

              border: "1px solid #6F6255",
              borderRadius: "8px 10px 9px 11px",

              fontSize: "16px",
              fontWeight: 600,

              boxShadow: `
                inset 0 0 10px rgba(120, 80, 40, 0.05)
              `,

              transform: "rotate(0.3deg)",
            }}
          >
            Voltar
          </button>
        </div>
      </div>

        {/* Design Tokens */}
      <div
            style={{
                marginTop: 56,
                paddingTop: 32,
                borderTop: `1px solid ${colors.graphiteLight}`,
                maxWidth: 600,
            }}
            >
            <h2
                style={{
                margin: 0,
                color: colors.graphiteDark,
                fontSize: 24,
                fontWeight: 700,
                }}
            >
                Design Tokens
            </h2>

            <p
                style={{
                marginTop: 8,
                color: colors.graphiteLight,
                fontSize: 14,
                lineHeight: 1.5,
                }}
            >
                Base visual utilizada pelo novo Salmorize.
            </p>

            <div
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                marginTop: 24,
                }}
            >
                {Object.entries(colors).map(([name, value]) => (
                <div key={name}>
                    <div
                    style={{
                        height: 48,
                        backgroundColor: value,
                        border: `1px solid ${colors.graphiteLight}`,
                        borderRadius: "5px 7px 6px 8px",
                    }}
                    />

                    <div
                    style={{
                        marginTop: 5,
                        fontSize: 11,
                        color: colors.graphiteLight,
                    }}
                    >
                    {name}
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* Tipografia */}
        <div style={{ marginTop: 28 }}>
            <div
                style={{
                paddingBottom: 28,
                
                }}
            >
                <div
                style={{
                    marginBottom: 8,
                    color: colors.graphiteLight,
                    fontSize: 12,
                    fontWeight: 600,
                }}
                >
                Crimson Pro
                </div>

                <div
                className={crimsonPro.className}
                style={{
                    color: colors.graphiteDark,
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 0.8,
                }}
                >
                O Senhor é o meu pastor
                </div>

                <div
                className={crimsonPro.className}
                style={{
                    marginTop: 12,
                    color: colors.graphiteDark,
                    fontSize: 20,
                    fontWeight: 400,
                    lineHeight: 1.2,
                }}
                >
                O Senhor é o meu pastor; nada me faltará. 123456
                </div>
            </div>

            
        </div>
    </main>
  );
}