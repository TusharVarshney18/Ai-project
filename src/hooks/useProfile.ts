import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BunnyId } from "@/lib/bunnies";

export function useProfile(userId: string | undefined) {
  const [displayName, setDisplayName] = useState<string>("");
  const [bunny, setBunnyState] = useState<BunnyId>("mochi");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setDisplayName("");
      setBunnyState("mochi");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("profiles")
      .select("display_name, bunny")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setDisplayName(data?.display_name ?? "");
        setBunnyState(((data as any)?.bunny as BunnyId) ?? "mochi");
        setLoading(false);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to load profile:", error);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const save = useCallback(
    async (name: string) => {
      if (!userId) return { error: "Not signed in" as const };
      const trimmed = name.trim();
      if (trimmed.length < 1 || trimmed.length > 40) {
        return { error: "Name must be 1–40 characters" as const };
      }
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: trimmed })
        .eq("id", userId);
      if (error) return { error: error.message };
      setDisplayName(trimmed);
      return { error: null };
    },
    [userId],
  );

  const setBunny = useCallback(
    async (id: BunnyId) => {
      setBunnyState(id);
      if (!userId) return { error: "Not signed in" as const };
      const { error } = await supabase
        .from("profiles")
        .update({ bunny: id } as any)
        .eq("id", userId);
      if (error) return { error: error.message };
      return { error: null };
    },
    [userId],
  );

  return { displayName, bunny, loading, save, setBunny };
}
