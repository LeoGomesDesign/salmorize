'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface HeaderBackButtonProps {
  onClick?: () => void;
  children: ReactNode;
}

export default function HeaderBackButton({ onClick, children }: HeaderBackButtonProps) {
  return (
    <button type="button" onClick={onClick} className="btn btn-secondary">
      <Image
        src="/img/chevron-left.svg"
        alt="Voltar"
        width={16}
        height={16}
      />
      {children}
    </button>
  );
}
