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
      { title: "Mochi — Bunny AI Assistant" },
      {
        name: "description",
        content:
          "Chat with Mochi, your premium AI bunny assistant powered by Bunny AI.",
      },
    ],
  }),
});

function Index() {
  const { user, loading } = useAuth();

  const navigate = useNavigate();

  const { messages, state, setState, emotion, ask, reset } =
    useAI();

  const {
    speak,
    stop,
    isSpeaking,
    mouthLevel,
  } = useSpeech({
    onStart: () => setState("speaking"),
    onEnd: () => setState("idle"),
  });

  const { bunny: profileBunny } = useProfile(user?.id);

  const [bunny, setBunny] =
    useState<BunnyId>("mochi");

  useEffect(() => {
    setBunny(profileBunny);
  }, [profileBunny]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      playHop();
    }
  }, [bunny, loading, user]);

  const handleBunnyChange = useCallback(
    (id: BunnyId) => setBunny(id),
    []
  );

  const handleSend = useCallback(
    async (text: string) => {
      playBoop();

      const result = await ask(text);

      if (result?.reply) {
        speak(result.reply);
      }
    },
    [ask, speak]
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
      backgroundImage: `
        radial-gradient(circle at 10% 10%, ${current.glow}, transparent 28%),
        radial-gradient(circle at 90% 0%, ${current.accent}40, transparent 30%),
        linear-gradient(
          180deg,
          #f7f9ff 0%,
          #eef6ff 45%,
          #fdfcff 100%
        )
      `,
    }),
    [current]
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

return (
  <main
    style={{
      ...heroStyle,
      WebkitTapHighlightColor: "transparent",
    }}
    className="
      relative
      mx-auto
      flex
      min-h-[100dvh]
      max-w-6xl
      flex-col
      overflow-hidden
      px-3
      pt-3
      pb-3
      sm:px-4
    "
  >
    <StarField />

    {/* NAVBAR */}
    <div className="sticky top-0 z-30 w-full">
      <div
        className="
          flex
          items-center
          justify-between
          rounded-[28px]
          border
          border-white/40
          bg-white/50
          px-4
          py-3
          shadow-[0_8px_40px_rgba(15,23,42,0.05)]
          backdrop-blur-2xl
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-violet-500
              to-blue-500
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-blue-200/50
            "
          >
            AI
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">
              Bunny AI
            </p>

            <h2 className="truncate text-[16px] font-semibold text-slate-900">
              {current.name}
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ml-3 shrink-0">
          <ProfileMenu
            userId={user.id}
            email={user.email ?? ""}
            onLogout={handleLogout}
            onBunnyChange={handleBunnyChange}
          />
        </div>
      </div>
    </div>

    {/* HERO */}
    <header
      className="
        mt-4
        rounded-[34px]
        border
        border-white/30
        bg-white/35
        px-5
        py-7
        text-center
        shadow-[0_10px_50px_rgba(15,23,42,0.05)]
        backdrop-blur-2xl
      "
    >
      <p className="text-[11px] uppercase tracking-[0.38em] text-slate-500">
        AI Bunny Chat
      </p>

      <h1
        className="
          mt-4
          text-[32px]
          leading-[1.05]
          font-bold
          tracking-tight
          text-slate-900
          sm:text-5xl
        "
      >
        Chat with{" "}
        <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
          {current.name}
        </span>
      </h1>

      <div className="mt-3 text-3xl">
        {current.emoji}
      </div>

      <p
        className="
          mx-auto
          mt-4
          max-w-md
          text-[15px]
          leading-7
          text-slate-600
        "
      >
        {current.description}
      </p>
    </header>

    {/* MAIN */}
    <section
      className="
        flex
        flex-1
        min-h-0
        flex-col
        items-center
        justify-between
        pt-4
        md:grid
        md:grid-cols-2
        md:gap-10
      "
    >
      {/* BUNNY */}
      <div
        className="
          flex
          flex-1
          flex-col
          items-center
          justify-center
        "
      >
        <div className="scale-[0.72] sm:scale-[0.85] md:scale-100">
          <Avatar
            isSpeaking={isSpeaking}
            isThinking={state === "thinking"}
            emotion={emotion}
            mouthLevel={mouthLevel}
            bunny={bunny}
          />
        </div>

        <div
          className="
            mt-2
            rounded-full
            border
            border-white/50
            bg-white/65
            px-5
            py-2
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            backdrop-blur-xl
          "
        >
          Mood: {emotion}
        </div>
      </div>

      {/* CHAT */}
      <div
        className="
          mt-5
          flex
          w-full
          min-h-0
          flex-col
          md:mt-0
        "
      >
        <ChatBox
          messages={messages}
          state={state}
          onSend={handleSend}
          onStop={stop}
          bunnyTheme={current}
        />
      </div>
    </section>
  </main>
);
}