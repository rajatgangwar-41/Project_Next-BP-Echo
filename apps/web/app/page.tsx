"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useQuery, useMutation } from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getUsers);
  const addUser = useMutation(api.users.addUser);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello App/Web</h1>
        <Button onClick={() => addUser({ name: "Randy Newman" as string })}>
          Add User
        </Button>
        Users: {users!?.map((u) => u.name).join(", ")}
      </div>
    </div>
  );
}
