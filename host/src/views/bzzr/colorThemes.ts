export interface ColorTheme {
  primary: string;
  secondary: string;
  text: string;
}

const teamThemes: { [key: string]: ColorTheme } = {
  default: {
    primary: "#0D0D0D",
    secondary: "#3f3f3f",
    text: "white",
  },
  red: {
    primary: "hsl(0, 100%, 50%)",
    secondary: "hsl(0, 60%, 30%)",
    text: "white",
  },
  orange: {
    primary: "hsl(30, 100%, 50%)",
    secondary: "hsl(30, 60%, 30%)",
    text: "white",
  },
  yellow: {
    primary: "hsl(60, 100%, 50%)",
    secondary: "hsl(60, 60%, 30%)",
    text: "black",
  },
  chartreuse: {
    primary: "hsl(90, 100%, 50%)",
    secondary: "hsl(90, 60%, 30%)",
    text: "black",
  },
  green: {
    primary: "hsl(120, 100%, 50%)",
    secondary: "hsl(120, 60%, 30%)",
    text: "black",
  },
  springgreen: {
    primary: "hsl(150, 100%, 50%)",
    secondary: "hsl(150, 60%, 30%)",
    text: "black",
  },
  cyan: {
    primary: "hsl(180, 100%, 50%)",
    secondary: "hsl(180, 60%, 30%)",
    text: "black",
  },
  azure: {
    primary: "hsl(210, 100%, 50%)",
    secondary: "hsl(210, 60%, 30%)",
    text: "white",
  },
  blue: {
    primary: "hsl(240, 100%, 50%)",
    secondary: "hsl(240, 60%, 30%)",
    text: "white",
  },
  purple: {
    primary: "hsl(270, 100%, 50%)",
    secondary: "hsl(270, 60%, 30%)",
    text: "white",
  },
  pink: {
    primary: "hsl(300, 100%, 50%)",
    secondary: "hsl(300, 60%, 30%)",
    text: "black",
  },
  rose: {
    primary: "hsl(330, 100%, 50%)",
    secondary: "hsl(330, 60%, 30%)",
    text: "black",
  },
};

const getColorTheme = (color?: string): ColorTheme => {
  if (!color) return teamThemes["default"];
  return teamThemes[color] || teamThemes["default"];
};

export { getColorTheme };
