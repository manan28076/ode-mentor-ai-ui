import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { ReviewResult } from "@/components/common/ReviewResult";
import { ExportModal } from "@/components/common/ExportModal";
import { getReviewById } from "@/services/reviewService";
import { CodeBlock } from "@/components/common/CodeBlock";
import { ScoreBadge, StatusBadge } from "@/components/common/ScoreBadge";

export const Route = createFileRoute("/review/$id")({ component: ReviewDetail });

function ReviewDetail() {
  const { id } = Route.useParams();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be logged in to view this review.");
          setLoading(false);
          return;
        }

        const res = await getReviewById(id, token);
        setReview(res.data.review);
      } catch (err) {
        console.error(err);
        setError("Couldn't load this review. It may have been deleted.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  return (
    <AppShell>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/history">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to history
          </Link>
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button asChild variant="outline">
              <Link to="/history">Back to history</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && loading && (
        <p className="text-sm text-muted-foreground">Loading review…</p>
      )}

      {!error && !loading && review && (
        <>
          <PageHeader
            title={`${review.language} Review`}
            description={`${review.language} · reviewed ${new Date(review.createdAt).toLocaleDateString()}`}
            actions={
              <>
                <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                  <span className="text-xs text-muted-foreground">Score</span>
                  <ScoreBadge score={review.aiReview?.overallScore ?? 0} />
                </div>
                <StatusBadge status="completed" />
                <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                <Button onClick={() => setExportOpen(true)}><Download className="mr-2 h-4 w-4" /> Export</Button>
              </>
            }
          />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div>
              <div className="mb-2 text-sm font-medium">Source</div>
              <CodeBlock code={review.originalCode} language={review.language.toLowerCase()} />
            </div>
            <div>
              <ReviewResult review={review.aiReview} originalCode={review.originalCode} />
            </div>
          </div>

          <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
        </>
      )}
    </AppShell>
  );
}