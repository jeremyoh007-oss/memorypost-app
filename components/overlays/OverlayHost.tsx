import { StyleSheet, View } from 'react-native';

import { AdOverlay } from './AdOverlay';
import { PushBanner, Toast } from './Banners';
import { DebugSheet } from './DebugSheet';
import { DepartOverlay } from './DepartOverlay';
import { MailOverlay } from './MailOverlay';
import { NewFriendOverlay } from './NewFriendOverlay';
import { RegionSheet } from './RegionSheet';
import { StoreOverlay } from './StoreOverlay';
import { TravelSheet } from './TravelSheet';

/** Everything that floats above the tabs, in stacking order (later = on top). */
export function OverlayHost() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TravelSheet />
      <RegionSheet />
      <DebugSheet />
      <DepartOverlay />
      <MailOverlay />
      <StoreOverlay />
      <NewFriendOverlay />
      <AdOverlay />
      <Toast />
      <PushBanner />
    </View>
  );
}
