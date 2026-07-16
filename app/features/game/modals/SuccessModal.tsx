type SuccessModalProps = {
  visible: boolean;
  onContinue: () => void;
  title?: string;
  buttonLabel?: string;
}


export default function SuccessModal({ 
  visible,
  onContinue,
  title = "Correto!",
  buttonLabel = "Continuar"
}: SuccessModalProps) {
  if (!visible) return null;

  return (
    <div className="modal-feedback modal-success">
      <h2 className="modal-title">{title}</h2>
      <button onClick={onContinue} className="btn btn-success btn-modal-success">
        {buttonLabel}
      </button>
    </div>
  );
}