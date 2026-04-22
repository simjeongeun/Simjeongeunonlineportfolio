import { useState } from 'react';
import { useAuth } from '../../lib/auth';

type AdminLoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError('로그인 실패. 이메일/비밀번호를 확인해주세요.');
      if (import.meta.env.DEV) console.warn('[admin] signIn error', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: 'white',
          padding: '32px',
          borderRadius: '12px',
          minWidth: '320px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          fontFamily: 'Inter, Pretendard, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>관리자 로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          autoFocus
          style={{
            padding: '10px 14px',
            border: '1px solid #DDD',
            borderRadius: 8,
            fontSize: 14,
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          style={{
            padding: '10px 14px',
            border: '1px solid #DDD',
            borderRadius: 8,
            fontSize: 14,
            outline: 'none',
          }}
        />
        {error && (
          <p style={{ margin: 0, color: '#D00', fontSize: 13 }}>{error}</p>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            type="submit"
            disabled={busy}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: '#0057FF',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: busy ? 'wait' : 'pointer',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? '로그인 중…' : '로그인'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            style={{
              padding: '10px 14px',
              background: 'transparent',
              color: '#666',
              border: '1px solid #DDD',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
