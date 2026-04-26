import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { ChatBox } from "@/components/ChatBox";
import { ProfileMenu } from "@/components/ProfileMenu";
import { StarField } from "@/components/StarField";
import { useAI } from "@/hooks/useAI";
import { useSpeech } from "@/hooks/useSpeech";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { getBunny, type BunnyId } from "@/lib/bunnies";
import { playBoop, playHop } from "@/lib/sfx";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Mochi — AI Talking Bunny" },
      {
        name: "description",
        content: "Chat with Mochi, a cheerful AI talking bunny. Speech, animation, and conversation in your browser.",
      },
    ],
  }),
});

function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { messages, state, setState, emotion, ask, reset } = useAI();
  const { speak, stop, isSpeaking, mouthLevel } = useSpeech({
    onStart: () => setState("speaking"),
    onEnd: () => setState("idle"),
  });
  const { bunny: profileBunny } = useProfile(user?.id);
  const [bunny, setBunny] = useState<BunnyId>("mochi");

  useEffect(() => { setBunny(profileBunny); }, [profileBunny]);

  // Pre-load TTS voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Soft "hop" when bunny appears / changes
  useEffect(() => {
    if (!loading && user) playHop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bunny, loading]);

  const handleBunnyChange = useCallback((id: BunnyId) => setBunny(id), []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </main>
    );
  }
  if (!user) return <Navigate to="/auth" />;

  const handleSend = async (text: string) => {
    playBoop();
    const result = await ask(text);
    if (result?.reply) speak(result.reply);
  };

  const handleLogout = async () => {
    stop();
    reset();
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const current = getBunny(bunny);

  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center px-4 py-8">
      <StarField />
      <div className="absolute right-4 top-4">
        <ProfileMenu
          userId={user.id}
          email={user.email ?? ""}
          onLogout={handleLogout}
          onBunnyChange={handleBunnyChange}
        />
      </div>

      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Meet <span className="text-gradient">{current.name}</span> {current.emoji}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {current.description}
        </p>
      </header>

      <section className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-3">
          <Avatar
            isSpeaking={isSpeaking}
            isThinking={state === "thinking"}
            emotion={emotion}
            mouthLevel={mouthLevel}
            bunny={bunny}
          />
          <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-muted-foreground">
            mood: {emotion}
          </span>
        </div>
        <ChatBox messages={messages} state={state} onSend={handleSend} onStop={stop} />
      </section>
      <footer className="mt-10 text-center text-xs text-gray-500">
        <p>
          Private chat · Conversations are not saved ·{" "}
          <span className="text-black-300 font-medium">
            Powered by Tushar Studio
          </span>
        </p>

        <div className="mt-2 flex justify-center gap-4">
          <a href="/privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white">
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}
