import { reactive } from "vue";
import { Howl } from "howler";
import beepBuzz from "@/assets/buzzes/beep.mp3";
import hackBuzz from "@/assets/buzzes/hack.wav";
import { getVolume, setVolume } from "@/lib/browserStorage";

const state = reactive({
  volume: getVolume(),
});

const volumes: { [key: string]: number } = {
  off: 0.0,
  quiet: 0.2,
  medium: 0.6,
  loud: 1.0,
};

const updateVolume = (volume: string) => {
  setVolume(volume);
  state.volume = volume;
};

const play = (src: string) =>
  new Howl({ src, volume: volumes[state.volume] }).play();

export default {
  state,
  updateVolume,
  beepBuzz: () => play(beepBuzz),
  hackBuzz: () => play(hackBuzz),
};
