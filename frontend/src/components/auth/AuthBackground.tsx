type AuthBackgroundProps = {
  children: React.ReactNode;
};

export default function AuthBackground({
  children,
}: AuthBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* Ambient glow */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute bottom-[-15%] right-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Subtle grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Network lines */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[22%] h-px w-[22%] rotate-[18deg] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />

        <div className="absolute right-[8%] top-[32%] h-px w-[24%] rotate-[-15deg] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

        <div className="absolute bottom-[24%] left-[14%] h-px w-[20%] rotate-[-12deg] bg-gradient-to-r from-transparent via-blue-400/15 to-transparent" />

        <div className="absolute bottom-[18%] right-[14%] h-px w-[18%] rotate-[20deg] bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
      </div>

      {/* Decorative nodes */}

      <div className="pointer-events-none absolute left-[9%] top-[21%] h-1.5 w-1.5 rounded-full bg-blue-400/40" />

      <div className="pointer-events-none absolute right-[14%] top-[30%] h-1.5 w-1.5 rounded-full bg-cyan-400/40" />

      <div className="pointer-events-none absolute bottom-[23%] left-[15%] h-1.5 w-1.5 rounded-full bg-blue-400/30" />

      <div className="pointer-events-none absolute bottom-[17%] right-[15%] h-1.5 w-1.5 rounded-full bg-cyan-400/30" />

      {/* Content */}

      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
}