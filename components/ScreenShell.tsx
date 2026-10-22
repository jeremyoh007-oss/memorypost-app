import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C } from '@/theme/tokens';
import { Txt } from './Txt';
import { TitleRow } from './ui';

/**
 * Layout for the album / wardrobe / friends tabs. Mirrors the prototype's sheets:
 * 22px title row, muted sub line, scrolling body, optional sticky footer above the tab bar.
 */
export function ScreenShell({
  title,
  right,
  sub,
  header,
  footer,
  children,
}: {
  title: string;
  right?: ReactNode;
  sub: string;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const tabH = 58 + Math.max(insets.bottom, 18);
  return (
    <View style={[s.root, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
      <View style={s.head}>
        <TitleRow title={title} right={right} />
        <Txt size={13} color={C.ink2} style={{ marginBottom: 14 }}>
          {sub}
        </Txt>
        {header}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 2, paddingBottom: footer ? 16 : tabH + 16 }} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer ? <View style={[s.foot, { paddingBottom: tabH + 10 }]}>{footer}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  head: { paddingHorizontal: 18 },
  foot: { paddingHorizontal: 18, paddingTop: 12 },
});
