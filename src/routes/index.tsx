import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
        content:
          "Chat with Mochi, a cheerful AI talking bunny. Speech, animation, and conversation in your browser.",
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
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setBunny(profileBunny);
  }, [profileBunny]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAndroid(/android/i.test(window.navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!loading && user) playHop();
  }, [bunny, loading, user]);

  const handleBunnyChange = useCallback((id: BunnyId) => setBunny(id), []);

  const handleSend = useCallback(
    async (text: string) => {
      playBoop();
      const result = await ask(text);
      if (result?.reply) speak(result.reply);
    },
    [ask, speak],
  );

  const handleLogout = useCallback(async () => {
    stop();
    reset();
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }, [stop, reset, navigate]);

  const current = getBunny(bunny);
  const heroStyle = useMemo(
    () => ({
      backgroundImage: `radial-gradient(circle at 12% 10%, ${current.glow}, transparent 34%), radial-gradient(circle at 88% 18%, ${current.accent}55, transparent 38%), linear-gradient(160deg, ${current.furLight} 0%, ${current.furDark} 100%)`,
    }),
    [current],
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </main>
    );
  }
  if (!user) return <Navigate to="/auth" />;

  return (
    // ── On mobile: full dvh, no overflow, flex-col so bunny + chat stack neatly
    // ── On desktop: original spacious centred layout
    <main
      className="relative mx-auto flex max-w-6xl flex-col items-center px-3 sm:px-4
                     min-h-[100dvh] overflow-hidden
                     md:min-h-screen md:overflow-visible md:py-8"
      style={heroStyle}
    >
      <StarField />

      {/* Profile menu — absolute so it doesn't affect layout flow */}
      <div className="absolute right-4 top-4 z-10">
        <ProfileMenu
          userId={user.id}
          email={user.email ?? ""}
          onLogout={handleLogout}
          onBunnyChange={handleBunnyChange}
        />
      </div>

      <header className="mb-4 w-full rounded-[2rem] border border-white/15 bg-white/25 px-4 py-4 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur-xl md:mb-6 md:px-5 md:py-5">
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-600">AI Bunny chat</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Chat with <span className="text-gradient">{current.name}</span> {current.emoji}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
          {current.description}
        </p>
      </header>

      {/* Main content area:
          Mobile  → vertical stack, bunny shrinks, chat fills remaining space
          Desktop → side-by-side grid, original sizing */}
      <section
        className={`
        flex flex-col items-center w-full gap-3 flex-1 min-h-0
        ${isAndroid ? "pt-16" : "pt-14"}
        md:grid md:grid-cols-2 md:items-center md:gap-8 md:pt-0 md:flex-none
      `}
      >
        {/* Bunny column — shrink-0 so keyboard never pushes it off screen */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-2 md:gap-3">
          {/* Scale bunny down on mobile */}
          <div className={`${isAndroid ? "scale-[0.64]" : "scale-[0.72]"} md:scale-100 origin-top`}>
            <Avatar
              isSpeaking={isSpeaking}
              isThinking={state === "thinking"}
              emotion={emotion}
              mouthLevel={mouthLevel}
              bunny={bunny}
            />
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize text-muted-foreground -mt-8 md:mt-0">
            mood: {emotion}
          </span>
        </div>

        {/* Chat column — flex-1 + min-h-0 makes it fill leftover space on mobile */}
        <div className="w-full flex-1 min-h-0 flex flex-col md:flex-none md:block">
          <ChatBox
            messages={messages}
            state={state}
            onSend={handleSend}
            onStop={stop}
            bunnyTheme={current}
          />
        </div>
      </section>

      {/* Footer — hidden on mobile */}
      <footer className="hidden md:block mt-10 text-center text-xs text-gray-500 shrink-0">
        <p>
          Private chat · Conversations are not saved ·{" "}
          <span className="text-black-300 font-medium">Powered by Tushar Studio</span>
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
