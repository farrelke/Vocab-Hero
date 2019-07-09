import { getUserPreferences } from "./DbUtils";

let voices: SpeechSynthesisVoice[] = [];


window.speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

export function getVoices() {
  return voices || [];
}


export function speak(word: string) {
  if (voices.length === 0) return;

  const voice = voices.find(a => a.voiceURI === getUserPreferences().voiceURI);
  if (!voice) return;

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
