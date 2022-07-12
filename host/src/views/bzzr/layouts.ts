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

const textLayout = (text: string) => ({
  main: {
    align: "center",
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

export { buzzerLayout, textLayout, emptyLayout };
