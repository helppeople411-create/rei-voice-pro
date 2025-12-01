/* ──────────────────────────────────────────────
   1) CAPTURE LEAD INFORMATION
   PRIORITY SEQUENCE FOR VOICE AGENT:
   1. Property Address (must always be captured first)
   2. Contact Info
   3. Motivation
────────────────────────────────────────────── */
export const captureLeadTool = {
  name: "captureLeadInfo",
  description:
    "Captures real estate lead information. Strict order: (1) Property Address, (2) Contact Info, (3) Motivation.",
  parameters: {
    type: "OBJECT",
    // REMOVED 'required' array to allow partial updates (e.g. just capturing name after address is known)
    properties: {
      propertyAddress: {
        type: "STRING",
        description:
          "Full property address being sold. MUST be captured first.",
      },
      name: {
        type: "STRING",
        description: "Lead's full name.",
      },
      phone: {
        type: "STRING",
        description: "Lead's best contact phone number.",
      },
      email: {
        type: "STRING",
        description: "Lead's email address.",
      },
      motivation: {
        type: "STRING",
        description:
          "Reason for selling (relocation, financial distress, tired landlord, inherited property, etc.).",
      },
    },
  },
};


/* ──────────────────────────────────────────────
   2) STRUCTURE OFFER
   Trigger when specific numbers are being discussed.
────────────────────────────────────────────── */
export const structureOfferTool = {
  name: "structureOffer",
  description:
    "Creates a structured real estate offer once specific numbers are discussed.",
  parameters: {
    type: "OBJECT",
    // REMOVED 'required' to prevent connection drops if AI hallucinates a partial offer
    properties: {
      offerType: {
        type: "STRING",
        description:
          "Offer strategy: CASH, SELLER_FINANCE, SUB_TO, LEASE_OPTION, OTHER.",
      },
      purchasePrice: {
        type: "NUMBER",
        description: "Total purchase price being offered.",
      },
      arv: {
        type: "NUMBER",
        description: "After Repair Value used in offer logic.",
      },
      downPayment: {
        type: "NUMBER",
        description: "Cash paid at closing for creative deals.",
      },
      interestRate: {
        type: "NUMBER",
        description:
          "Interest rate offered for seller financing.",
      },
      termLength: {
        type: "STRING",
        description: "Financing term (e.g., '5 years', '30 years').",
      },
      monthlyPayment: {
        type: "NUMBER",
        description: "Monthly payment to seller if applicable.",
      },
      closingDays: {
        type: "NUMBER",
        description: "Closing timeline in days.",
      },
      contingencies: {
        type: "STRING",
        description:
          "Inspection, clear title, appraisal, or none.",
      },
    },
  },
};


/* ──────────────────────────────────────────────
   3) ESTIMATE ARV
   Trigger when seller does NOT know the value.
────────────────────────────────────────────── */
export const estimateArvTool = {
  name: "estimateArv",
  description:
    "Collects structured property details so an ARV engine or human underwriter can estimate value. Assistant MUST NOT guess ARV.",
  parameters: {
    type: "OBJECT",
    // REMOVED 'required' to allow partial data collection
    properties: {
      propertyAddress: {
        type: "STRING",
        description:
          "Full property address for ARV estimation.",
      },
      beds: {
        type: "NUMBER",
        description: "Number of bedrooms.",
      },
      baths: {
        type: "NUMBER",
        description: "Number of bathrooms.",
      },
      squareFeet: {
        type: "NUMBER",
        description: "Approximate living area in square feet.",
      },
      propertyType: {
        type: "STRING",
        description: "Single family, duplex, condo, etc.",
      },
      condition: {
        type: "STRING",
        description: "Condition level (distressed, dated, updated, renovated).",
      },
      repairsNeeded: {
        type: "STRING",
        description: "Major repairs needed.",
      },
      sellerValueOpinion: {
        type: "NUMBER",
        description: "Seller's opinion of value, if any.",
      },
      notes: {
        type: "STRING",
        description: "Additional notes that affect value.",
      },
    },
  },
};

/* ──────────────────────────────────────────────
   4) SEND OFFER EMAIL
   Trigger when user agrees to receive a written offer.
────────────────────────────────────────────── */
export const sendOfferEmailTool = {
  name: "sendOfferEmail",
  description:
    "Sends a written real estate offer to the seller via email after terms are discussed.",
  parameters: {
    type: "OBJECT",
    required: ["toEmail", "subject", "bodyText"],
    properties: {
      toEmail: {
        type: "STRING",
        description: "Seller's email address.",
      },
      subject: {
        type: "STRING",
        description: "Email subject line summarizing the offer.",
      },
      bodyText: {
        type: "STRING",
        description:
          "Plain-text version of the written offer.",
      },
      ccEmail: {
        type: "STRING",
        description:
          "Optional CC address.",
      },
      propertyAddress: {
        type: "STRING",
        description:
          "The property the offer relates to.",
      },
      offerType: {
        type: "STRING",
        description:
          "Offer type for clarity in the email.",
      },
      purchasePrice: {
        type: "NUMBER",
        description: "Offer price included in the email.",
      },
      monthlyPayment: {
        type: "NUMBER",
        description:
          "For creative deals: monthly payment if applicable.",
      },
      closingDays: {
        type: "NUMBER",
        description:
          "Closing timeline if included.",
      },
    },
  },
};

/* ──────────────────────────────────────────────
   5) SEARCH COMPS
   Trigger to find comparable sales.
────────────────────────────────────────────── */
export const searchCompsTool = {
  name: "searchComps",
  description:
    "Searches for comparable property sales (comps) within a 0.5-mile radius to help estimate ARV. Returns sold price, date, beds, baths, and sqft.",
  parameters: {
    type: "OBJECT",
    properties: {
      address: {
        type: "STRING",
        description: "Target property address to search around.",
      },
      radius: {
        type: "NUMBER",
        description: "Search radius in miles. Limit to 0.5.",
      },
      minBeds: {
        type: "NUMBER",
        description: "Minimum bedrooms (optional).",
      },
      minBaths: {
        type: "NUMBER",
        description: "Minimum bathrooms (optional).",
      },
    },
  },
};
