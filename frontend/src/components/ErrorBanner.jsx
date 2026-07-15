export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="banner error">
      <p>{message}</p>
      <div className="actions">
        {onRetry && <button className="btn secondary" onClick={onRetry}>Reintentar</button>}
      </div>
    </div>
  );
}
