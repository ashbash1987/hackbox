import { getColorTheme } from "./colorThemes";

const getThemeAndPresets = (themeName?: string) => {
  const colorTheme = getColorTheme(themeName);

  return {
    theme: {
      header: {
        backgroundColor: colorTheme.primary,
        textColor: colorTheme.text,
      },
      main: {
        backgroundColor: colorTheme.secondary,
      },
    },
    presets: {
      bzzrbzzr: {
        type: "Buzzer",
        props: {
          backgroundColor: colorTheme.primary,
          textColor: colorTheme.text,
        },
      },
      bzzrtext: {
        type: "Text",
        props: {
          backgroundColor: colorTheme.primary,
          textColor: colorTheme.text,
          border: `2px solid ${colorTheme.text}`,
        },
      },
    },
  };
};

export { getThemeAndPresets };
