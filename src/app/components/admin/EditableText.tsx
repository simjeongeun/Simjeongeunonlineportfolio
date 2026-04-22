import { useEffect, useRef, useState, type CSSProperties, type ElementType } from 'react';
import { useAuth } from '../../lib/auth';
import { useContent } from '../../lib/content';

type EditableTextProps = {
  contentKey: string;
  defaultValue: string;
  as?: ElementType;
  multiline?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function EditableText({
  contentKey,
  defaultValue,
  as: Tag = 'span',
  multiline = false,
  className,
  style,
}: EditableTextProps) {
  const { isAdmin } = useAuth();
  const { get, set } = useContent();
  const current = get(contentKey, defaultValue);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(current);
  }, [current, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  if (!isAdmin) {
    return (
      <Tag className={className} style={style}>
        {current}
      </Tag>
    );
  }

  const commit = async () => {
    if (draft === current) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await set(contentKey, draft);
      setEditing(false);
    } catch (err) {
      console.error('[EditableText] save failed', err);
      alert('저장 실패: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDraft(current);
    setEditing(false);
  };

  if (!editing) {
    return (
      <Tag
        className={className}
        style={{
          ...style,
          outline: '1px dashed rgba(0, 87, 255, 0.4)',
          outlineOffset: '2px',
          cursor: 'text',
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setEditing(true);
        }}
        title="클릭해서 편집"
      >
        {current}
      </Tag>
    );
  }

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel();
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') commit();
        }}
        disabled={saving}
        className={className}
        style={{
          ...style,
          width: '100%',
          minHeight: '4em',
          background: 'rgba(0, 87, 255, 0.05)',
          border: '2px solid #0057FF',
          padding: '4px 8px',
          resize: 'vertical',
        }}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') cancel();
      }}
      disabled={saving}
      className={className}
      style={{
        ...style,
        background: 'rgba(0, 87, 255, 0.05)',
        border: '2px solid #0057FF',
        padding: '2px 6px',
      }}
    />
  );
}
