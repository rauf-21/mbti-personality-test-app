import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      "50": "#f2f8fd",
      "100": "#e3effb",
      "200": "#c1dff6",
      "300": "#8ac5ef",
      "400": "#4ca7e4",
      "500": "#3498db",
      "600": "#176fb2",
      "700": "#145990",
      "800": "#144c78",
      "900": "#164064",
    },
  },
  fonts: {
    heading: `Poppins, sans-serif`,
    body: `'Poppins', sans-serif`,
  },
});

export default theme;
