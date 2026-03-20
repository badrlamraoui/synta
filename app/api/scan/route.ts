import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkDmarc, checkSpf, getSubdomains, checkSsl } from "@/lib/osint/dns";
import { checkDomainBreaches } from "@/lib/osint/hibp";
import { calculateScore } from "@/lib/osint/score";

const ScanSchema = z.object({
  domain: z
    .string()
    .min(3)
    .max(253)
    .regex(/^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/i, "Domaine invalide"),
  email: z.string().email("Email invalide").optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ScanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { domain } = parsed.data;

    // Run all OSINT checks in parallel
    const [dmarc, spf, subdomains, ssl, breaches] = await Promise.all([
      checkDmarc(domain),
      checkSpf(domain),
      getSubdomains(domain),
      checkSsl(domain),
      checkDomainBreaches(domain),
    ]);

    const score = calculateScore({
      emailBreaches:     breaches.length,
      hasDmarc:          dmarc.hasDmarc,
      hasSpf:            spf.hasSpf,
      hasDkim:           false, // TODO: add DKIM check
      sslValid:          ssl.valid,
      sslDaysLeft:       ssl.daysLeft,
      exposedSubdomains: subdomains.count,
      openPorts:         0, // TODO: add port check
    });

    const result = {
      domain,
      scannedAt: new Date().toISOString(),
      score,
      details: {
        breaches: {
          count: breaches.length,
          sources: breaches.map(b => ({ name: b.Name, date: b.BreachDate, dataClasses: b.DataClasses })),
        },
        emailConfig: {
          hasDmarc:    dmarc.hasDmarc,
          hasSpf:      spf.hasSpf,
          dmarcRecord: dmarc.record,
          spfRecord:   spf.record,
        },
        subdomains: {
          count: subdomains.count,
          list:  subdomains.subdomains,
        },
        ssl: {
          valid:    ssl.valid,
          daysLeft: ssl.daysLeft,
          grade:    ssl.grade,
        },
      },
    };

    // TODO Phase 2: save to DB, generate PDF, send email via Resend
    // if (email) await sendReportEmail(email, domain, result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/scan] error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
