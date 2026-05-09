import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

export function StarField() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0, // ✅ ensures it's behind UI but visible
        },

        background: {
          color: "transparent", // ✅ important
        },

        particles: {
          number: {
            value: 70,
            density: { enable: true, area: 800 },
          },

          color: {
            value: "#ffffff", // 🔥 bright so you can SEE it
          },

          shape: {
            type: "circle",
          },

          opacity: {
            value: 0.7,
          },

          size: {
            value: { min: 2, max: 5 },
          },

          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            outModes: {
              default: "out",
            },
          },

          links: {
            enable: true,
            distance: 120,
            color: "#ffffff",
            opacity: 0.3,
            width: 1,
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.6,
              },
            },
            push: {
              quantity: 4,
            },
          },
        },

        detectRetina: true,
      }}
    />
  );
}
