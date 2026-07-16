export const appConfig = {
  appName: "Attendly",
  tagline: "Powered by ARC AI",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export const eventConfig = {
  eventName: process.env.EVENT_NAME ?? "Attendly Event",
  ticketPrice: process.env.TICKET_PRICE ?? "",
  bank: {
    name: process.env.BANK_NAME ?? "",
    accountName: process.env.BANK_ACCOUNT_NAME ?? "",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "",
    branch: process.env.BANK_BRANCH ?? "",
  },
};

/** Batch (class-of) years offered in the registration form, newest first. */
export function batchYears(): string[] {
  const current = new Date().getFullYear();
  const years: string[] = [];
  for (let y = current; y >= 1980; y--) years.push(String(y));
  return years;
}

export function portalUrl(accessToken: string): string {
  return `${appConfig.appUrl}/r/${accessToken}`;
}
