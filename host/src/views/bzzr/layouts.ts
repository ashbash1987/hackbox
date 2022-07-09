import type { ColorTheme } from "./themes";

const themeLayout = (theme: ColorTheme) => ({
  header: {
    backgroundColor: theme.primary,
    textColor: theme.text,
  },
  main: {
    backgroundColor: theme.secondary,
  },
});

const buzzerComponent = (theme: ColorTheme) => ({
  type: "BuzzerButton",
  props: {
    backgroundColor: theme.primary,
    textColor: theme.text,
  },
});

const emptyLayout = (userName?: string) => ({
  header: {
    text: userName,
  },
  main: {
    align: "center",
    components: [],
  },
});

const buzzerLayout = (theme: ColorTheme) => ({
  main: {
    align: "center",
    components: [buzzerComponent(theme)],
  },
});

const textLayout = (theme: ColorTheme, text: string) => ({
  main: {
    align: "start",
    components: [
      {
        type: "TextBox",
        props: {
          text,
          backgroundColor: theme.primary,
          textColor: theme.text,
          border: `4px solid ${theme.text}`,
        },
      },
    ],
  },
});

export { buzzerLayout, textLayout, emptyLayout, themeLayout };
