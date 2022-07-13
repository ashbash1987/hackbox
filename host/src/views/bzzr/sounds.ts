import { reactive } from "vue";
import { Howl } from "howler";
import beepBuzz from "@/assets/buzzes/beep.mp3";
import hackBuzz from "@/assets/buzzes/hack.wav";

const state = reactive({
  volume: 0,
});

const play = (src: string) => new Howl({ src, volume: state.volume }).play();

export default {
  state,
  beepBuzz: () => play(beepBuzz),
  hackBuzz: () => play(hackBuzz),
};
