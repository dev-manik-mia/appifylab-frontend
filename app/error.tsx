'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '8px 24px', background: '#377DFF', color: '#fff',
          border: 'none', borderRadius: 6, cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}
