export function DocumentProcessVisual({ label }: { label: string }) {
  return (
    <figure className="process-visual" aria-labelledby="process-caption">
      <svg viewBox="0 0 720 670" role="img" aria-label={label}>
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="currentColor" strokeOpacity=".12" /></pattern>
          <filter id="paperShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="20" stdDeviation="24" floodColor="#21080b" floodOpacity=".16" /></filter>
        </defs>
        <rect x="42" y="35" width="636" height="585" rx="2" fill="url(#grid)" className="visual-grid" />
        <path d="M70 108H650M70 552H650" className="hairline" />
        <g filter="url(#paperShadow)">
          <path d="M162 83H494L558 148V548H162Z" className="paper" />
          <path d="M494 83V148H558" className="paper-fold" />
        </g>
        <text x="206" y="143" className="doc-kicker">FOL. 07R · UNIDAD 042</text>
        <g className="manuscript">
          <path d="M208 198c31-24 77 13 112-4s54-2 79 9 64-2 91-15" />
          <path d="M208 232c46-18 67 15 109-3s85 14 170-2" />
          <path d="M208 267c21-10 46 5 65 0s29-13 54-4 32 14 64 2 65 0 91-8" />
          <path d="M208 302c38-16 63 12 101-6s68 2 101 10 48-1 77-9" />
          <path d="M208 369c25-15 61 7 98-5s72 11 105-1 53 6 76-7" />
          <path d="M208 404c48-15 72 9 118-1s97 10 161-6" />
          <path d="M208 439c20-8 37-4 59 3s55-18 89-4 81-11 131-8" />
          <path d="M208 474c43-14 82 9 118-3s91 6 161-4" />
        </g>
        <g className="analysis-boxes">
          <rect x="192" y="175" width="312" height="150" /><rect x="192" y="345" width="312" height="148" />
          <path d="M192 332H504M520 175V493" />
        </g>
        <g className="nodes">
          <circle cx="192" cy="175" r="5" /><circle cx="504" cy="175" r="5" /><circle cx="192" cy="325" r="5" /><circle cx="504" cy="325" r="5" />
          <circle cx="192" cy="345" r="5" /><circle cx="504" cy="345" r="5" /><circle cx="192" cy="493" r="5" /><circle cx="504" cy="493" r="5" />
        </g>
        <g className="axis-labels">
          <text x="92" y="184">IMAGE</text><path d="M131 180H180" />
          <text x="522" y="270">TEXT</text><path d="M516 280H592" />
          <text x="86" y="359">STRUCTURE</text><path d="M150 354H180" />
          <text x="520" y="470">ANALYSIS</text><path d="M516 481H618" />
        </g>
        <g className="corner-data"><text x="82" y="584">x 0182 / y 0345</text><text x="510" y="584">TEI · ALTO · JSON</text></g>
      </svg>
      <figcaption id="process-caption"><span>01</span>{label}</figcaption>
    </figure>
  );
}
