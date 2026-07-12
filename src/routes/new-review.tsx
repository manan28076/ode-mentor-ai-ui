import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Github, Sparkles, Upload } from "lucide-react";
import { languages, sampleCode } from "@/lib/mockData";
import { ReviewResult } from "@/components/common/ReviewResult";
import { ExportModal } from "@/components/common/ExportModal";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { reviewCode } from "@/services/reviewService";

export const Route = createFileRoute("/new-review")({ component: NewReview });

function NewReview() {
  const navigate = useNavigate();
  const [code, setCode] = useState(sampleCode);
  const [language, setLanguage] = useState("TypeScript");
  const [projectName, setProjectName] = useState("payments-service");
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [reviewData, setReviewData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const importedCode = localStorage.getItem("importedCode");
    if (!importedCode) return;

    const importedLanguage = localStorage.getItem("importedLanguage");
    const importedProjectName = localStorage.getItem("importedProjectName");

    setCode(importedCode);
    if (importedLanguage && importedLanguage !== "Unknown") setLanguage(importedLanguage);
    if (importedProjectName) setProjectName(importedProjectName);

    localStorage.removeItem("importedCode");
    localStorage.removeItem("importedLanguage");
    localStorage.removeItem("importedProjectName");

    toast.success("Code imported from GitHub");
  }, []);

  const runReview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await reviewCode(
        {
          code,
          language,
        },
        token,
      );
      setReviewData(response.data.review.aiReview);
      setReviewed(true);
      toast.success("Review complete");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="New Review"
        description="Paste, upload, or import code to review with AI."
        actions={
          reviewed ? (
            <Button variant="outline" onClick={() => setExportOpen(true)}>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="flex flex-col rounded-xl border bg-card">
          <div className="grid grid-cols-1 gap-3 border-b p-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Project name</Label>
              <Input
                placeholder="my-service"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 border-b p-3">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/github" })}>
              <Github className="mr-1.5 h-3.5 w-3.5" /> Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Would open file picker")}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
            </Button>
            <span className="ml-2 text-xs text-muted-foreground">or paste code below</span>
          </div>
          {/* TODO: Replace textarea with Monaco Editor when wiring real editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] flex-1 resize-none bg-[oklch(0.16_0.02_265)] p-4 font-mono text-[13px] leading-relaxed text-white/90 outline-none"
          />
          <div className="flex items-center justify-between gap-3 border-t p-3">
            <div className="text-xs text-muted-foreground">
              {code.split("\n").length} lines · {code.length} chars
            </div>
            <Button onClick={runReview} disabled={loading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Reviewing…" : "Run Review"}
            </Button>
          </div>
        </section>

        <section>
          {loading && (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
              <div className="h-40 animate-pulse rounded-xl bg-muted" />
              <div className="h-40 animate-pulse rounded-xl bg-muted" />
            </div>
          )}
          {!loading && !reviewed && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Your AI review will appear here</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Bugs, complexity analysis, best practices, generated tests, and an optimized
                version.
              </p>
            </div>
          )}
          {!loading && reviewed && reviewData && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ReviewResult review={reviewData} />
            </motion.div>
          )}
        </section>
      </div>

      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </AppShell>
  );
}