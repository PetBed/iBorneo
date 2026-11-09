const includedScope = "SSM registration fee, name search, and statutory secretarial book creation.";

const estimates = {
  "sdn-bhd": {
    entityId: "sdn-bhd",
    label: "Sdn Bhd",
    amount: 2000,
  },
  "llp-plt": {
    entityId: "llp-plt",
    label: "LLP / PLT",
    amount: 1800,
  },
  "sole-proprietor": {
    entityId: "sole-proprietor",
    label: "Sole Proprietor / Partnership",
    amount: 1100,
  },
};

export function getEstimate(entityId) {
  const estimate = estimates[entityId];

  if (!estimate) {
    throw new RangeError(`Unsupported business entity: ${entityId}`);
  }

  return { ...estimate, includedScope };
}

export function formatRinggit(amount) {
  const wholeAmount = String(amount);
  const formattedAmount = wholeAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `RM ${formattedAmount}`;
}
