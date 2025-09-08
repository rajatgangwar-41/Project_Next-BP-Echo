"use client";

import * as React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexConfig = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL! || "",
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convexConfig}>{children}</ConvexProvider>;
}
