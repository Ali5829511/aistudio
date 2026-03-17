import React from "react";
import { cn } from "../../utils";

export const Icon = ({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) => (
  <span
    className={cn("material-symbols-outlined", filled && "filled", className)}
  >
    {name}
  </span>
);
