import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "ts", className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={`group relative overflow-hidden rounded-lg border bg-[oklch(0.16_0.02_265)] text-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">{language}</span>
        <Button size="sm" variant="ghost" onClick={copy} className="h-7 text-white/70 hover:bg-white/10 hover:text-white">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="ml-1 text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-white/90"><code>{code}</code></pre>
    </div>
  );
}