import { PlayerState } from "../../types";

const mergeStates = (
  oldState: PlayerState,
  newState: Partial<PlayerState>
): PlayerState => {
  const combinedState = oldState;
  if (newState.theme) {
    if (newState.theme.header)
      combinedState.theme.header = {
        ...oldState.theme.header,
        ...newState.theme.header,
      };
    if (newState.theme.main)
      combinedState.theme.main = {
        ...oldState.theme.main,
        ...newState.theme.main,
      };
  }

  if (newState.presets) {
    const oldPresets = oldState.presets || {};
    combinedState.presets = { ...oldPresets, ...newState.presets };
  }

  if (newState.ui) {
    if (newState.ui.header)
      combinedState.ui.header = {
        ...oldState.ui.header,
        ...newState.ui.header,
      };
    if (newState.ui.main)
      combinedState.ui.main = { ...oldState.ui.main, ...newState.ui.main };
  }

  return combinedState;
};

export { mergeStates };
