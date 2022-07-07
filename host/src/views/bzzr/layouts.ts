import type { GameState } from "./types";

const buzzerComponent = (gameState: GameState) => ({
  type: "BuzzerButton",
  props: {
    label: gameState.buzzer.active ? "BUZZ" : "Wait",
    textColor: "white",
    backgroundColor: gameState.buzzer.active ? "red" : "black",
    active: gameState.buzzer.active,
  },
});

const buzzerLayout = (gameState: GameState) => ({
  ui: {
    main: {
      align: "center",
      components: [buzzerComponent(gameState)],
    },
  },
});

const textLayout = (text: string) => ({
  ui: {
    main: {
      align: "start",
      components: [{ type: "TextBox", props: { text } }],
    },
  },
});

export { buzzerLayout, textLayout };
