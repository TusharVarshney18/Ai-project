import { useEffect, useState } from "react";
import { LogOut, User as UserIcon, Check, Pencil, Sun, Moon, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
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

  useEffect(() => { setDraft(displayName); }, [displayName]);
  // Notify parent when bunny choice loads/changes from DB
  useEffect(() => { onBunnyChange?.(bunny); }, [bunny, onBunnyChange]);

  const label = displayName || email.split("@")[0];
  const initial = (label || "?").charAt(0).toUpperCase();

  const handleSave = async () => {
    setBusy(true);
    setError(null);
    const { error } = await save(draft);
    setBusy(false);
    if (error) { setError(error); return; }
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
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {initial}
          </span>
          <span className="max-w-[140px] truncate">{loading ? "…" : label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{label}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Display name */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="display-name" className="text-xs">Display name</Label>
          {editing ? (
            <>
              <div className="flex gap-2">
                <Input
                  id="display-name" value={draft} onChange={(e) => setDraft(e.target.value)}
                  maxLength={40} autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") { setEditing(false); setDraft(displayName); setError(null); }
                  }}
                />
                <Button size="icon" onClick={handleSave} disabled={busy} aria-label="Save">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent"
            >
              <span className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{displayName || "Set a display name"}</span>
              </span>
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Bunny picker */}
        <div className="mt-4 space-y-2">
          <Label className="text-xs">Choose your bunny</Label>
          <BunnyPicker current={bunny} onSelect={handleBunny} disabled={loading} />
        </div>

        {/* Theme */}
        <div className="mt-4">
          <Button
            variant="outline" size="sm" className="w-full justify-between"
            onClick={() => { playClick(); toggle(); }}
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "dark" ? "Dark theme" : "Light theme"}
            </span>
            <span className="text-xs text-muted-foreground">Switch</span>
          </Button>
        </div>

        {/* Logout */}
        <Button
          variant="outline" size="sm" className="mt-4 w-full justify-center"
          onClick={() => { setOpen(false); onLogout(); }}
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Log out
        </Button>

        {/* Delete account */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-center text-destructive hover:text-destructive">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes your account, profile, and all data. This cannot be undone.
                Type <span className="font-mono font-semibold">DELETE</span> to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              placeholder="Type DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
            />
            {deleteError && <p className="text-xs text-destructive">{deleteError}</p>}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setConfirmText(""); setDeleteError(null); }}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={confirmText !== "DELETE" || deleting}
                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting…" : "Delete forever"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PopoverContent>
    </Popover>
  );
}
