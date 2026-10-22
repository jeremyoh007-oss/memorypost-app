/**
 * Dev-only tools (debug menu on long-pressing the date, "바로 도착" on trips).
 * On in development; can be forced on for a preview build with EXPO_PUBLIC_DEV_MENU=1.
 */
export const DEV_TOOLS = __DEV__ || process.env.EXPO_PUBLIC_DEV_MENU === '1';
