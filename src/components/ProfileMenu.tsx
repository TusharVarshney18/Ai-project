import { useEffect, useState } from "react";
import { LogOut, User as UserIcon, Check, Pencil, Sun, Moon, Trash2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { BunnyPicker } from "@/components/BunnyPicker";
import { supabase } from "@/integrations/supabase/client";
import { deleteCurrentUser } from "@/routes/api.delete-account";
import type { BunnyId } from "@/lib/bunnies";
import { playClick } from "@/lib/sfx";

type Props = {
  userId: string;
  email: string;
  onLogout: () => void;
  onBunnyChange?: (id: BunnyId) => void;
};

export function ProfileMenu({ userId, email, onLogout, onBunnyChange }: Props) {
  const { displayName, bunny, loading, save, setBunny } = useProfile(userId);
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(displayName);
  }, [displayName]);
  useEffect(() => {
    onBunnyChange?.(bunny);
  }, [bunny, onBunnyChange]);

  const label = displayName || email.split("@")[0];
  const initial = (label || "?").charAt(0).toUpperCase();

  const handleSave = async () => {
    setBusy(true);
    setError(null);
    const { error } = await save(draft);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setEditing(false);
  };

  const handleBunny = async (id: BunnyId) => {
    await setBunny(id);
    onBunnyChange?.(id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Not signed in");
      await deleteCurrentUser({
        headers: { Authorization: `Bearer ${token}` } as any,
      } as any);
      await supabase.auth.signOut();
      window.location.href = "/auth";
    } catch (e: any) {
      setDeleteError(e?.message ?? "Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ── Trigger button ── */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
          style={{
            background: "color-mix(in oklab, var(--background) 85%, transparent)",
            borderColor: "color-mix(in oklab, var(--border) 80%, transparent)",
          }}
        >
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-[11px] font-bold text-primary-foreground shadow-inner"
          >
            {initial}
          </span>
          <span className="max-w-[120px] truncate text-sm font-medium">
            {loading ? "…" : label}
          </span>
        </Button>
      </PopoverTrigger>

      {/* ── Panel ── */}
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border p-0 shadow-2xl"
        style={{
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          borderColor: "var(--border)",
          boxShadow:
            "var(--shadow-elegant), 0 0 0 1px color-mix(in oklab, var(--border) 60%, transparent)",
        }}
      >
        {/* Header gradient banner */}
        <div
          className="relative px-4 pb-4 pt-5"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, var(--popover)), color-mix(in oklab, var(--accent) 10%, var(--popover)))",
          }}
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-2 bottom-0 h-16 w-16 rounded-full bg-primary/10 blur-xl" />

          <div className="relative flex items-center gap-3">
            {/* Avatar */}
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold shadow-lg"
              style={{
                background: "var(--gradient-primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--shadow-glow)",
                outline: "2px solid var(--popover)",
                outlineOffset: "0px",
              }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">{label}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="space-y-1 overflow-y-auto px-4 pb-4 pt-3"
          style={{ maxHeight: "calc(100vh - 160px)", background: "var(--popover)" }}
        >
          {/* ── Display name ── */}
          <section className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Display name
            </Label>
            {editing ? (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <Input
                    id="display-name"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={40}
                    autoFocus
                    className="h-9 rounded-xl text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                      if (e.key === "Escape") {
                        setEditing(false);
                        setDraft(displayName);
                        setError(null);
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl"
                    onClick={handleSave}
                    disabled={busy}
                    aria-label="Save"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 rounded-xl"
                    onClick={() => {
                      setEditing(false);
                      setDraft(displayName);
                      setError(null);
                    }}
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {error && (
                  <p className="rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive">
                    {error}
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="group flex w-full items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm transition-colors hover:bg-muted hover:border-primary/30"
              >
                <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                  <UserIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{displayName || "Set a display name"}</span>
                </span>
                <Pencil className="h-3 w-3 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors" />
              </button>
            )}
          </section>

          {/* ── Divider ── */}
          <div className="my-3 border-t border-border/40" />

          {/* ── Bunny picker ── */}
          <section className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Choose your bunny
            </Label>
            {/* Fixed-height scrollable zone — no more overflow bleeding */}
            <div className="max-h-48 overflow-y-auto rounded-xl pr-0.5 scrollbar-thin">
              <BunnyPicker current={bunny} onSelect={handleBunny} disabled={loading} />
            </div>
          </section>

          {/* ── Divider ── */}
          <div className="my-3 border-t border-border/40" />

          {/* ── Theme toggle ── */}
          <button
            type="button"
            onClick={() => {
              playClick();
              toggle();
            }}
            className="group flex w-full items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm transition-colors hover:bg-muted hover:border-primary/30"
          >
            <span className="flex items-center gap-2 font-medium">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-indigo-400" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
              {theme === "dark" ? "Dark theme" : "Light theme"}
            </span>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors group-hover:bg-primary/20">
              Switch
            </span>
          </button>

          {/* ── Divider ── */}
          <div className="my-3 border-t border-border/40" />

          {/* ── Logout ── */}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 rounded-xl border-border/60 text-sm font-medium transition-all hover:border-primary/30 hover:bg-muted"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </Button>

          {/* ── Delete account ── */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 w-full justify-center gap-2 rounded-xl text-destructive/70 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm leading-relaxed">
                  This permanently deletes your account, profile, and all data. This cannot be
                  undone. Type{" "}
                  <span className="rounded bg-muted px-1 py-0.5 font-mono font-semibold text-foreground">
                    DELETE
                  </span>{" "}
                  to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                placeholder="Type DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoComplete="off"
                className="rounded-xl"
              />
              {deleteError && (
                <p className="rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive">
                  {deleteError}
                </p>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="rounded-xl"
                  onClick={() => {
                    setConfirmText("");
                    setDeleteError(null);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={confirmText !== "DELETE" || deleting}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40"
                >
                  {deleting ? "Deleting…" : "Delete forever"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
