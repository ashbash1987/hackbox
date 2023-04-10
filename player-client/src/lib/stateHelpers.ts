import type { PlayerStatePayload } from "@/types";

const expandStatePresets = (state: PlayerStatePayload): PlayerStatePayload => {
  const presets = state.presets || {};
  const components = state.ui.main.components.map((component) => {
    const preset = presets[component.type];
    if (!preset) return component;

    const props = { ...preset.props, ...component.props, style: { ...preset.props.style, ...component.props.style } };
    return { key: component.key, type: preset.type, props };
  });

  state.ui.main.components = components;

  return state;
};

export { expandStatePresets };
