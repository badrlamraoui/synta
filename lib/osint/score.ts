export interface OsintData {
  emailBreaches: number;
  hasDmarc: boolean;
  hasSpf: boolean;
  hasDkim: boolean;
  sslValid: boolean;
  sslDaysLeft: number;
  exposedSubdomains: number;
  openPorts: number;
}

export interface ScoreResult {
  global: number; // 0-10 (higher = more at risk)
  emails: number;
  emailConfig: number;
  infrastructure: number;
  breakdown: { label: string; score: number; status: "danger" | "warning" | "success" | "info" }[];
}

export function calculateScore(data: OsintData): ScoreResult {
  let emailScore = 0;
  if (data.emailBreaches >= 5)      emailScore = 10;
  else if (data.emailBreaches >= 2)  emailScore = 7;
  else if (data.emailBreaches === 1) emailScore = 4;
  else                               emailScore = 0;

  let emailConfigScore = 0;
  if (!data.hasDmarc) emailConfigScore += 4;
  if (!data.hasSpf)   emailConfigScore += 3;
  if (!data.hasDkim)  emailConfigScore += 3;

  let infraScore = 0;
  if (!data.sslValid)             infraScore += 5;
  else if (data.sslDaysLeft < 14) infraScore += 4;
  else if (data.sslDaysLeft < 30) infraScore += 2;
  if (data.exposedSubdomains > 3) infraScore += 3;
  else if (data.exposedSubdomains > 0) infraScore += 1;
  if (data.openPorts > 5) infraScore += 2;
  infraScore = Math.min(infraScore, 10);

  const global = Math.round((emailScore + emailConfigScore + infraScore) / 3);

  return {
    global,
    emails: emailScore,
    emailConfig: emailConfigScore,
    infrastructure: infraScore,
    breakdown: [
      {
        label: "Emails compromis",
        score: emailScore,
        status: emailScore >= 7 ? "danger" : emailScore >= 4 ? "warning" : "success",
      },
      {
        label: "Config email (DMARC/SPF/DKIM)",
        score: emailConfigScore,
        status: emailConfigScore >= 7 ? "danger" : emailConfigScore >= 4 ? "warning" : "success",
      },
      {
        label: "Infrastructure",
        score: infraScore,
        status: infraScore >= 7 ? "danger" : infraScore >= 4 ? "warning" : "success",
      },
    ],
  };
}
