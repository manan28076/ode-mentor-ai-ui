import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <AppShell>
      <PageHeader title="Settings" description="Customize CodeMentor AI to fit your workflow." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Row label="Dark mode" hint="Reduce eye strain with a dark interface.">
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </Row>
            <Row label="Editor theme">
              <Select defaultValue="one-dark">
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-dark">One Dark</SelectItem>
                  <SelectItem value="monokai">Monokai</SelectItem>
                  <SelectItem value="dracula">Dracula</SelectItem>
                  <SelectItem value="github">GitHub Light</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <div>
              <Label>Editor font size</Label>
              <div className="mt-3"><Slider defaultValue={[14]} min={10} max={22} step={1} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Row label="Email — review completed"><Switch defaultChecked /></Row>
            <Row label="Email — weekly digest"><Switch /></Row>
            <Row label="Product updates"><Switch defaultChecked /></Row>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Language</CardTitle></CardHeader>
          <CardContent>
            <Select defaultValue="en">
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader><CardTitle className="text-destructive">Danger zone</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Row label="Export all data"><Button variant="outline" onClick={() => toast.success("Export queued (mock)")}>Export</Button></Row>
            <Row label="Delete account" hint="This cannot be undone.">
              <Button variant="destructive" onClick={() => toast.error("Would delete account (mock)")}>Delete</Button>
            </Row>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}