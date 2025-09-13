import { Agent } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Agent Echo",
  languageModel: google("gemini-2.5-flash") as any,
  instructions: "You are a helpful assistant.",
});
