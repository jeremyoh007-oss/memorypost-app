/**
 * Nothing to load on web: public/index.html links Google Fonts, which send only the Korean glyph
 * ranges on screen (the bundled TTFs are ~47 MB). `F` in theme/tokens uses the web family names.
 */
export const APP_FONTS = {};
