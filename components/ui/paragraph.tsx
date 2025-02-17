import { ReactNode } from "react";

interface ParagraphProps {
  children: ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-1">{children}</p>;
}
