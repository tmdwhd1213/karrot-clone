interface FormButtonProps {
  loading: boolean;
  text: string;
}

export default function FormButton({ text, loading }: FormButtonProps) {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:bg-neutral-400 
      disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {loading ? "잠시만 기다려주세요" : text}
    </button>
  );
}
