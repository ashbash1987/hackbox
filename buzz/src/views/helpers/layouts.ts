const buzzerComponent = () => ({
  type: "bzzrbzzr",
});

const empty = (userName?: string) => ({
  header: {
    text: userName,
  },
  main: {
    align: "center",
    components: [],
  },
});

const buzzer = () => ({
  main: {
    align: "center",
    components: [buzzerComponent()],
  },
});

const textInput = () => ({
  main: {
    align: "start",
    components: [
      {
        type: "bzzrtextinput",
      },
    ],
  },
});

const choices = () => ({
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

const text = (text: string) => ({
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

export default {
  buzzer,
  text,
  empty,
  choices,
  textInput,
};
