export default function MainLoading() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: '#fff', borderRadius: 8, padding: 24, marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e0e0' }} />
            <div>
              <div style={{ width: 120, height: 14, borderRadius: 4, background: '#e0e0e0', marginBottom: 6 }} />
              <div style={{ width: 80, height: 12, borderRadius: 4, background: '#eee' }} />
            </div>
          </div>
          <div style={{ width: '80%', height: 14, borderRadius: 4, background: '#e0e0e0', marginBottom: 8 }} />
          <div style={{ width: '60%', height: 14, borderRadius: 4, background: '#eee', marginBottom: 16 }} />
          <div style={{ width: '100%', height: 200, borderRadius: 8, background: '#f0f0f0' }} />
        </div>
      ))}
    </div>
  );
}
