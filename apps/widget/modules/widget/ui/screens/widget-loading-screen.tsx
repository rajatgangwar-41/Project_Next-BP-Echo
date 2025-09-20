"use client";

import React from "react";
import { useAtom, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  widgetSettingsAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = React.useState<InitStep>("org");
  const [sessionValid, setSessionValid] = React.useState(false);

  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const [contactSessionId] = useAtom(
    contactSessionIdAtomFamily(organizationId || ""),
  );

  // Step 1: Validate Organization
  const validateOrganization = useAction(api.public.organizations.validate);

  React.useEffect(() => {
    if (step !== "org") {
      return;
    }

    setLoadingMessage("Finding Organization ID...");

    if (!organizationId) {
      setErrorMessage("Organization ID is required");
      setScreen("error");
      return;
    }

    setLoadingMessage("Veryfying Organization...");

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid configuration");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to verify organization");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setLoadingMessage,
    setScreen,
    setErrorMessage,
    setScreen,
    setStep,
    validateOrganization,
  ]);

  // Step 2: Validate Session
  const validateContactSession = useMutation(
    api.public.contactSessions.validate,
  );

  React.useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact session ID...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("settings");
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({
      contactSessionId,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("settings");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("settings");
      });
  }, [
    step,
    contactSessionId,
    validateContactSession,
    setLoadingMessage,
    setSessionValid,
    setStep,
  ]);

  // Step 3: Load Widget Settings
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId
      ? {
          organizationId,
        }
      : "skip",
  );

  React.useEffect(() => {
    if (step !== "settings") {
      return;
    }
    setLoadingMessage("Loading widget settings...");

    if (widgetSettings !== undefined) {
      setWidgetSettings(widgetSettings);
      setStep("done");
    }
  }, [step, widgetSettings, setStep, setWidgetSettings, setLoadingMessage]);

  React.useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
};
