import { black, green, grey, blue, white, dark } from './colors'

const theme = {
  borderRadius: 12,
  breakpoints: {
    mobile: 768,
  },
  color: {
    black,
    grey,
    dark,
    blue,
    primary: {
      light: blue[200],
      main: white,
    },
    secondary: {
      main: green[500],
    },
    white,
  },
  siteWidth: 1200,
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
  },
  topBarSize: 72
}

export default theme