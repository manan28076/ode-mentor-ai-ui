import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { ReviewResult } from "@/components/common/ReviewResult";
import { ExportModal } from "@/components/common/ExportModal";
import { mockReviews, sampleCode } from "@/lib/mockData";
import { CodeBlock } from "@/components/common/CodeBlock";
import { ScoreBadge, StatusBadge } from "@/components/common/ScoreBadge";

export const Route = createFileRoute("/review/$id")({ component: ReviewDetail });

function ReviewDetail() {
  const { id } = Route.useParams();
  const review = mockReviews.find((r) => r.id === id) ?? mockReviews[0];
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <AppShell>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm"><Link to="/history"><ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to history</Link></Button>
      </div>
      <PageHeader
        title={review.project}
        description={`${review.language} · reviewed ${review.createdAt}`}
        actions={
          <>
            <div className="flex items-center gap-2 rounded-md border px-2 py-1"><span className="text-xs text-muted-foreground">Score</span> <ScoreBadge score={review.score} /></div>
            <StatusBadge status={review.status} />
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            <Button onClick={() => setExportOpen(true)}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <div className="mb-2 text-sm font-medium">Source</div>
          <CodeBlock code={sampleCode} language={review.language.toLowerCase()} />
        </div>
        <div>
          <ReviewResult />
        </div>
      </div>

      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </AppShell>
  );
}