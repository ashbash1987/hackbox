const buzzerComponent = () => ({
  type: "BuzzerButton",
  props: {
    label: "BUZZ",
    textColor: "white",
    backgroundColor: "red",
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

const buzzerLayout = () => ({
  main: {
    align: "center",
    components: [buzzerComponent()],
  },
});

const textLayout = (text: string) => ({
  main: {
    align: "start",
    components: [{ type: "TextBox", props: { text } }],
  },
});

export { buzzerLayout, textLayout, buzzedLayout, emptyLayout };
