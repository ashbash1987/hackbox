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

const buzzedLayout = () => ({
  main: {
    align: "center",
    components: [
      {
        type: "TextBox",
        props: { text: "BUZZED!" },
      },
    ],
  },
});

const emptyLayout = (userName: string) => ({
  header: {
    text: userName,
  },
  main: {
    align: "center",
    components: [],
  },
});

const buzzerLayout = (gameState: GameState) => ({
  main: {
    align: "center",
    components: [buzzerComponent(gameState)],
  },
});

const textLayout = (text: string) => ({
  main: {
    align: "start",
    components: [{ type: "TextBox", props: { text } }],
  },
});

export { buzzerLayout, textLayout, buzzedLayout, emptyLayout };
