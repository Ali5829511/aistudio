import React from "react";
import { cn } from "../../utils";

export const Logo = ({ className = "size-32" }: { className?: string }) => (
  <div
    className={cn(
      "relative flex items-center justify-center overflow-hidden",
      className,
    )}
  >
    <img
      src="https://ramzabdae.com/wp-content/uploads/2023/06/ramz005.png"
      alt="Logo"
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);
