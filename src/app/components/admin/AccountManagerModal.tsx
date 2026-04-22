import { useState } from 'react';
import { useAuth } from '../../lib/auth';

type AccountManagerModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AccountManagerModal({ open, onClose }: AccountManagerModalProps) {
  const { user, changePassword, createAdmin } = useAuth();
  const [tab, setTab] = useState<'password' | 'create'>('password');

  // password tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // create tab state
  const [newEmail, setNewEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [createBusy, setCreateBusy] = useState(false);
  const [createMsg, setCreateMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  if (!open) return null;

  const resetAll = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setNewEmail('');
    setNewUserPassword('');
    setPwMsg(null);
    setCreateMsg(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword !== confirmPassword) {
      setPwMsg({ kind: 'err', text: '새 비밀번호와 확인이 일치하지 않습니다.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ kind: 'err', text: '새 비밀번호는 6자 이상이어야 합니다.' });
      return;
    }
    setPwBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwMsg({ kind: 'ok', text: '비밀번호가 변경되었습니다.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwMsg({ kind: 'err', text: err instanceof Error ? err.message : String(err) });
    } finally {
      setPwBusy(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);
    if (newUserPassword.length < 6) {
      setCreateMsg({ kind: 'err', text: '비밀번호는 6자 이상이어야 합니다.' });
      return;
    }
    setCreateBusy(true);
    try {
      await createAdmin(newEmail, newUserPassword);
      setCreateMsg({
        kind: 'ok',
        text: `새 관리자 계정 생성 완료: ${newEmail.trim()}`,
      });
      setNewEmail('');
      setNewUserPassword('');
    } catch (err) {
      setCreateMsg({ kind: 'err', text: err instanceof Error ? err.message : String(err) });
    } finally {
      setCreateBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #DDD',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'Inter, Pretendard, sans-serif',
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 14px',
    border: 'none',
    background: active ? '#F0F5FF' : 'transparent',
    color: active ? '#0057FF' : '#666',
    fontWeight: active ? 500 : 400,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'Inter, Pretendard, sans-serif',
    letterSpacing: '0.02em',
    borderBottom: active ? '2px solid #0057FF' : '2px solid transparent',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => {
        resetAll();
        onClose();
      }}
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
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          padding: 0,
          borderRadius: 12,
          minWidth: 360,
          maxWidth: 440,
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          fontFamily: 'Inter, Pretendard, sans-serif',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px 28px 0' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1A1A1A' }}>
            계정 관리
          </h2>
          {user?.email && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#999' }}>
              현재 로그인: {user.email}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', margin: '20px 0 0', borderBottom: '1px solid #EEE' }}>
          <button type="button" onClick={() => setTab('password')} style={tabBtn(tab === 'password')}>
            비밀번호 변경
          </button>
          <button type="button" onClick={() => setTab('create')} style={tabBtn(tab === 'create')}>
            관리자 계정 추가
          </button>
        </div>

        <div style={{ padding: '20px 28px 24px' }}>
          {tab === 'password' ? (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="새 비밀번호 (6자 이상)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={inputStyle}
              />
              {pwMsg && (
                <p
                  style={{
                    margin: 0,
                    color: pwMsg.kind === 'ok' ? '#0057FF' : '#D00',
                    fontSize: 13,
                  }}
                >
                  {pwMsg.text}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={pwBusy}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: '#0057FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: pwBusy ? 'wait' : 'pointer',
                    opacity: pwBusy ? 0.7 : 1,
                  }}
                >
                  {pwBusy ? '변경 중…' : '비밀번호 변경'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    onClose();
                  }}
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
                  닫기
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                새로 만든 계정은 이 사이트의 전체 관리 권한을 갖게 됩니다. 신뢰하는 사람에게만 공유하세요.
              </p>
              <input
                type="email"
                placeholder="새 관리자 이메일"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="off"
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="초기 비밀번호 (6자 이상)"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={inputStyle}
              />
              {createMsg && (
                <p
                  style={{
                    margin: 0,
                    color: createMsg.kind === 'ok' ? '#0057FF' : '#D00',
                    fontSize: 13,
                  }}
                >
                  {createMsg.text}
                </p>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={createBusy}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: '#0057FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: createBusy ? 'wait' : 'pointer',
                    opacity: createBusy ? 0.7 : 1,
                  }}
                >
                  {createBusy ? '생성 중…' : '계정 생성'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    onClose();
                  }}
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
                  닫기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
