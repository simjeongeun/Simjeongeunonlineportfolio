type DragHandleDotsProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function DragHandleDots({
  size = 14,
  className,
  title,
}: DragHandleDotsProps) {
  const w = Math.round(size * (6 / 10));
  const h = size;
  const r = Math.max(1, size / 10);
  const dots: [number, number][] = [
    [1.5, 1.5],
    [4.5, 1.5],
    [1.5, 5],
    [4.5, 5],
    [1.5, 8.5],
    [4.5, 8.5],
  ];
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 6 10"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={className}
    >
      {title && <title>{title}</title>}
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" />
      ))}
    </svg>
  );
}
