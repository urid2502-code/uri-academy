import type { Course } from '../content/courses';
import type { Module } from '../types';

function artwork(body: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="640" viewBox="0 0 1000 640"><defs><radialGradient id="ground"><stop stop-color="#173d52"/><stop offset="1" stop-color="#07111b"/></radialGradient><linearGradient id="ice" x2="1" y2="1"><stop stop-color="#d8fbff"/><stop offset=".45" stop-color="#75d9ef"/><stop offset="1" stop-color="#246ba0"/></linearGradient></defs><rect width="1000" height="640" fill="url(#ground)"/>${body}</svg>`)}`;
}

const circuits = artwork(`
  <g fill="none" stroke="url(#ice)" stroke-linecap="round">
    ${Array.from({ length: 14 }, (_, i) => {
      const x = 70 + i * 66;
      const y = 110 + (i % 4) * 70;
      return `<path d="M${x} -20 V${y} q0 20 20 20 h22 q20 0 20 20 v${430 - y} q0 18 -18 18 h-28" stroke-width="${i % 3 === 0 ? 5 : 2}" opacity="${0.35 + (i % 3) * 0.25}"/><circle cx="${x + 16}" cy="588" r="6" stroke-width="2"/><circle cx="${x}" cy="${y - 35}" r="5" fill="#b5f3ff"/>`;
    }).join('')}
  </g><rect x="356" y="215" width="288" height="192" rx="26" fill="#0b1c29" stroke="#7ee0f1" stroke-width="2"/>
  <rect x="376" y="235" width="248" height="152" rx="16" fill="#102c3c" stroke="#34718e"/>
  <path d="m457 285-28 27 28 27m86-54 28 27-28 27m-26-74-28 97" fill="none" stroke="#baf4ff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
`);

const intelligence = artwork(`
  <g fill="none" stroke="url(#ice)" stroke-width="1.5">
    ${Array.from({ length: 24 }, (_, i) => {
      const y = 104 + i * 18;
      const inset = Math.abs(i - 11.5) * 12;
      return `<path d="M${155 + inset} ${y} C350 ${y - 110} 650 ${y + 125} ${845 - inset} ${y}" opacity="${0.35 + i / 55}"/>`;
    }).join('')}
    ${Array.from({ length: 17 }, (_, i) => `<ellipse cx="500" cy="320" rx="${32 + i * 14}" ry="232" transform="rotate(${i * 3 - 24} 500 320)" opacity=".36"/>`).join('')}
  </g>
  <g fill="#c0f6ff">${Array.from({ length: 40 }, (_, i) => {
    const a = i * 2.4;
    const r = 65 + Math.sqrt(i) * 29;
    return `<circle cx="${500 + Math.cos(a) * r}" cy="${320 + Math.sin(a) * r * 0.8}" r="${i % 5 === 0 ? 4 : 2}" opacity="${0.4 + (i % 4) * 0.18}"/>`;
  }).join('')}</g>
`);

const architecture = artwork(`
  <g transform="translate(500 300)" fill="#112d40" stroke="#70bcd9" stroke-width="2">
    <path d="M-330 10 0-160 330 10 0 180Z" fill="#0d2031"/>
    <path d="M-330 65 0-105 330 65 0 235Z" fill="none" opacity=".3"/>
    <path d="M-330 120 0-50 330 120 0 290Z" fill="none" opacity=".15"/>
    <path d="M-210-80v150l90 47V-33Z"/><path d="M-120-33-30-80V70l-90 47Z" fill="#1e5470"/><path d="m-210-80 90-47 90 47-90 47Z" fill="#83d8ed"/>
    <path d="M75-15v110l90 47V32Z"/><path d="m165 32 90-47V95l-90 47Z" fill="#1e5470"/><path d="m75-15 90-47 90 47-90 47Z" fill="#a1e9f4"/>
    <path d="m-90 135 90 45 95-48M0 180v80M0-160v-65" fill="none" stroke="#a2e8fa" stroke-dasharray="5 7"/>
  </g>
`);

const design = artwork(`
  <g transform="rotate(-7 500 320)">
    <rect x="145" y="95" width="710" height="450" rx="24" fill="#c5d8df"/>
    <rect x="161" y="111" width="678" height="418" rx="12" fill="#e7edf0"/>
    <rect x="186" y="138" width="130" height="365" rx="8" fill="#b5c9d2"/>
    <g fill="#7e9fae"><rect x="205" y="163" width="76" height="9" rx="4"/><rect x="205" y="194" width="90" height="7" rx="3"/><rect x="205" y="220" width="64" height="7" rx="3"/></g>
    <rect x="340" y="138" width="472" height="190" rx="9" fill="#102c3c"/>
    <circle cx="716" cy="230" r="64" fill="none" stroke="#7dd9f0" stroke-width="18"/>
    <rect x="366" y="168" width="160" height="13" rx="5" fill="#e2f5fc"/><rect x="366" y="198" width="210" height="7" rx="3" fill="#709eae"/>
    <rect x="366" y="245" width="95" height="28" rx="7" fill="#8de1f1"/>
    <rect x="340" y="351" width="220" height="152" rx="9" fill="#7c9daa"/><rect x="581" y="351" width="231" height="152" rx="9" fill="#aec6d0"/>
    <path d="M360 473v-40h25v-26h25v35h25v-51h25v-20h25v54h25v-25h25v73Z" fill="#d9eef4"/>
    <circle cx="695" cy="423" r="46" fill="none" stroke="#24485d" stroke-width="17"/><path d="M695 377a46 46 0 0 1 43 62" fill="none" stroke="#f1fbff" stroke-width="17"/>
  </g>
`);

const data = artwork(`
  <g fill="none" stroke="url(#ice)" stroke-width="2">
    ${Array.from({ length: 10 }, (_, i) => `<path d="M100 ${180 + i * 28} C300 ${50 + i * 24} 650 ${590 - i * 28} 920 ${140 + i * 24}" opacity=".4"/>`).join('')}
  </g>
  <g transform="translate(500 175)" stroke="#82ddf1" stroke-width="2">
    <path d="M-150 0v240c0 65 300 65 300 0V0" fill="#102c3f"/>
    <ellipse rx="150" ry="55" fill="#245875"/><ellipse rx="120" ry="38" fill="#153d55"/>
    <path d="M-150 78c0 65 300 65 300 0M-150 156c0 65 300 65 300 0" fill="none"/>
    <g fill="#a7edfb" stroke="none"><circle cx="-105" cy="91" r="5"/><circle cx="-82" cy="99" r="5"/><circle cx="-105" cy="169" r="5"/><circle cx="-82" cy="177" r="5"/><circle cx="-105" cy="247" r="5"/><circle cx="-82" cy="255" r="5"/></g>
  </g>
`);

const visuals = { circuits, intelligence, architecture, design, data };
type VisualName = keyof typeof visuals;

const artByIcon: Record<Course['icon'], VisualName> = {
  layers: 'circuits', brain: 'intelligence', network: 'architecture', shield: 'circuits',
  cloud: 'architecture', smartphone: 'design', binary: 'circuits', database: 'data',
  palette: 'design', bot: 'intelligence', terminal: 'circuits', chart: 'data',
};

const MOTION_BASE =
  '@keyframes flow{to{stroke-dashoffset:-52}}@keyframes pulse{50%{opacity:.25}}@keyframes breathe{50%{opacity:.12}}@keyframes ring{0%,100%{stroke-dashoffset:300}50%{stroke-dashoffset:90}}@media (prefers-reduced-motion:reduce){*{animation:none!important}}';

// Each artwork gets its own loop: current along the traces, breathing meshes, a filling ring.
const MOTION_STYLE: Record<VisualName, string> = {
  circuits: 'g[stroke="url(#ice)"] path{stroke-dasharray:10 16;animation:flow 5s linear infinite}g[stroke="url(#ice)"] circle{animation:pulse 3.6s ease-in-out infinite}',
  intelligence: 'ellipse{animation:breathe 7s ease-in-out infinite}ellipse:nth-child(odd){animation-delay:-3.5s}g[fill] circle{animation:pulse 4s ease-in-out infinite}g[fill] circle:nth-child(3n){animation-delay:-1.3s}g[fill] circle:nth-child(3n+1){animation-delay:-2.6s}',
  architecture: 'path[stroke-dasharray]{animation:flow 3s linear infinite}path[fill="#83d8ed"],path[fill="#a1e9f4"]{animation:pulse 4s ease-in-out infinite}',
  design: 'circle[r="64"]{stroke-dasharray:402;animation:ring 7s ease-in-out infinite}',
  data: 'g[stroke="url(#ice)"] path{stroke-dasharray:8 14;animation:flow 6s linear infinite}circle{animation:pulse 3.2s ease-in-out infinite}',
};

const animatedCache = new Map<VisualName, string>();
function animated(name: VisualName) {
  const cached = animatedCache.get(name);
  if (cached) return cached;
  const url = visuals[name];
  const svg = decodeURIComponent(url.slice(url.indexOf(',') + 1));
  const result = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace('</defs>', `</defs><style>${MOTION_BASE}${MOTION_STYLE[name]}</style>`))}`;
  animatedCache.set(name, result);
  return result;
}

/**
 * Original inline SVG artwork: bundled, resolution independent, and never dependent on a remote image host.
 * Pass `motion` for the looping variant; use it only where a single large image is shown.
 */
export function courseVisual(course: Course, motion = false) {
  const name = artByIcon[course.icon];
  return motion ? animated(name) : visuals[name];
}

const artByModule: Record<Module['icon'], VisualName> = {
  globe: 'architecture', code: 'circuits', terminal: 'circuits', server: 'architecture',
  database: 'data', layout: 'design', radio: 'circuits', workflow: 'architecture',
  bot: 'intelligence', cloud: 'architecture',
};

export function moduleVisual(module: Module, motion = false) {
  const name = artByModule[module.icon];
  return motion ? animated(name) : visuals[name];
}
