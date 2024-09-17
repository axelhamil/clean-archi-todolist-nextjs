import { ReactElement, ReactNode } from "react";

import { cn } from "@/app/_components/utils";

interface ITypographyPProps {
  children?: ReactNode;
  className?: string;
}

export function TypographyP({
  children,
  className,
}: ITypographyPProps): ReactElement {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}
