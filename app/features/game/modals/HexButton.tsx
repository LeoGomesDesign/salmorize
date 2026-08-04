import Image from "next/image";

// ============================================================================
// SVGs
// ============================================================================

const BUTTON_ASSETS = {
 active: "/svg/hex-active.svg",
 completed: "/svg/hex-completed.svg",
 locked: "/svg/hex-locked.svg",
} as const;



// ============================================================================
// Propriedades do componente
// ============================================================================

type HexButtonStatus = "active" | "completed" | "locked";

type HexButtonProps = {
  size: number;
  icon: string;
  status: HexButtonStatus;
};

// ============================================================================
// Botão Hexagonal
// ============================================================================

export default function HexButton({
  size,
  icon,
  status,
}: HexButtonProps) {
  const background = BUTTON_ASSETS[status];
  
  return (
    <div
  style={{
    width: size,
    height: size,
    position: "relative",
  }}
>
  {/* Fundo do botão */}
  <Image
    src={background}
    alt=""
    fill
    draggable={false}
  />

  {/* Ícone */}
  <div className="absolute inset-0 flex items-center justify-center">
    <Image
      src={icon}
      alt=""
      width={size * 0.60}
      height={size * 0.60}
      draggable={false}
    />
  </div>
</div>
  );
}