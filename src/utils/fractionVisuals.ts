/**
 * Helper to generate inline SVG data URIs for fraction visual aids.
 * Highly accessible, crisp at any resolution, works completely offline without external CDNs.
 */

export function createFractionCircleSvg(numerator: number, denominator: number, color = '#f59e0b'): string {
  const size = 200;
  const radius = 80;
  const center = size / 2;
  
  const slices: string[] = [];
  const anglePerSlice = (2 * Math.PI) / denominator;

  for (let i = 0; i < denominator; i++) {
    const startAngle = i * anglePerSlice - Math.PI / 2;
    const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = anglePerSlice > Math.PI ? 1 : 0;
    const isShaded = i < numerator;
    const fill = isShaded ? color : '#334155';
    const stroke = '#0f172a';

    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    slices.push(`<path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" />`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#0f172a" rx="16" />
    <circle cx="${center}" cy="${center}" r="${radius + 2}" stroke="#64748b" stroke-width="3" fill="none" />
    ${slices.join('')}
    <text x="${center}" y="${size - 14}" text-anchor="middle" fill="#cbd5e1" font-size="14" font-family="sans-serif" font-weight="bold">${numerator}/${denominator} (${numerator} भाग रंगवलेला)</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createFractionBarSvg(numerator: number, denominator: number, color = '#38bdf8'): string {
  const width = 280;
  const height = 90;
  const barWidth = 240;
  const barHeight = 44;
  const startX = (width - barWidth) / 2;
  const startY = 18;
  const partWidth = barWidth / denominator;

  const rects: string[] = [];
  for (let i = 0; i < denominator; i++) {
    const isShaded = i < numerator;
    const fill = isShaded ? color : '#334155';
    const x = startX + i * partWidth;
    rects.push(`<rect x="${x}" y="${startY}" width="${partWidth}" height="${barHeight}" fill="${fill}" stroke="#0f172a" stroke-width="2" />`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#0f172a" rx="12" />
    ${rects.join('')}
    <text x="${width / 2}" y="${height - 10}" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="sans-serif" font-weight="bold">${numerator}/${denominator} पट्टी</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createBalanceScaleSvg(fracA: string, fracB: string, tilt: 'left' | 'right' | 'balanced' = 'balanced'): string {
  const width = 320;
  const height = 180;
  const fulcrumX = 160;
  const fulcrumY = 120;
  
  let leftY = 80;
  let rightY = 80;
  if (tilt === 'left') {
    leftY = 105;
    rightY = 55;
  } else if (tilt === 'right') {
    leftY = 55;
    rightY = 105;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#0f172a" rx="16" />
    <!-- Stand -->
    <polygon points="${fulcrumX - 25},${fulcrumY + 40} ${fulcrumX + 25},${fulcrumY + 40} ${fulcrumX},${fulcrumY}" fill="#64748b" />
    <circle cx="${fulcrumX}" cy="${fulcrumY}" r="8" fill="#f59e0b" />
    <!-- Beam -->
    <line x1="60" y1="${leftY}" x2="260" y2="${rightY}" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round" />
    <!-- Left Pan Strings & Pan -->
    <line x1="60" y1="${leftY}" x2="40" y2="${leftY + 35}" stroke="#94a3b8" stroke-width="2" />
    <line x1="60" y1="${leftY}" x2="80" y2="${leftY + 35}" stroke="#94a3b8" stroke-width="2" />
    <path d="M 30 ${leftY + 35} Q 60 ${leftY + 45} 90 ${leftY + 35} Z" fill="#38bdf8" />
    <text x="60" y="${leftY + 28}" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="bold" font-family="sans-serif">${fracA}</text>
    <!-- Right Pan Strings & Pan -->
    <line x1="260" y1="${rightY}" x2="240" y2="${rightY + 35}" stroke="#94a3b8" stroke-width="2" />
    <line x1="260" y1="${rightY}" x2="280" y2="${rightY + 35}" stroke="#94a3b8" stroke-width="2" />
    <path d="M 230 ${rightY + 35} Q 260 ${rightY + 45} 290 ${rightY + 35} Z" fill="#ec4899" />
    <text x="260" y="${rightY + 28}" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="bold" font-family="sans-serif">${fracB}</text>
    <text x="${fulcrumX}" y="24" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold" font-family="sans-serif">डिजिटल तराजू तुलना (Scale Balance)</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
