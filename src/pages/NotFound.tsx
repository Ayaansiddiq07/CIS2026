import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section
      id="not-found-page"
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--brand-accent, #38bdf8), var(--brand-primary, #6366f1))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        404
      </h1>
      <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '30ch' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          background: 'linear-gradient(135deg, var(--brand-accent, #38bdf8), var(--brand-primary, #6366f1))',
          color: '#fff',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Go Home
      </Link>
    </section>
  );
}
