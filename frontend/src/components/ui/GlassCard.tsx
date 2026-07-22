"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type GlassCardProps = React.ComponentPropsWithoutRef<typeof Card> & {
  title?: string;
  description?: string;
};

export function GlassCard({ className = "", title, description, children, ...props }: GlassCardProps) {
  return (
    <Card
      className={`bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl ${className}`}
      {...props}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
