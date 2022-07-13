const buzzerComponent = () => ({
  type: "bzzrbzzr",
});

const emptyLayout = (userName?: string) => ({
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

const textInputLayout = () => ({
  main: {
    align: "start",
    components: [
      {
        type: "bzzrtextinput",
      },
    ],
  },
});

const choicesLayout = () => ({
  main: {
    align: "start",
    components: [
      {
        type: "bzzrchoices",
        props: {
          choices: [
            { label: "A", value: "A", keys: ["A", "1"] },
            { label: "B", value: "B", keys: ["B", "2"] },
            { label: "C", value: "C", keys: ["C", "3"] },
            { label: "D", value: "D", keys: ["D", "4"] },
          ],
        },
      },
    ],
  },
});

const textLayout = (text: string) => ({
  main: {
    components: [
      {
        type: "bzzrtext",
        props: {
          text,
        },
      },
    ],
  },
});

export {
  buzzerLayout,
  textLayout,
  emptyLayout,
  choicesLayout,
  textInputLayout,
};
