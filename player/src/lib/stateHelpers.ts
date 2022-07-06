import type { PlayerStatePayload, PlayerState } from "@/types";

const expandStatePresets = (state: PlayerStatePayload): PlayerState => {
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

export { expandStatePresets };
