import { getUserPreferences, Language } from "./DbUtils";

let voices: SpeechSynthesisVoice[] = [];

window.speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

export function getVoicesByLanguage(language: Language) {
  return (voices || []).filter(voice => {
    if (language === Language.Chinese) return voice.lang.startsWith("zh");
    if (language === Language.Japanese) return voice.lang.startsWith("ja");
    return true;
  });
}

export function speak(word: string) {
  if (voices.length === 0) return;

  const voice = voices.find(a => a.voiceURI === getUserPreferences().voiceURI);
  if (!voice) return;

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
