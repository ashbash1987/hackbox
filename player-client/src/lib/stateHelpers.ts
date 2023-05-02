import type { PlayerStatePayload } from "@/types";

const expandStatePresets = (state: PlayerStatePayload): PlayerStatePayload => {
  const presets = state.presets || {};
  const components = state.ui.main.components.map((component) => {
    const preset = presets[component.type];
    if (!preset) return component;

    const props = {
      ...(preset.props as {}),
      ...(component.props as {}),
      style: {
        ...(preset.props.style as {}),
        ...(component.props.style as {}),
      },
    };

    return { key: component.key, type: preset.type, props };
  });

  state.ui.main.components = components;

  return state;
};

export { expandStatePresets };
