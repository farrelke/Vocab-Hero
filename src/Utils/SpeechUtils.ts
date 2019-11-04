import { getUserPreferences, Language } from "./UserPreferencesUtils";

let voices: SpeechSynthesisVoice[] = [];

window.speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

export function getVoicesByLanguage(language: Language) {
  return (voices || []).filter(voice => {
    // using switch so if we add new languages typescript will automatically
    // throw an error to let us know we need to update this
    switch (language) {
      case Language.Chinese:
        return voice.lang.startsWith("zh");
      case Language.Japanese:
        return voice.lang.startsWith("ja");
    }
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
