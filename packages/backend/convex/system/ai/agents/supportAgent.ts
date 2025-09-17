import { Agent } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

export const supportAgent = new Agent(components.agent, {
  name: "Agent Echo",
  languageModel: google("gemini-2.5-flash") as any,
  instructions: SUPPORT_AGENT_PROMPT,
});
