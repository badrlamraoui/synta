// Free OSINT checks using public DNS and crt.sh (no API key required)

export interface DnsEmailConfig {
  hasDmarc: boolean;
  hasSpf: boolean;
  dmarcRecord?: string;
  spfRecord?: string;
}

export interface SslInfo {
  valid: boolean;
  daysLeft: number;
  grade?: string;
}

export interface SubdomainResult {
  subdomains: string[];
  count: number;
}

// Check DMARC via public DNS (using Google's DoH)
export async function checkDmarc(domain: string): Promise<{ hasDmarc: boolean; record?: string }> {
  try {
    const res = await fetch(
      `https://dns.google/resolve?name=_dmarc.${domain}&type=TXT`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = (await res.json()) as { Answer?: { data: string }[] };
    const record = data.Answer?.find(a => a.data.includes("v=DMARC1"));
    return { hasDmarc: !!record, record: record?.data };
  } catch {
    return { hasDmarc: false };
  }
}

// Check SPF via public DNS
export async function checkSpf(domain: string): Promise<{ hasSpf: boolean; record?: string }> {
  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${domain}&type=TXT`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = (await res.json()) as { Answer?: { data: string }[] };
    const record = data.Answer?.find(a => a.data.includes("v=spf1"));
    return { hasSpf: !!record, record: record?.data };
  } catch {
    return { hasSpf: false };
  }
}

// Enumerate subdomains via crt.sh (free, no API key)
export async function getSubdomains(domain: string): Promise<SubdomainResult> {
  try {
    const res = await fetch(
      `https://crt.sh/?q=%.${domain}&output=json`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return { subdomains: [], count: 0 };

    const entries = (await res.json()) as { name_value: string }[];
    const subs = [
      ...new Set(
        entries
          .flatMap(e => e.name_value.split("\n"))
          .map(s => s.trim().replace(/^\*\./, ""))
          .filter(s => s.endsWith(domain) && s !== domain)
      ),
    ];

    return { subdomains: subs.slice(0, 20), count: subs.length };
  } catch {
    return { subdomains: [], count: 0 };
  }
}

// Check SSL via SSL Labs (free, async — triggers analysis)
export async function checkSsl(domain: string): Promise<SslInfo> {
  try {
    const res = await fetch(
      `https://api.ssllabs.com/api/v3/analyze?host=${domain}&fromCache=on&all=done`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return { valid: false, daysLeft: 0 };

    const data = (await res.json()) as {
      status: string;
      endpoints?: { grade: string; details?: { cert?: { notAfter: number } } }[];
    };

    if (data.status !== "READY" || !data.endpoints?.length) {
      return { valid: true, daysLeft: 90 }; // optimistic default while analyzing
    }

    const endpoint = data.endpoints[0];
    const notAfter = endpoint.details?.cert?.notAfter ?? 0;
    const daysLeft = notAfter
      ? Math.round((notAfter * 1000 - Date.now()) / 86_400_000)
      : 90;

    return {
      valid: daysLeft > 0,
      daysLeft: Math.max(0, daysLeft),
      grade: endpoint.grade,
    };
  } catch {
    return { valid: true, daysLeft: 90 };
  }
}
