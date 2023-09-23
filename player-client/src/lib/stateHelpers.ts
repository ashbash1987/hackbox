import type { PlayerStatePayload } from "@/types";

const expandStatePresets = (state: PlayerStatePayload): PlayerStatePayload => {
  const presets = state.presets || {};
  const components = state.ui.main.components.map((component) => {
    const preset = presets[component.type];
    if (!preset) return component;

    const props = { ...preset.props, ...component.props };

    return { key: component.key, type: preset.type, props };
  });

  state.ui.main.components = components;

  return state;
};

const processFonts = (state: PlayerStatePayload): void => {
  document.getElementById("google-fonts-preload-link")?.remove();
  document.getElementById("google-fonts-link")?.remove();

  const fonts = state.theme.fonts;
  if (!fonts || fonts.length === 0) return;

  const searchParams = new URLSearchParams();

  fonts.forEach(({ family }) => {
    searchParams.append("family", family);
  });
  searchParams.append("display", "swap");

  const googleFontsPreloadLink = document.createElement("link");
  googleFontsPreloadLink.id = "google-fonts-preload-link";
  googleFontsPreloadLink.href = `https://fonts.googleapis.com/css2?${searchParams.toString()}`;
  googleFontsPreloadLink.rel = "preload";
  googleFontsPreloadLink.as = "style";
  googleFontsPreloadLink.crossOrigin = "anonymous";

  const googleFontsLink = document.createElement("link");
  googleFontsLink.id = "google-fonts-preload-link";
  googleFontsLink.href = `https://fonts.googleapis.com/css2?${searchParams.toString()}`;
  googleFontsLink.rel = "stylesheet";

  document.head.appendChild(googleFontsPreloadLink);
  document.head.appendChild(googleFontsLink);
};

export { expandStatePresets, processFonts };
