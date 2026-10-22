import { type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

let n = 0;

/** Soft elliptical ground shadow (CSS radial-gradient(rgba(...), transparent 70%)). */
export function SoftShadow({ style, color = '#3C230A', opacity = 0.32 }: { style?: StyleProp<ViewStyle>; color?: string; opacity?: number }) {
  const id = `ss${(n = (n + 1) % 1e6)}`;
  return (
    <Svg style={[{ position: 'absolute' }, style]} pointerEvents="none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="0.7" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={50} cy={50} rx={50} ry={50} fill={`url(#${id})`} />
    </Svg>
  );
}
