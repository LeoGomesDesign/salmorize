'use client';


import { ReactNode } from 'react';

interface HeaderBackButtonProps {
  onClick?: () => void;
  children?: ReactNode;
}

export default function HeaderBackButton({
  onClick, 
  children,
 }: HeaderBackButtonProps) {
  return (
    <button 
      onClick={onClick ?? (() => window.history.back())}
      className="btn-secondary max-h-max">
      <img
        src="/svg/x.svg"
        alt="close"
        width={16}
        />
        {children}
    </button>
  );
}
