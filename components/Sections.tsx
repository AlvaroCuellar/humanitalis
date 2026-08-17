import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Dictionary } from "@/content/dictionaries";
import { siteConfig, type Lang } from "@/lib/config";

function SectionHeading({ eyebrow, title, intro, inverse = false }: { eyebrow: string; title: string; intro?: string; inverse?: boolean }) {
  return <div className={`section-heading ${inverse ? "inverse" : ""}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{intro && <p>{intro}</p>}</div>;
}

export function Capabilities({ dictionary: d }: { dictionary: Dictionary }) {
  return (
    <section id="capabilities" className="section capabilities section-anchor">
      <div className="container">
        <SectionHeading eyebrow={d.capabilities.eyebrow} title={d.capabilities.title} intro={d.capabilities.intro} />
        <div className="capability-grid">
          {d.capabilities.items.map(([number, title, body]) => (
            <article className="capability-card" key={number}>
              <span className="card-number">{number}</span><div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Methodology({ dictionary: d }: { dictionary: Dictionary }) {
  return (
    <section id="methodology" className="section methodology section-anchor">
      <div className="container">
        <div className="method-head">
          <SectionHeading eyebrow={d.methodology.eyebrow} title={d.methodology.title} inverse />
          <p>{d.methodology.body}</p>
        </div>
        <ol className="method-steps">
          {d.methodology.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < d.methodology.steps.length - 1 && <i className="icon-arrow-flow" aria-hidden="true" />}</li>)}
        </ol>
        <ul className="method-values">{d.methodology.values.map((value) => <li key={value}>{value}</li>)}</ul>
      </div>
    </section>
  );
}

function ViewerMockup({ label }: { label: string }) {
  return (
    <div className="viewer-frame" role="img" aria-label={label}>
      <div className="viewer-bar"><i /><i /><i /><span>HUMANITALIS / VIEWER</span></div>
      <div className="viewer-body">
        <div className="viewer-tools"><b>H</b><span className="viewer-tool-coordinates" /><span className="viewer-tool-layout" /><span className="viewer-tool-search" /></div>
        <div className="viewer-document">
          <div className="folio"><small>Ms. · Fol. 07r</small><p>Jornada primera</p><em>Sale el Rey y su criado</em><span>En el silencio profundo<br />de la noche que declina,<br />una voz antigua nombra<br />lo que la memoria olvida.</span></div>
          <div className="viewer-coordinates"><i style={{ left: "8%", top: "19%", width: "84%", height: "14%" }} /><i style={{ left: "8%", top: "40%", width: "84%", height: "42%" }} /></div>
        </div>
        <div className="viewer-text"><small>STRUCTURED TEXT · 98%</small><h4>Jornada primera</h4><p><mark>Sale el Rey y su criado</mark></p><p>En el silencio profundo<br />de la noche que declina,<br />una voz antigua nombra<br />lo que la memoria olvida.</p><div className="xml-tags"><span>&lt;div&gt;</span><span>&lt;sp&gt;</span><span>&lt;l&gt;</span></div></div>
      </div>
    </div>
  );
}

export function FeaturedProject({ dictionary: d }: { dictionary: Dictionary }) {
  return (
    <section id="project" className="section project section-anchor">
      <div className="container project-grid">
        <div className="project-copy">
          <SectionHeading eyebrow={d.project.eyebrow} title={d.project.title} />
          <p className="project-lead">{d.project.body}</p>
          <ul className="feature-list">{d.project.features.map((feature) => <li key={feature}><span className="icon-plus" aria-hidden="true" />{feature}</li>)}</ul>
          <a className="button" href={siteConfig.demoUrl} target="_blank" rel="noreferrer">{d.project.action}<span className="icon-arrow-external" aria-hidden="true" /></a>
          <p className="project-note">{d.project.note}</p>
        </div>
        <ViewerMockup label={d.project.preview} />
      </div>
    </section>
  );
}

export function About({ dictionary: d }: { dictionary: Dictionary }) {
  return (
    <section id="about" className="section about section-anchor">
      <div className="container about-grid">
        <div className="about-mark" aria-hidden="true"><Logo variant="mark" /><span>H</span></div>
        <div className="about-copy"><SectionHeading eyebrow={d.about.eyebrow} title={d.about.title} /><p className="about-lead">{d.about.body}</p><div className="founder-note"><i /><p>{d.about.founder}<br /><a className="text-link" href={siteConfig.founderUrl} target="_blank" rel="noreferrer">{d.about.action}<span className="icon-arrow-external" aria-hidden="true" /></a></p></div></div>
      </div>
    </section>
  );
}

export function Team({ dictionary: d }: { dictionary: Dictionary }) {
  return (
    <section id="team" className="section team section-anchor">
      <div className="container team-grid">
        <div className="team-intro">
          <SectionHeading eyebrow={d.team.eyebrow} title={d.team.title} />
          <p>{d.team.intro}</p>
        </div>
        <article className="team-profile">
          <div className="team-monogram" aria-hidden="true"><span>AC</span><i /><i /></div>
          <div className="team-profile-copy">
            <span className="team-status">{d.team.status} · 01</span>
            <h3>{d.team.name}</h3>
            <p className="team-role">{d.team.role}</p>
            <p>{d.team.bio}</p>
            <a className="text-link" href={siteConfig.founderUrl} target="_blank" rel="noreferrer">{d.team.action}<span className="icon-arrow-external" aria-hidden="true" /></a>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Principles({ dictionary: d }: { dictionary: Dictionary }) {
  return (
    <section className="section principles">
      <div className="container"><SectionHeading eyebrow={d.principles.eyebrow} title={d.principles.title} />
        <div className="principles-grid">{d.principles.items.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </div>
    </section>
  );
}

export function ContactCTA({ lang, dictionary: d }: { lang: Lang; dictionary: Dictionary }) {
  return (
    <section id="contact" className="contact section-anchor">
      <div className="container contact-inner"><div><p className="eyebrow">{d.contact.eyebrow}</p><h2>{d.contact.title}</h2></div><div><p>{d.contact.body}</p><Link className="button button-light" href={`/${lang}/contact`}>{d.contact.action}<span className="icon-arrow-external" aria-hidden="true" /></Link></div></div>
    </section>
  );
}
