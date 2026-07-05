import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileCode, Link2, FileType } from "lucide-react";
import { toast } from "sonner";

export function ExportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const opts = [
    { icon: FileText, label: "PDF", desc: "Formatted report" },
    { icon: FileCode, label: "Markdown", desc: "Great for docs & GitHub" },
    { icon: FileType, label: "Text", desc: "Plain text export" },
    { icon: Link2, label: "Share link", desc: "Read-only URL" },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export report</DialogTitle>
          <DialogDescription>Choose a format to export this review.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {opts.map((o) => (
            <Button key={o.label} variant="outline" className="h-auto flex-col items-start gap-1 py-4 text-left" onClick={() => { toast.success(`${o.label} exported (mock)`); onOpenChange(false); }}>
              <div className="flex items-center gap-2 font-medium"><o.icon className="h-4 w-4" /> {o.label}</div>
              <span className="text-xs text-muted-foreground">{o.desc}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}