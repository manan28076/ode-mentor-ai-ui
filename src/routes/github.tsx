import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, File, GitBranch, GitPullRequest, Lock, Search, Star } from "lucide-react";
import { toast } from "sonner";
import {
  getUserRepos,
  getRepoBranches,
  getRepoTree,
  getFileContent,
} from "@/services/githubService";

export const Route = createFileRoute("/github")({ component: GithubPage });

interface Repo {
  id: number;
  name: string;
  full_name: string;
  language: string | null;
  updated_at: string;
  stargazers_count: number;
  private: boolean;
  default_branch: string;
  owner: { login: string };
}

interface TreeEntry {
  path: string;
  type: "blob" | "tree";
}

interface GithubTreeItem {
  path: string;
  type: string;
}

interface GithubBranch {
  name: string;
}

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
  py: "Python",
  go: "Go",
  rs: "Rust",
  java: "Java",
  kt: "Kotlin",
  cpp: "C++",
  cc: "C++",
  cs: "C#",
  rb: "Ruby",
  php: "PHP",
};

function guessLanguage(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TO_LANGUAGE[ext] ?? "Unknown";
}

function GithubPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const [selected, setSelected] = useState<Repo | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  const [branch, setBranch] = useState("");

  const [tree, setTree] = useState<TreeEntry[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const filteredRepos = repos.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  const loadTree = async (repo: Repo, branchName: string) => {
    setTreeLoading(true);
    setTreeError(null);
    setSelectedFile(null);
    try {
      const data = await getRepoTree(repo.owner.login, repo.name, branchName);
      const entries: TreeEntry[] = (data.tree || [])
        .filter((e: GithubTreeItem) => e.type === "blob")
        .map((e: GithubTreeItem) => ({ path: e.path, type: e.type as "blob" }));
      setTree(entries);
    } catch (err) {
      console.error(err);
      setTreeError(err instanceof Error ? err.message : "Failed to load files for this branch.");
      setTree([]);
    } finally {
      setTreeLoading(false);
    }
  };

  const selectRepo = async (repo: Repo) => {
    setSelected(repo);
    setBranches([]);
    setBranch(repo.default_branch);
    setTree([]);
    setSelectedFile(null);

    try {
      const data = await getRepoBranches(repo.owner.login, repo.name);
      const names = data.map((b: GithubBranch) => b.name);
      setBranches(names.length ? names : [repo.default_branch]);
    } catch (err) {
      console.error(err);
      setBranches([repo.default_branch]);
    }

    loadTree(repo, repo.default_branch);
  };

  const changeBranch = (newBranch: string) => {
    setBranch(newBranch);
    if (selected) loadTree(selected, newBranch);
  };

  const loadRepos = async () => {
    if (!username.trim()) {
      toast.error("Enter a GitHub username first");
      return;
    }
    setReposLoading(true);
    setReposError(null);
    setRepos([]);
    setSelected(null);
    setTree([]);
    try {
      const data = await getUserRepos(username.trim());
      setRepos(data);
      if (data.length > 0) {
        selectRepo(data[0]);
      } else {
        setReposError("This user has no public repositories.");
      }
    } catch (err) {
      console.error(err);
      setReposError(err instanceof Error ? err.message : "Failed to load repositories.");
    } finally {
      setReposLoading(false);
    }
  };

  const importSelectedFile = async () => {
    if (!selected || !selectedFile) {
      toast.error("Select a file to import first");
      return;
    }
    setImporting(true);
    try {
      const content = await getFileContent(
        selected.owner.login,
        selected.name,
        selectedFile,
        branch,
      );
      localStorage.setItem("importedCode", content);
      localStorage.setItem("importedLanguage", guessLanguage(selectedFile));
      localStorage.setItem("importedProjectName", selected.name);
      toast.success(`Imported ${selectedFile}`);
      navigate({ to: "/new-review" });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to import this file");
    } finally {
      setImporting(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="GitHub"
        description="Browse a public GitHub profile and import real code to review."
        actions={
          <Button variant="outline" onClick={() => toast.info("PRs coming soon")}>
            <GitPullRequest className="mr-2 h-4 w-4" /> Pull Request
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-[220px] flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">GitHub username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadRepos()}
              placeholder="e.g. torvalds"
            />
          </div>
          <Button onClick={loadRepos} disabled={reposLoading}>
            {reposLoading ? "Loading…" : "Load repositories"}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardContent className="p-0">
            <div className="border-b p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search repositories…"
                  className="pl-9"
                />
              </div>
            </div>

            {reposLoading && (
              <div className="space-y-2 p-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            )}

            {!reposLoading && reposError && (
              <div className="p-4 text-center text-sm text-muted-foreground">{reposError}</div>
            )}

            {!reposLoading && !reposError && repos.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Enter a GitHub username above to load repositories.
              </div>
            )}

            <ul className="divide-y">
              {filteredRepos.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => selectRepo(r)}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-muted/50 ${selected?.id === r.id ? "bg-muted/60" : ""}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate font-medium">
                        {r.name} {r.private && <Lock className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{r.language || "—"}</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" /> {r.stargazers_count}
                        </span>
                        <span>{new Date(r.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            {!selected && (
              <div className="flex h-full min-h-[300px] items-center justify-center text-center text-sm text-muted-foreground">
                Select a repository to browse its files.
              </div>
            )}

            {selected && (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{selected.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selected.language || "—"} · updated{" "}
                      {new Date(selected.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={branch} onValueChange={changeBranch}>
                      <SelectTrigger className="w-36">
                        <GitBranch className="mr-1 h-3.5 w-3.5" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={importSelectedFile} disabled={!selectedFile || importing}>
                      {importing ? "Importing…" : "Import"}
                    </Button>
                  </div>
                </div>

                {treeLoading && (
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                )}

                {!treeLoading && treeError && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    {treeError}
                  </div>
                )}

                {!treeLoading && !treeError && (
                  <ul className="max-h-[420px] divide-y overflow-y-auto rounded-lg border">
                    {tree.map((n) => (
                      <li key={n.path}>
                        <button
                          onClick={() => setSelectedFile(n.path)}
                          className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted/30 ${selectedFile === n.path ? "bg-primary/10 text-primary" : ""}`}
                        >
                          <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{n.path}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}