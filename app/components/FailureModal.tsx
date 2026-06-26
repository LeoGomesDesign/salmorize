type FailureModalProps = {
  visible: boolean;
  onRetry: () => void;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}


export default function FailureModal({ 
    visible, 
    onRetry,
    title = "Algo está errado!",
    subtitle = "Verifique as palavras escolhidas",
    buttonLabel = "Tente novamente"
}: FailureModalProps){
  if (!visible) return null;

  return (
    <div className="modal-feedback modal-failure">
      <h2 className="modal-title">{title}</h2>
      <p className="w-full mb-6" style={{ fontFamily: 'var(--font-montserrat)' }}>
        {subtitle}
      </p>
      <button onClick={onRetry} className="btn btn-fail btn-modal-failure">
        {buttonLabel}
      </button>
    </div>
  );
}