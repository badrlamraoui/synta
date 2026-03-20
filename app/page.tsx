"use client";

import { useState, useEffect } from "react";

// ── Design tokens (light theme) ───────────────────────────────
const C = {
  bg:          "#F8FAFC",
  bgAlt:       "#F1F5F9",
  bgCard:      "#FFFFFF",
  border:      "#E2E8F0",
  borderStrong:"#CBD5E1",
  blue:        "#2563EB",
  blueDim:     "#1D4ED8",
  blueBg:      "#EFF6FF",
  teal:        "#0891B2",
  textPrimary: "#0F172A",
  textSecond:  "#475569",
  textMuted:   "#94A3B8",
  danger:      "#DC2626",
  dangerBg:    "#FEF2F2",
  warning:     "#D97706",
  warningBg:   "#FFFBEB",
  success:     "#059669",
  successBg:   "#F0FDF4",
};

// ── Icons ─────────────────────────────────────────────────────
function ShieldIcon({ size = 24, color = C.blue }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6V12C4 16.418 7.582 20 12 22C16.418 20 20 16.418 20 12V6L12 2Z"
        stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M9 12L11 14L15 10"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 40px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(248,250,252,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ShieldIcon size={26} color={C.blue} />
        <span style={{
          fontFamily: "var(--font-syne), Syne, sans-serif",
          fontWeight: 800, fontSize: 20,
          letterSpacing: "0.05em", color: C.textPrimary,
        }}>SYNTA</span>
      </div>

      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {["Solution", "Tarifs", "Ressources"].map(item => (
          <a key={item} href="#" style={{
            color: C.textSecond, textDecoration: "none",
            fontSize: 14, fontWeight: 500, transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = C.textPrimary)}
            onMouseLeave={e => (e.currentTarget.style.color = C.textSecond)}
          >{item}</a>
        ))}
        <button style={{
          background: C.blue, color: "#fff",
          border: "none", padding: "10px 22px",
          borderRadius: 6, fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
          fontWeight: 600, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
          boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.blueDim; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Analyser mon domaine
        </button>
      </div>
    </nav>
  );
}

// ── Score ring ────────────────────────────────────────────────
function ScoreRing({ score = 7 }: { score?: number }) {
  const pct = (score / 10) * 283;
  const ringColor = score >= 7 ? C.danger : score >= 5 ? C.warning : C.success;
  const label     = score >= 7 ? "ÉLEVÉ"  : score >= 5 ? "MODÉRÉ"  : "FAIBLE";
  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r="46" fill="none" stroke={C.border} strokeWidth="7" />
        <circle cx="60" cy="60" r="46" fill="none"
          stroke={ringColor} strokeWidth="7"
          strokeDasharray={`${pct} 283`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 2,
      }}>
        <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 24, color: ringColor }}>{score}</span>
        <span style={{ fontSize: 9, color: ringColor, letterSpacing: "0.08em", fontWeight: 700 }}>{label}</span>
      </div>
    </div>
  );
}

// ── Mock report card ──────────────────────────────────────────
function MockReport() {
  const rows = [
    { label: "Emails compromis",      value: "3 détectés",          status: "danger"  as const },
    { label: "DMARC / SPF / DKIM",    value: "Non configuré",       status: "danger"  as const },
    { label: "Sous-domaines exposés", value: "1 trouvé",            status: "warning" as const },
    { label: "CMS à jour",            value: "Version 5.8",         status: "warning" as const },
    { label: "Certificat SSL",        value: "Valide — 89 jours",   status: "success" as const },
  ];
  const statusColor = { danger: C.danger, warning: C.warning, success: C.success };
  const statusBg    = { danger: C.dangerBg, warning: C.warningBg, success: C.successBg };

  return (
    <div style={{
      background: C.bgCard, borderRadius: 12,
      border: `1px solid ${C.border}`,
      boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(37,99,235,0.06)",
      padding: 28, width: 360,
      animation: "float 4s ease-in-out infinite",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 4, fontFamily: "var(--font-jetbrains)" }}>
            RAPPORT D&apos;EXPOSITION
          </div>
          <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: C.textPrimary }}>
            cabinet-exemple.fr
          </div>
        </div>
        <ScoreRing score={7} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "9px 12px",
            background: statusBg[row.status] + "55",
            borderRadius: 6,
            border: `1px solid ${statusColor[row.status]}22`,
          }}>
            <span style={{ fontSize: 12, color: C.textSecond }}>{row.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: statusColor[row.status],
              fontFamily: "var(--font-jetbrains)",
            }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 16, padding: "10px 14px",
        background: C.blueBg,
        border: `1px solid ${C.blue}22`,
        borderRadius: 6,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: C.blue, fontWeight: 500 }}>Rapport complet disponible</span>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "var(--font-jetbrains)" }}>47s</span>
      </div>
    </div>
  );
}

// ── Domain input ──────────────────────────────────────────────
function DomainInput() {
  const [domain,  setDomain]  = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const handleSubmit = () => {
    if (!domain.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  if (done) {
    return (
      <div style={{
        padding: "18px 24px",
        background: C.successBg,
        border: `1px solid ${C.success}44`,
        borderRadius: 8,
        display: "flex", alignItems: "center", gap: 12, maxWidth: 500,
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke={C.success} strokeWidth="1.5" />
          <path d="M6.5 10L8.5 12L13.5 8" stroke={C.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ color: C.success, fontSize: 14, fontWeight: 500 }}>
          Analyse en cours — Rapport envoyé dans quelques minutes à votre email.
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", maxWidth: 520, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <div style={{
        display: "flex", alignItems: "center",
        background: C.bgCard, border: `1px solid ${C.border}`,
        borderRight: "none", borderRadius: "8px 0 0 8px",
        padding: "0 16px", flex: 1, gap: 10,
      }}>
        <span style={{ color: C.textMuted, fontSize: 13, fontFamily: "var(--font-jetbrains)" }}>https://</span>
        <input
          type="text"
          placeholder="votre-cabinet.fr"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: C.textPrimary, fontSize: 15, flex: 1, padding: "16px 0",
            fontFamily: "var(--font-dm-sans)",
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: loading ? "#93C5FD" : C.blue,
          color: "#fff", border: "none",
          padding: "0 28px", borderRadius: "0 8px 8px 0",
          fontFamily: "var(--font-dm-sans)", fontWeight: 600, fontSize: 14,
          cursor: loading ? "wait" : "pointer",
          transition: "all 0.2s", whiteSpace: "nowrap", minWidth: 160,
        }}
      >
        {loading ? "Analyse en cours..." : "Obtenir mon rapport"}
      </button>
    </div>
  );
}

// ── Stat badge ────────────────────────────────────────────────
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 34,
        color: C.blue, lineHeight: 1, marginBottom: 6,
      }}>{value}</div>
      <div style={{ fontSize: 13, color: C.textSecond, maxWidth: 130 }}>{label}</div>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────
function FeatureCard({ icon, title, desc, tag }: { icon: string; title: string; desc: string; tag?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${hovered ? C.blue + "44" : C.border}`,
        borderRadius: 10, padding: 28,
        boxShadow: hovered ? "0 8px 24px rgba(37,99,235,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: C.blueBg,
          border: `1px solid ${C.blue}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>{icon}</div>
        {tag && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            color: C.blue, background: C.blueBg,
            padding: "3px 8px", borderRadius: 4,
            fontFamily: "var(--font-jetbrains)",
          }}>{tag}</span>
        )}
      </div>
      <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, marginBottom: 8, color: C.textPrimary }}>{title}</h3>
      <p style={{ fontSize: 14, color: C.textSecond, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ── Pricing card ──────────────────────────────────────────────
function PricingCard({
  name, price, desc, features, cta, highlight,
}: {
  name: string; price: string; desc: string;
  features: string[]; cta: string; highlight?: boolean;
}) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${highlight ? C.blue + "55" : C.border}`,
      borderRadius: 12, padding: "32px 28px",
      position: "relative",
      boxShadow: highlight ? "0 8px 32px rgba(37,99,235,0.12)" : "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      {highlight && (
        <div style={{
          position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
          background: C.blue, color: "#fff",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
          padding: "4px 16px", borderRadius: "0 0 6px 6px",
          fontFamily: "var(--font-jetbrains)",
        }}>PLUS POPULAIRE</div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 6, fontFamily: "var(--font-jetbrains)" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 36, color: C.textPrimary }}>{price}</span>
          {price !== "Sur devis" && <span style={{ color: C.textMuted, fontSize: 14 }}>/mois HT</span>}
        </div>
        <p style={{ fontSize: 13, color: C.textSecond, marginTop: 8 }}>{desc}</p>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginBottom: 24 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" stroke={C.blue} strokeWidth="1.2" />
              <path d="M5 8L7 10L11 6" stroke={C.blue} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 13, color: C.textSecond, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      <button style={{
        width: "100%", padding: "14px",
        background: highlight ? C.blue : "transparent",
        color: highlight ? "#fff" : C.blue,
        border: `1.5px solid ${C.blue}`,
        borderRadius: 8,
        fontFamily: "var(--font-dm-sans)", fontWeight: 600, fontSize: 14,
        cursor: "pointer", transition: "all 0.2s",
      }}
        onMouseEnter={e => {
          if (!highlight) { e.currentTarget.style.background = C.blueBg; }
          else { e.currentTarget.style.background = C.blueDim; }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = highlight ? C.blue : "transparent";
        }}
      >{cta}</button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <Nav />

      {/* Subtle grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${C.blue}08 1px, transparent 1px),
          linear-gradient(90deg, ${C.blue}08 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      {/* Blue glow */}
      <div style={{
        position: "fixed", top: -300, left: "20%",
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.blue}09 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── HERO ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "160px 80px 100px",
        display: "flex", alignItems: "center",
        gap: 80, maxWidth: 1200, margin: "0 auto",
      }}>
        <div style={{ flex: 1 }}>
          <div className="fade-up fade-up-1" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.blueBg, border: `1px solid ${C.blue}33`,
            borderRadius: 4, padding: "6px 14px", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue }} />
            <span style={{ fontSize: 12, color: C.blue, letterSpacing: "0.08em", fontFamily: "var(--font-jetbrains)" }}>
              Cybersécurité PME — France &amp; Europe
            </span>
          </div>

          <h1 className="fade-up fade-up-2" style={{
            fontFamily: "var(--font-syne)", fontWeight: 800,
            fontSize: 52, lineHeight: 1.08,
            marginBottom: 24, letterSpacing: "-0.02em",
            color: C.textPrimary,
          }}>
            Ce qu&apos;un attaquant<br />
            voit de votre cabinet<br />
            <span style={{ color: C.blue }}>en 45 minutes.</span>
          </h1>

          <p className="fade-up fade-up-3" style={{
            fontSize: 17, color: C.textSecond,
            lineHeight: 1.7, maxWidth: 480, marginBottom: 36,
          }}>
            Synta analyse votre exposition numérique depuis les sources publiques.
            Rapport gratuit, automatique, actionnable — en quelques secondes.
          </p>

          <div className="fade-up fade-up-4">
            <DomainInput />
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 12 }}>
              Analyse 100% passive et légale · Aucun accès à vos systèmes · RGPD compliant
            </p>
          </div>
        </div>

        <div className="fade-up fade-up-3" style={{ flexShrink: 0 }}>
          <MockReport />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        position: "relative", zIndex: 1,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "48px 80px",
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        background: C.bgCard,
      }}>
        <StatBadge value="90%"  label="cyberattaques ciblent les PME" />
        <div style={{ width: 1, height: 48, background: C.border }} />
        <StatBadge value="49€"  label="pour une protection complète / mois" />
        <div style={{ width: 1, height: 48, background: C.border }} />
        <StatBadge value="47s"  label="pour générer votre rapport" />
        <div style={{ width: 1, height: 48, background: C.border }} />
        <StatBadge value="NIS2" label="conformité incluse dans nos offres" />
      </section>

      {/* ── FEATURES ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 12, color: C.blue, letterSpacing: "0.1em", fontFamily: "var(--font-jetbrains)" }}>
            CE QUE SYNTA FAIT POUR VOUS
          </span>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 36, marginTop: 12, letterSpacing: "-0.02em", color: C.textPrimary }}>
            Protection complète,<br />zéro complexité.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          <FeatureCard icon="🔍" tag="GRATUIT" title="Rapport d'Exposition OSINT"
            desc="Analyse complète de votre surface d'attaque depuis des sources publiques. Score, failles, recommandations — livré en moins d'une minute." />
          <FeatureCard icon="📊" title="Dashboard de surveillance"
            desc="Tableau de bord mis à jour automatiquement. Alertes en temps réel si de nouvelles données compromises apparaissent." />
          <FeatureCard icon="🎯" title="Phishing simulé"
            desc="Envoyez de faux emails de phishing à vos équipes. Mesurez qui clique, formez en continu, réduisez le risque humain." />
          <FeatureCard icon="🎓" title="Formation gamifiée"
            desc="Modules e-learning de 10 minutes, quiz hebdomadaires, scores et classements. La sécurité devient un jeu d'équipe." />
          <FeatureCard icon="⚡" title="Alertes automatiques"
            desc="Vos données refont surface dans un leak ? Votre SSL expire ? Nous vous alertons immédiatement, automatiquement." />
          <FeatureCard icon="📋" title="Conformité NIS2"
            desc="La directive européenne NIS2 s'applique à de nombreuses PME. Synta vous accompagne dans vos obligations réglementaires." />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "80px",
        background: C.bgCard,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, color: C.blue, letterSpacing: "0.1em", fontFamily: "var(--font-jetbrains)" }}>
              COMMENT ÇA MARCHE
            </span>
            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 36, marginTop: 12, letterSpacing: "-0.02em", color: C.textPrimary }}>
              De zéro à protégé en 3 étapes.
            </h2>
          </div>

          <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
            {[
              { step: "01", title: "Entrez votre domaine",    desc: "Saisissez simplement votre nom de domaine. Aucune installation, aucun accès à vos systèmes requis." },
              { step: "02", title: "Recevez votre rapport",   desc: "En moins d'une minute, votre Rapport d'Exposition Numérique est généré et envoyé à votre email." },
              { step: "03", title: "Choisissez votre protection", desc: "Activez la surveillance continue et la formation de vos équipes. Dès 49€/mois, sans engagement." },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, padding: "36px",
                borderRight: i < 2 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{
                  fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 56,
                  color: C.blue + "18", lineHeight: 1,
                  marginBottom: 20, letterSpacing: "-0.03em",
                }}>{item.step}</div>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, marginBottom: 12, color: C.textPrimary }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: C.textSecond, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 12, color: C.blue, letterSpacing: "0.1em", fontFamily: "var(--font-jetbrains)" }}>
            TARIFS
          </span>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 36, marginTop: 12, letterSpacing: "-0.02em", color: C.textPrimary }}>
            Protection professionnelle,<br />prix TPE/PME.
          </h2>
          <p style={{ fontSize: 15, color: C.textSecond, marginTop: 16 }}>
            Sans engagement · Résiliable à tout moment · Facturation mensuelle
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          <PricingCard name="STARTER" price="49€"
            desc="Pour les cabinets de 1 à 5 personnes."
            features={[
              "Surveillance mensuelle de votre exposition",
              "Alertes en temps réel (nouveaux leaks)",
              "Rapport mensuel mis à jour",
              "1 simulation phishing / trimestre",
              "Modules e-learning (5 utilisateurs)",
              "Support email — réponse 48h",
            ]}
            cta="Démarrer — 1er mois gratuit"
          />
          <PricingCard name="ESSENTIEL" price="99€" highlight
            desc="Pour les cabinets de 5 à 20 personnes."
            features={[
              "Tout Starter inclus",
              "Jusqu'à 15 utilisateurs",
              "1 simulation phishing / mois",
              "Dashboard collaborateurs temps réel",
              "Configuration DMARC/SPF/DKIM offerte",
              "Support prioritaire — réponse 24h",
            ]}
            cta="Démarrer — 1er mois gratuit"
          />
          <PricingCard name="PREMIUM" price="Sur devis"
            desc="Pour les cabinets de 20+ personnes."
            features={[
              "Tout Essentiel inclus",
              "Utilisateurs illimités",
              "Audit de sécurité complet (pentest)",
              "vCISO externalisé — 4h/mois",
              "Accompagnement conformité NIS2",
              "SLA garanti et support dédié",
            ]}
            cta="Nous contacter"
          />
        </div>
      </section>

      {/* ── LEGAL STRIP ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "40px 80px",
        background: C.bgCard,
        borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "⚖️", text: "Analyses 100% légales — Art. 323-1 Code Pénal respecté" },
            { icon: "🔒", text: "RGPD Compliant — Données non stockées ni revendues" },
            { icon: "🇫🇷", text: "Droit français applicable — Contrats en français" },
            { icon: "🛡️", text: "RC Pro Cyber — Couverture assurance complète" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: C.textSecond }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "100px 80px",
        textAlign: "center",
        maxWidth: 720, margin: "0 auto",
      }}>
        <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 44, marginBottom: 20, letterSpacing: "-0.02em", color: C.textPrimary }}>
          Votre rapport gratuit<br />
          <span style={{ color: C.blue }}>vous attend.</span>
        </h2>
        <p style={{ fontSize: 16, color: C.textSecond, marginBottom: 40, lineHeight: 1.7 }}>
          Entrez votre domaine. Recevez votre score d&apos;exposition.<br />
          Décidez ensuite — sans pression, sans engagement.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DomainInput />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: `1px solid ${C.border}`,
        padding: "36px 80px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: C.bgCard,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldIcon size={18} color={C.textMuted} />
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: C.textMuted }}>SYNTA</span>
        </div>
        <div style={{ fontSize: 13, color: C.textMuted }}>
          © 2025 Synta LLC — Delaware, USA | Paris, France
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Mentions légales", "RGPD", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.textMuted, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.textSecond)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
