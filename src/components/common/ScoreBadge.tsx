export function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "text-[oklch(0.65_0.17_155)] bg-[oklch(0.65_0.17_155/0.12)]" : score >= 70 ? "text-[oklch(0.75_0.16_65)] bg-[oklch(0.75_0.16_65/0.12)]" : "text-destructive bg-destructive/10";
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${color}`}>{score}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-[oklch(0.65_0.17_155/0.14)] text-[oklch(0.65_0.17_155)]",
    in_progress: "bg-[oklch(0.75_0.16_65/0.14)] text-[oklch(0.75_0.16_65)]",
    failed: "bg-destructive/14 text-destructive",
  };
  const label = status.replace("_", " ");
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}>{label}</span>;
}