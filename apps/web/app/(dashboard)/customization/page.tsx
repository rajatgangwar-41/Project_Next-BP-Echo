import React from "react";
import { Protect } from "@clerk/nextjs";
import { CustomizationView } from "@/modules/customization/ui/views/customization-view";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const Customization = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <CustomizationView />
        </PremiumFeatureOverlay>
      }
    >
      <CustomizationView />
    </Protect>
  );
};

export default Customization;
