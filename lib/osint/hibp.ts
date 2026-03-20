export interface BreachEntry {
  Name: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  DataClasses: string[];
}

export async function checkEmailBreaches(email: string): Promise<BreachEntry[]> {
  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": apiKey,
          "User-Agent": "Synta-Security-Platform",
        },
      }
    );

    if (res.status === 404) return []; // no breaches
    if (!res.ok) throw new Error(`HIBP API error: ${res.status}`);

    return res.json() as Promise<BreachEntry[]>;
  } catch {
    return [];
  }
}

export async function checkDomainBreaches(domain: string): Promise<BreachEntry[]> {
  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://haveibeenpwned.com/api/v3/breacheddomain/${encodeURIComponent(domain)}`,
      {
        headers: {
          "hibp-api-key": apiKey,
          "User-Agent": "Synta-Security-Platform",
        },
      }
    );

    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`HIBP domain API error: ${res.status}`);

    return res.json() as Promise<BreachEntry[]>;
  } catch {
    return [];
  }
}
