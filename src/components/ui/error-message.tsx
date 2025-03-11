interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-3 mb-4 bg-destructive/15 border border-destructive text-destructive rounded-md">
      <p className="text-sm">{message}</p>
    </div>
  );
}