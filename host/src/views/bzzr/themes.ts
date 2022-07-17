import { getColorTheme } from "./colorThemes";

const getThemeAndPresets = (themeName?: string) => {
  const colorTheme = getColorTheme(themeName);

  return {
    theme: {
      header: {
        background: colorTheme.primary,
        color: colorTheme.text,
      },
      main: {
        background: colorTheme.secondary,
      },
    },
    presets: {
      bzzrbzzr: {
        type: "Buzzer",
        props: {
          event: "buzz",
          background: colorTheme.primary,
          color: colorTheme.text,
          border: `2px solid ${colorTheme.text}`,
        },
      },
      bzzrtext: {
        type: "Text",
        props: {
          background: colorTheme.primary,
          color: colorTheme.text,
          border: `2px solid ${colorTheme.text}`,
        },
      },
      bzzrchoices: {
        type: "Choices",
        props: {
          event: "buzz",
          background: colorTheme.primary,
          color: colorTheme.text,
          border: `2px solid ${colorTheme.text}`,
        },
      },
      bzzrtextinput: {
        type: "TextInput",
        props: {
          event: "buzz",
          background: colorTheme.primary,
          color: colorTheme.text,
          border: `2px solid ${colorTheme.text}`,
        },
      },
    },
  };
};

export { getThemeAndPresets };
