import React from "react";
import { ConversationsLayout } from "@/modules/dashboard/ui/layouts/conversations-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ConversationsLayout>{children}</ConversationsLayout>;
}
