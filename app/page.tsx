"use client";

import { useState, useEffect } from "react";

// ── Design tokens — inspired by Dipa Inhouse ─────────────────
const C = {
  bg:          "#F5F8FF",   // very light blue tint
  bgWhite:     "#FFFFFF",
  bgSection:   "#EEF4FF",   // slightly deeper tint for alt sections
  blue:        "#1F6FEB",   // vibrant Dipa-style blue
  blueDark:    "#1558C0",
  blueLight:   "#EEF4FF",
  navy:        "#0D1B3E",   // almost black for headings
  text:        "#4A5568",   // body text
  muted:       "#9AA3B2",   // labels, hints
  border:      "#E8EEFA",
  danger:      "#E53E3E",
  dangerBg:    "#FFF5F5",
  warning:     "#D97706",
  warningBg:   "#FFFBEB",
  success:     "#38A169",
  successBg:   "#F0FFF4",
};

const F = "var(--font-manrope), Manrope, sans-serif";
const MONO = "var(--font-jetbrains), monospace";

// ── Helpers ───────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: F, fontSize: 12, fontWeight: 600,
      letterSpacing: "0.12em", textTransform: "uppercase",
      color: C.blue, marginBottom: 16,
    }}>{children}</p>
  );
}

function PillButton({
  children, variant = "primary", onClick, disabled, style,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  const base: React.CSSProperties = {
    fontFamily: F, fontWeight: 700, fontSize: 15,
    borderRadius: 50, padding: "14px 32px",
    cursor: disabled ? "wait" : "pointer",
    transition: "all 0.2s ease",
    border: "none", display: "inline-flex", alignItems: "center", gap: 8,
    ...style,
  };
  if (variant === "primary") return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...base,
        background: disabled ? "#93C5FD" : hov ? C.blueDark : C.blue,
        color: "#fff",
        boxShadow: hov ? "0 8px 24px rgba(31,111,235,0.3)" : "0 4px 12px rgba(31,111,235,0.2)",
        transform: hov ? "translateY(-1px)" : "none",
      }}
    >{children}</button>
  );
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...base,
        background: hov ? C.blueLight : "transparent",
        color: C.blue,
        border: `1.5px solid ${hov ? C.blue : C.border}`,
      }}
    >{children}</button>
  );
}

// ── Shield icon ───────────────────────────────────────────────
function ShieldIcon({ size = 24, color = C.blue }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6V12C4 16.418 7.582 20 12 22C16.418 20 20 16.418 20 12V6L12 2Z"
        stroke={color} strokeWidth="1.8" fill={color + "18"} />
      <path d="M9 12L11 14L15 10"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Nav ───────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 68,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      maxWidth: "100%", padding: "0 40px",
      background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ShieldIcon size={28} color={C.blue} />
        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: C.navy, letterSpacing: "-0.02em" }}>
          Synta
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {["Solution", "Tarifs", "Ressources"].map(item => (
          <a key={item} href="#" style={{
            fontFamily: F, fontWeight: 500, fontSize: 14,
            color: C.text, textDecoration: "none", transition: "color 0.2s",
            whiteSpace: "nowrap",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = C.navy)}
            onMouseLeave={e => (e.currentTarget.style.color = C.text)}
          >{item}</a>
        ))}
        <PillButton style={{ padding: "10px 20px", fontSize: 13, whiteSpace: "nowrap" }}>
          Analyser mon domaine
        </PillButton>
      </div>
    </nav>
  );
}

// ── Score ring ────────────────────────────────────────────────
function ScoreRing({ score = 7 }: { score?: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const pct = (score / 10) * circumference;
  const color = score >= 7 ? C.danger : score >= 5 ? C.warning : C.success;
  const label = score >= 7 ? "ÉLEVÉ" : score >= 5 ? "MODÉRÉ" : "FAIBLE";
  return (
    <div style={{ position: "relative", width: 112, height: 112, flexShrink: 0 }}>
      <svg width="112" height="112" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="56" cy="56" r={radius} fill="none" stroke={C.border} strokeWidth="6" />
        <circle cx="56" cy="56" r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${pct} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: MONO, fontSize: 8, color, letterSpacing: "0.08em", marginTop: 2 }}>{label}</span>
      </div>
    </div>
  );
}

// ── Mock report card ──────────────────────────────────────────
function MockReport() {
  const rows = [
    { label: "Emails compromis",      value: "3 détectés",        s: "danger"  as const },
    { label: "DMARC / SPF / DKIM",    value: "Non configuré",     s: "danger"  as const },
    { label: "Sous-domaines exposés", value: "1 trouvé",          s: "warning" as const },
    { label: "Version CMS",           value: "5.8 — à jour",      s: "warning" as const },
    { label: "Certificat SSL",        value: "Valide — 89 jours", s: "success" as const },
  ];
  const col = { danger: C.danger, warning: C.warning, success: C.success };
  const bg  = { danger: C.dangerBg, warning: C.warningBg, success: C.successBg };

  return (
    <div style={{
      background: C.bgWhite,
      borderRadius: 20,
      border: `1px solid ${C.border}`,
      boxShadow: "0 24px 64px rgba(31,111,235,0.10), 0 4px 16px rgba(0,0,0,0.05)",
      padding: "28px 24px",
      width: 340,
      flexShrink: 0,
      animation: "float 4s ease-in-out infinite",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: 9, color: C.muted, letterSpacing: "0.1em", marginBottom: 4 }}>
            RAPPORT D&apos;EXPOSITION
          </p>
          <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: C.navy }}>
            cabinet-exemple.fr
          </p>
        </div>
        <ScoreRing score={7} />
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 12px", borderRadius: 8,
            background: bg[r.s] + "88",
          }}>
            <span style={{ fontSize: 12, color: C.text, fontFamily: F }}>{r.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: col[r.s], fontFamily: MONO }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 14, padding: "10px 14px",
        background: C.blueLight, borderRadius: 8,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.blue, fontFamily: F }}>Rapport complet disponible</span>
        <span style={{ fontSize: 11, color: C.muted, fontFamily: MONO }}>47s</span>
      </div>
    </div>
  );
}

// ── Domain input ──────────────────────────────────────────────
function DomainInput({ centered = false }: { centered?: boolean }) {
  const [domain,  setDomain]  = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const submit = () => {
    if (!domain.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  if (done) return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "16px 24px", borderRadius: 50,
      background: C.successBg, border: `1px solid ${C.success}44`,
      maxWidth: 480, ...(centered ? { margin: "0 auto" } : {}),
    }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke={C.success} strokeWidth="1.5" />
        <path d="M5.5 9L7.5 11L12.5 7" stroke={C.success} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ color: C.success, fontSize: 14, fontWeight: 600, fontFamily: F }}>
        Analyse lancée — rapport envoyé sous quelques minutes.
      </span>
    </div>
  );

  return (
    <div>
      <div style={{
        display: "flex", gap: 8, maxWidth: 520,
        ...(centered ? { margin: "0 auto" } : {}),
      }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          background: C.bgWhite,
          border: `1.5px solid ${C.border}`,
          borderRadius: 50, padding: "6px 6px 6px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>https://</span>
          <input
            type="text"
            placeholder="votre-cabinet.fr"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{
              flex: 1, border: "none", outline: "none",
              fontFamily: F, fontSize: 15, fontWeight: 500,
              color: C.navy, background: "transparent",
              padding: "8px 0",
            }}
          />
        </div>
        <PillButton onClick={submit} disabled={loading} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
          {loading ? "Analyse…" : "Obtenir mon rapport"}
        </PillButton>
      </div>
      <p style={{
        fontSize: 12, color: C.muted, marginTop: 10, fontFamily: F,
        ...(centered ? { textAlign: "center" } : {}),
      }}>
        Analyse 100% passive · Aucun accès à vos systèmes · RGPD compliant
      </p>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────
function FeatureCard({ icon, title, desc, tag }: { icon: string; title: string; desc: string; tag?: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.bgWhite,
        border: `1.5px solid ${hov ? C.blue + "55" : C.border}`,
        borderRadius: 16, padding: "28px 24px",
        boxShadow: hov ? "0 12px 32px rgba(31,111,235,0.10)" : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 0.25s ease",
        transform: hov ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: C.blueLight,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>{icon}</div>
        {tag && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            color: C.blue, background: C.blueLight,
            padding: "4px 10px", borderRadius: 50,
            fontFamily: MONO,
          }}>{tag}</span>
        )}
      </div>
      <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 16, marginBottom: 8, color: C.navy }}>{title}</h3>
      <p style={{ fontFamily: F, fontSize: 14, color: C.text, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

// ── Pricing card ──────────────────────────────────────────────
function PricingCard({ name, price, desc, features, cta, highlight }: {
  name: string; price: string; desc: string;
  features: string[]; cta: string; highlight?: boolean;
}) {
  return (
    <div style={{
      background: highlight ? C.navy : C.bgWhite,
      border: `1.5px solid ${highlight ? C.navy : C.border}`,
      borderRadius: 20, padding: "36px 28px",
      position: "relative",
      boxShadow: highlight ? "0 20px 48px rgba(13,27,62,0.20)" : "0 2px 8px rgba(0,0,0,0.05)",
      transform: highlight ? "scale(1.02)" : "none",
    }}>
      {highlight && (
        <div style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          background: C.blue, color: "#fff",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
          padding: "5px 18px", borderRadius: 50,
          fontFamily: MONO, whiteSpace: "nowrap",
        }}>PLUS POPULAIRE</div>
      )}

      <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", color: highlight ? C.muted : C.muted, marginBottom: 8 }}>{name}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 40, color: highlight ? "#fff" : C.navy, lineHeight: 1 }}>{price}</span>
        {price !== "Sur devis" && (
          <span style={{ fontFamily: F, fontSize: 14, color: highlight ? C.muted : C.muted }}>/mois HT</span>
        )}
      </div>
      <p style={{ fontFamily: F, fontSize: 13, color: highlight ? "#94A3B8" : C.text, marginBottom: 24 }}>{desc}</p>

      <div style={{ borderTop: `1px solid ${highlight ? "#ffffff18" : C.border}`, paddingTop: 20, marginBottom: 28 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
              background: highlight ? C.blue : C.blueLight,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4 7L8 3" stroke={highlight ? "#fff" : C.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontFamily: F, fontSize: 13, color: highlight ? "#CBD5E1" : C.text, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>

      <PillButton
        variant={highlight ? "primary" : "ghost"}
        style={{ width: "100%", justifyContent: "center", fontSize: 14 }}
      >{cta}</PillButton>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: F }}>
      <Nav />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 130, paddingBottom: 80, paddingLeft: 60, paddingRight: 60, maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>

          {/* Left */}
          <div style={{ flex: "1 1 460px", minWidth: 0 }}>
            <div className="fade-up fade-up-1" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.blueLight, borderRadius: 50,
              padding: "6px 16px", marginBottom: 28,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.blue }} />
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.blue, letterSpacing: "0.08em" }}>
                Cybersécurité PME — France &amp; Europe
              </span>
            </div>

            <h1 className="fade-up fade-up-2" style={{
              fontFamily: F, fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 58px)",
              lineHeight: 1.08, letterSpacing: "-0.03em",
              color: C.navy, marginBottom: 20,
            }}>
              Ce qu&apos;un attaquant<br />
              voit de votre cabinet<br />
              <span style={{ color: C.blue }}>en 45 minutes.</span>
            </h1>

            <p className="fade-up fade-up-3" style={{
              fontFamily: F, fontSize: 17, fontWeight: 400,
              color: C.text, lineHeight: 1.7,
              maxWidth: 460, marginBottom: 36,
            }}>
              Synta analyse votre exposition numérique depuis les sources publiques.
              Rapport gratuit, automatique, actionnable — en quelques secondes.
            </p>

            <div className="fade-up fade-up-4">
              <DomainInput />

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 28 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={C.warning}>
                      <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10l-3.6 1.9.7-4L2.2 5.2l4-.6z"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontFamily: F, fontSize: 13, color: C.muted }}>
                  Utilisé par +200 PME françaises
                </span>
              </div>
            </div>
          </div>

          {/* Right — mock card */}
          <div className="fade-up fade-up-3" style={{ flex: "0 0 auto" }}>
            <MockReport />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: C.bgWhite, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "48px 60px",
          display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 32,
        }}>
          {[
            { value: "90%",  label: "des cyberattaques ciblent les PME",   source: "Cybermalveillance.gouv.fr, 2024" },
            { value: "49€",  label: "protection complète / mois",           source: null },
            { value: "47s",  label: "pour générer votre rapport",           source: null },
            { value: "NIS2", label: "conformité incluse",                   source: null },
          ].map(({ value, label, source }) => (
            <div key={value} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 36, color: C.blue, lineHeight: 1, marginBottom: 6 }}>{value}</div>
              <div style={{ fontFamily: F, fontSize: 13, color: C.text }}>{label}</div>
              {source && (
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 4, letterSpacing: "0.04em" }}>
                  Source : {source}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "100px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>Ce que Synta fait pour vous</SectionLabel>
          <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.025em", color: C.navy }}>
            Protection complète,<br />zéro complexité.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <FeatureCard icon="🔍" tag="GRATUIT" title="Rapport d'Exposition OSINT"
            desc="Analyse complète de votre surface d'attaque depuis des sources publiques. Score, failles, recommandations en moins d'une minute." />
          <FeatureCard icon="📊" title="Dashboard de surveillance"
            desc="Tableau de bord mis à jour automatiquement. Alertes en temps réel si de nouvelles données compromises apparaissent." />
          <FeatureCard icon="🎯" title="Phishing simulé"
            desc="Faux emails de phishing à vos équipes. Mesurez qui clique, formez en continu, réduisez le risque humain." />
          <FeatureCard icon="🎓" title="Formation gamifiée"
            desc="Modules e-learning de 10 minutes, quiz hebdomadaires, scores et classements. La sécurité devient un jeu d'équipe." />
          <FeatureCard icon="⚡" title="Alertes automatiques"
            desc="Vos données refont surface dans un leak ? Votre SSL expire ? Vous êtes alerté immédiatement, automatiquement." />
          <FeatureCard icon="📋" title="Conformité NIS2"
            desc="La directive NIS2 s'applique à de nombreuses PME. Synta vous accompagne dans vos obligations réglementaires." />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: C.bgSection, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "100px 60px" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel>Comment ça marche</SectionLabel>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.025em", color: C.navy }}>
              De zéro à protégé en 3 étapes.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { step: "01", title: "Entrez votre domaine",       desc: "Saisissez votre nom de domaine. Aucune installation, aucun accès à vos systèmes." },
              { step: "02", title: "Recevez votre rapport",      desc: "En moins d'une minute, votre Rapport d'Exposition est généré et envoyé par email." },
              { step: "03", title: "Choisissez votre protection",desc: "Activez la surveillance continue et la formation. Dès 49€/mois, sans engagement." },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "40px 36px",
                borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                background: "transparent",
              }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 64, color: C.blue + "20", lineHeight: 1, marginBottom: 20 }}>{item.step}</div>
                <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: C.navy, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: C.text, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "100px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>Tarifs</SectionLabel>
          <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.025em", color: C.navy }}>
            Protection professionnelle,<br />prix TPE/PME.
          </h2>
          <p style={{ fontFamily: F, fontSize: 15, color: C.text, marginTop: 14 }}>
            Sans engagement · Résiliable à tout moment · Facturation mensuelle
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "center" }}>
          <PricingCard name="STARTER" price="49€"
            desc="Pour les cabinets de 1 à 5 personnes."
            features={["Surveillance mensuelle exposition","Alertes temps réel (nouveaux leaks)","Rapport mensuel mis à jour","1 simulation phishing / trimestre","Modules e-learning (5 utilisateurs)","Support email — réponse 48h"]}
            cta="Démarrer — 1er mois gratuit" />
          <PricingCard name="ESSENTIEL" price="99€" highlight
            desc="Pour les cabinets de 5 à 20 personnes."
            features={["Tout Starter inclus","Jusqu'à 15 utilisateurs","1 simulation phishing / mois","Dashboard collaborateurs temps réel","Config DMARC/SPF/DKIM offerte","Support prioritaire — réponse 24h"]}
            cta="Démarrer — 1er mois gratuit" />
          <PricingCard name="PREMIUM" price="Sur devis"
            desc="Pour les cabinets de 20+ personnes."
            features={["Tout Essentiel inclus","Utilisateurs illimités","Audit de sécurité (pentest)","vCISO externalisé — 4h/mois","Accompagnement conformité NIS2","SLA garanti et support dédié"]}
            cta="Nous contacter" />
        </div>
      </section>

      {/* ── LEGAL ── */}
      <section style={{ background: C.bgWhite, borderTop: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", padding: "40px 60px",
          display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap",
        }}>
          {[
            { icon: "⚖️", text: "Analyses 100% légales — Art. 323-1 Code Pénal" },
            { icon: "🔒", text: "RGPD Compliant — Données non stockées" },
            { icon: "🇫🇷", text: "Droit français applicable" },
            { icon: "🛡️", text: "RC Pro Cyber — Couverture complète" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontFamily: F, fontSize: 13, color: C.text }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "100px 60px", textAlign: "center" }}>
        <SectionLabel>Commencer maintenant</SectionLabel>
        <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.03em", color: C.navy, marginBottom: 20 }}>
          Votre rapport gratuit<br />
          <span style={{ color: C.blue }}>vous attend.</span>
        </h2>
        <p style={{ fontFamily: F, fontSize: 16, color: C.text, marginBottom: 40, lineHeight: 1.7 }}>
          Entrez votre domaine. Recevez votre score d&apos;exposition.<br />
          Décidez ensuite — sans pression, sans engagement.
        </p>
        <DomainInput centered />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: C.bgWhite, borderTop: `1px solid ${C.border}`,
        padding: "32px 60px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldIcon size={18} color={C.muted} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: C.muted }}>Synta</span>
        </div>
        <span style={{ fontFamily: F, fontSize: 13, color: C.muted }}>© 2025 Synta SAS — Paris, France</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Mentions légales", "RGPD", "Contact"].map(l => (
            <a key={l} href="#" style={{ fontFamily: F, fontSize: 13, color: C.muted, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.navy)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
