export const Spinner = ({ className = '' }: { className?: string }) => (
  <span
    className={`inline-block animate-spin rounded-full border-current border-r-transparent align-[-0.125em] ${className}`}
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </span>
);
