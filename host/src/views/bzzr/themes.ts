const defaultTheme = {
  header: {
    backgroundColor: "#000000",
    textColor: "white",
  },
  main: {
    backgroundColor: "#7f7f7f",
  },
};

const teamThemes: { [key: string]: object } = {
  red: {
    header: {
      backgroundColor: "#ff0000",
      textColor: "white",
    },
    main: {
      backgroundColor: "#7f3f3f",
    },
  },
  orange: {
    header: {
      backgroundColor: "#ff9d00",
      textColor: "white",
    },
    main: {
      backgroundColor: "#7f5f3f",
    },
  },
  yellow: {
    header: {
      backgroundColor: "#ffff00",
      textColor: "black",
    },
    main: {
      backgroundColor: "#7f7f3f",
    },
  },
  green: {
    header: {
      backgroundColor: "#00ff00",
      textColor: "black",
    },
    main: {
      backgroundColor: "#3f7f3f",
    },
  },
  blue: {
    header: {
      backgroundColor: "#0000ff",
      textColor: "white",
    },
    main: {
      backgroundColor: "#3f3f7f",
    },
  },
  purple: {
    header: {
      backgroundColor: "#7f00ff",
      textColor: "white",
    },
    main: {
      backgroundColor: "#5f3f7f",
    },
  },
};

const teamTheme = (color: string) => {
  return teamThemes[color] || defaultTheme;
};

export { defaultTheme, teamTheme };
