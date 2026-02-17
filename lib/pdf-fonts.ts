import { Font } from "@react-pdf/renderer";

// Use Google Fonts static CDN for reliable TTF access
// @react-pdf/renderer requires TTF/OTF — woff2 is not supported
Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf",
      fontWeight: 700,
    },
  ],
});

// Disable hyphenation for Japanese text
Font.registerHyphenationCallback((word) => [word]);
