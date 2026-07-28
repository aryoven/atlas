type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({
  value,
}: ProgressBarProps) {
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
        }}
      />
    </div>
  );
}