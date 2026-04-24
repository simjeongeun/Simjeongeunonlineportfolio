type DragHandleDotsProps = {
  size?: number;
  className?: string;
  title?: string;
};

// Two rounded vertical pills — the modern drag affordance used by
// Notion, Linear, Raycast. Kept the old `DragHandleDots` name so
// existing imports don't need to change.
export function DragHandleDots({
  size = 14,
  className,
  title,
}: DragHandleDotsProps) {
  const h = size;
  const w = Math.max(6, Math.round(size * 0.5));
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 8 16"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={className}
    >
      {title && <title>{title}</title>}
      <rect x="1.2" y="2.5" width="1.8" height="11" rx="0.9" fill="currentColor" />
      <rect x="5" y="2.5" width="1.8" height="11" rx="0.9" fill="currentColor" />
    </svg>
  );
}
