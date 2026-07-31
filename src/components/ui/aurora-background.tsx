"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main className="w-full overflow-hidden">
      <div
        className={cn(
          "relative flex flex-col min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-950 transition-bg py-16",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className={cn(
              `
            [--white:#ffffff]
            [--black:#000000]
            [--transparent:transparent]
            [--white-gradient:repeating-linear-gradient(100deg,#ffffff_0%,#ffffff_7%,transparent_10%,transparent_12%,#ffffff_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,#000000_0%,#000000_7%,transparent_10%,transparent_12%,#000000_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#818cf8_15%,#60a5fa_20%,#c084fc_25%,#3b82f6_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:200%,_100%]
            [background-position:50%_50%,50%_50%]
            after:content-[""] after:absolute after:inset-0 
            after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora
            pointer-events-none
            absolute -inset-[10px] opacity-35`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
            )}
          ></div>
        </div>
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </main>
  );
};
