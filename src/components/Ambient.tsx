type Blob = {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  drift?: "a" | "b";
};

export default function Ambient({ blobs, className = "" }: { blobs: Blob[]; className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {blobs.map((b, i) => (
        <div
          key={i}
          className={`blob ${b.drift === "b" ? "blob-b" : "blob-a"}`}
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            opacity: b.opacity ?? 1,
            background: `radial-gradient(circle at center, ${b.color} 0%, transparent 68%)`,
          }}
        />
      ))}
    </div>
  );
}
