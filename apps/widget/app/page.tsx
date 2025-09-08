"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getUsers);
  console.log("🚀 ~ Page ~ users:", users);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello App/Widget</h1>
        Users: {users!?.map((u) => u.name).join(", ")}
      </div>
    </div>
  );
}
