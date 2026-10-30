
export const PREMIUM_CONFIG = {
  durationMonths: 12,
  price: 100,
  currency: "ETB",

  streams: [
    {
      id: "natural",
      name: "Natural",
      description: "Natural Science courses",
    },
    {
      id: "social",
      name: "Social",
      description: "Social Science courses",
    },
  ],

  paymentMethods: [
    {
      id: "cbe",
      name: "Commercial Bank of Ethiopia",
      shortName: "CBE",
      accountName: "Biruk Alem",
      accountNumber: "1000122554761",
    },
    {
      id: "telebirr",
      name: "Telebirr",
      shortName: "Telebirr",
      accountName: "Biruk Alem",
      accountNumber: "0910000000",
    },
    {
      id: "ebirr",
      name: "eBirr",
      shortName: "eBirr",
      accountName: "Biruk Alem",
      accountNumber: "0910000000",
    },
  ],
} as const;
