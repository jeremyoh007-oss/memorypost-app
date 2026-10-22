/** Thin-line icons and weather glyphs, copied from the prototype's inline SVGs. */
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { Sky } from '@/services/weather';

type P = { size?: number; color?: string };

export const IconHome = ({ size = 24, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round">
    <Path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z" />
  </Svg>
);
export const IconMail = ({ size = 24, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round">
    <Rect x={3.5} y={6} width={17} height={12.5} rx={2} />
    <Path d="m4 7 8 6 8-6" />
  </Svg>
);
export const IconShirt = ({ size = 24, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round">
    <Path d="M9 4 4 6.8l1.8 4 2.2-1V20h8V9.8l2.2 1 1.8-4L15 4a3 3 0 0 1-6 0Z" />
  </Svg>
);
export const IconPaw = ({ size = 24, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6}>
    <Ellipse cx={12} cy={16} rx={4.6} ry={3.8} />
    <Circle cx={6} cy={10.5} r={1.9} />
    <Circle cx={9.6} cy={6.6} r={1.9} />
    <Circle cx={14.4} cy={6.6} r={1.9} />
    <Circle cx={18} cy={10.5} r={1.9} />
  </Svg>
);

export const IconHand = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8 13.5V7.8a1.6 1.6 0 0 1 3.2 0V12m0-5.6V5.6a1.6 1.6 0 0 1 3.2 0V12m0-5a1.6 1.6 0 0 1 3.2 0v5.5m0-3a1.6 1.6 0 0 1 3.2 0V16a7 7 0 0 1-7 7h-.6a7 7 0 0 1-5.6-2.8L5 17a1.7 1.7 0 0 1 2.6-2.1L8 15.3" />
  </Svg>
);
export const IconHeartLine = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round">
    <Path d="M13 21.5S4 16.4 4 10.2A4.6 4.6 0 0 1 13 8.4a4.6 4.6 0 0 1 9 1.8c0 6.2-9 11.3-9 11.3Z" />
  </Svg>
);
export const IconBowl = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3.5 13h19a9.5 7 0 0 1-19 0Z" />
    <Path d="M9 9.5c0-1.4 1.2-1.8 1.2-3.2M13.5 9.5c0-1.4 1.2-1.8 1.2-3.2" />
  </Svg>
);
export const IconCheckBadge = ({ size = 14, bg = '#D9654B' }: { size?: number; bg?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14">
    <Circle cx={7} cy={7} r={7} fill={bg} />
    <Path d="m4 7.2 2 2 4-4.4" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
export const IconChevron = ({ size = 18, color = '#A39C94' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m7 4 5 5-5 5" />
  </Svg>
);
export const IconChevronDown = ({ size = 12, color = '#77706A' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m3 4.5 3 3 3-3" />
  </Svg>
);
export const IconClose = ({ size = 14, color = '#77706A' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <Path d="m3 3 8 8M11 3l-8 8" />
  </Svg>
);
export const IconTicket = ({ size = 34 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 34 34" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinejoin="round">
    <Path d="M4 11a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6Z" />
    <Path d="M21 9v16" strokeDasharray="2 2.5" />
  </Svg>
);
export const HeartFilled = ({ size = 18, color = '#E8735B' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 18 18">
    <Path d="M9 15.5S2.5 11.7 2.5 7.2A3.2 3.2 0 0 1 9 5.9a3.2 3.2 0 0 1 6.5 1.3C15.5 11.7 9 15.5 9 15.5Z" fill={color} />
  </Svg>
);

/** Gold coin (조개) used for prices and rewards. */
export const Coin = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Defs>
      <RadialGradient id="coin" cx="35%" cy="30%" r="75%">
        <Stop offset="0" stopColor="#FFE9A8" />
        <Stop offset="0.6" stopColor="#E7B33E" />
        <Stop offset="1" stopColor="#C48F22" />
      </RadialGradient>
    </Defs>
    <Circle cx={8} cy={8} r={8} fill="url(#coin)" />
  </Svg>
);

// ---------- weather ----------
const Sun = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22">
    <Circle cx={11} cy={11} r={4.6} fill="#F2B53B" />
    <G stroke="#F2B53B" strokeWidth={1.6} strokeLinecap="round">
      <Path d="M11 2v2.5M11 17.5V20M2 11h2.5M17.5 11H20M4.6 4.6l1.8 1.8M15.6 15.6l1.8 1.8M4.6 17.4l1.8-1.8M15.6 6.4l1.8-1.8" />
    </G>
  </Svg>
);
const Part = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22">
    <Circle cx={8.5} cy={8.5} r={3.8} fill="#F2B53B" />
    <Path d="M7 17.5h9a3.2 3.2 0 0 0 0-6.4 4.4 4.4 0 0 0-8.4 1.1A2.7 2.7 0 0 0 7 17.5Z" fill="#C9D3E0" />
  </Svg>
);
const Cloud = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22">
    <Path d="M6 17h10a3.6 3.6 0 0 0 0-7.2 5 5 0 0 0-9.5 1.3A3 3 0 0 0 6 17Z" fill="#B7C2D2" />
  </Svg>
);
const Moon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22">
    <Path d="M16.9 13.3A7 7 0 1 1 8.7 5.1 6 6 0 0 0 16.9 13.3Z" fill="#8C9BC4" />
  </Svg>
);
const Rain = ({ size, snow }: { size: number; snow?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 22 22">
    <Path d="M6 13.5h10a3.6 3.6 0 0 0 0-7.2 5 5 0 0 0-9.5 1.3A3 3 0 0 0 6 13.5Z" fill="#B7C2D2" />
    {snow ? (
      <G fill="#9FB4D6">
        <Circle cx={7.5} cy={17} r={1.2} />
        <Circle cx={11} cy={18.5} r={1.2} />
        <Circle cx={14.5} cy={17} r={1.2} />
      </G>
    ) : (
      <G stroke="#6E93D6" strokeWidth={1.5} strokeLinecap="round">
        <Path d="M8 16l-1 2.5M11.5 16l-1 2.5M15 16l-1 2.5" />
      </G>
    )}
  </Svg>
);

/** Big sun from the weather card (44px). */
export const BigSun = ({ size = 44 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 44 44">
    <Circle cx={22} cy={22} r={9} fill="#F2B53B" />
    <G stroke="#F2B53B" strokeWidth={2.4} strokeLinecap="round">
      <Path d="M22 4v5M22 35v5M4 22h5M35 22h5M9.3 9.3l3.5 3.5M31.2 31.2l3.5 3.5M9.3 34.7l3.5-3.5M31.2 12.8l3.5-3.5" />
    </G>
  </Svg>
);

export function SkyIcon({ sky, night, size = 22, big }: { sky: Sky; night?: boolean; size?: number; big?: boolean }) {
  if (sky === 'clear') return night ? <Moon size={size} /> : big ? <BigSun size={size} /> : <Sun size={size} />;
  if (sky === 'partly') return night ? <Cloud size={size} /> : <Part size={size} />;
  if (sky === 'cloudy') return <Cloud size={size} />;
  if (sky === 'snow') return <Rain size={size} snow />;
  return <Rain size={size} />;
}
