import { useEffect, useState } from "react";

type InteractiveIdentityCardProps = {
  fullName?: string;
  username?: string;
};

export default function InteractiveIdentityCard({
  fullName = "TrendAfrica",
  username = "your identity",
}: InteractiveIdentityCardProps) {
  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMouseMove(
      event: MouseEvent
    ) {
      const { innerWidth, innerHeight } =
        window;

      const x =
        (event.clientX / innerWidth - 0.5) *
        2;

      const y =
        (event.clientY / innerHeight - 0.5) *
        2;

      setRotation({
        x: -y * 8,
        y: x * 10,
      });
    }

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  return (
    <div
      className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-3xl"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Ambient background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_60%)]" />

      {/* Decorative network points */}

      <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-blue-400/70" />
      <div className="absolute right-[18%] top-[25%] h-2 w-2 rounded-full bg-cyan-400/60" />
      <div className="absolute bottom-[22%] left-[20%] h-2 w-2 rounded-full bg-blue-300/60" />
      <div className="absolute bottom-[18%] right-[15%] h-2 w-2 rounded-full bg-cyan-300/60" />

      {/* Card */}

      <div
        className="relative w-[320px] max-w-[85%] transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glow */}

        <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl" />

        {/* Main card */}

        <div
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Top branding */}

          <div
            className="flex items-center justify-between"
            style={{
              transform: "translateZ(30px)",
            }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
                TREND
              </p>

              <p className="text-2xl font-black tracking-tight text-white">
                AFRICA
              </p>
            </div>

            <div className="h-10 w-10 rounded-full border border-blue-400/30 bg-blue-500/10" />
          </div>

          {/* Identity */}

          <div
            className="mt-14 text-center"
            style={{
              transform: "translateZ(50px)",
            }}
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500/30 to-cyan-400/10 shadow-xl">
              <span className="text-4xl font-black text-white">
                {fullName
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              {fullName}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              @{username}
            </p>
          </div>

          {/* Community */}

          <div
            className="mt-12 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center"
            style={{
              transform: "translateZ(25px)",
            }}
          >
            <div>
              <p className="text-lg font-bold text-white">
                01
              </p>

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Identity
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white">
                01
              </p>

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Community
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white">
                TA
              </p>

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Network
              </p>
            </div>
          </div>

          {/* Bottom statement */}

          <div
            className="mt-7 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center"
            style={{
              transform: "translateZ(20px)",
            }}
          >
            <p className="text-xs font-medium text-slate-400">
              Africa is talking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}