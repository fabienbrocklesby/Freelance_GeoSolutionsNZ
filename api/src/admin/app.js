import AuthLogo from "./extensions/auth-logo.png";
import MenuLogo from "./extensions/logo.png";
import favicon from "./extensions/favicon.png";

export default {
  config: {
    // Replace the Strapi logo on the login page
    auth: {
      logo: AuthLogo,
    },
    // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: MenuLogo,
    },
    // GeoSolutions brand colors
    theme: {
      light: {
        colors: {
          primary100: "#e8f7f0",
          primary200: "#b8e6d1",
          primary500: "#3ec98a",
          primary600: "#2db875",
          primary700: "#259962",
          danger700: "#b72b1a",
        },
      },
      dark: {
        colors: {
          primary100: "#1a3d2e",
          primary200: "#245c42",
          primary500: "#3ec98a",
          primary600: "#2db875",
          primary700: "#259962",
          neutral0: "#151515",
          neutral100: "#1a1a1a",
          neutral150: "#202020",
          neutral200: "#2a2a2a",
          neutral300: "#3a3a3a",
          neutral400: "#4a4a4a",
          neutral500: "#6a6a6a",
          neutral600: "#8a8a8a",
          neutral700: "#aaaaaa",
          neutral800: "#cccccc",
          neutral900: "#eaeaea",
          neutral1000: "#ffffff",
          buttonPrimary500: "#3ec98a",
          buttonPrimary600: "#2db875",
          buttonNeutral0: "#ffffff",
        },
      },
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },
  bootstrap() {},
};
