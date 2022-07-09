import { reactive } from "vue";
import { Howl } from "howler";
import beep from "@/assets/beep.mp3";

const state = reactive({
  volume: 0,
});

const play = (src: string) => new Howl({ src, volume: state.volume }).play();

export default {
  state,
  beep: () => play(beep),
};
