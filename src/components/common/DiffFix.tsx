import { useState } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/lib/theme";

interface DiffFixProps {
  oldCode: string;
  newCode: string;
}

export function DiffFix({ oldCode, newCode }: DiffFixProps) {
  const { theme } = useTheme();
  const [applied, setApplied] = useState(false);

  const handleApplyFix = async () => {
    try {
      await navigator.clipboard.writeText(newCode);
      setApplied(true);
      toast.success("Fixed code copied — paste it in to apply.");
      setTimeout(() => setApplied(false), 2500);
    } catch {
      toast.error("Couldn't copy to clipboard. Select the code manually instead.");
    }
  };

  if (!oldCode || !newCode || oldCode.trim() === newCode.trim()) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
        <span className="text-sm font-medium">Suggested fix</span>
        <Button size="sm" onClick={handleApplyFix} disabled={applied}>
          {applied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Apply Fix
            </>
          )}
        </Button>
      </div>
      <div className="max-h-[480px] overflow-auto text-xs">
        <ReactDiffViewer
          oldValue={oldCode}
          newValue={newCode}
          splitView={false}
          compareMethod={DiffMethod.WORDS}
          useDarkTheme={theme === "dark"}
          styles={{
            variables: {
              light: {
                diffViewerBackground: "var(--color-card)",
                gutterBackground: "var(--color-muted)",
              },
              dark: {
                diffViewerBackground: "var(--color-card)",
                gutterBackground: "var(--color-muted)",
              },
            },
          }}
        />
      </div>
    </div>
  );
}