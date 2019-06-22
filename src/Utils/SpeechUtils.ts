let chineseVoice: any = null;
window.speechSynthesis.onvoiceschanged = () => {
  const voices = speechSynthesis.getVoices();
  // need to be able to tell the subtitle language
  const chineseVoices = voices.filter(a => a.lang === "zh-CN");

  // choose last voice because it should be google which sounds better
  chineseVoice = chineseVoices[chineseVoices.length - 1];
};

export function speak(word: string) {
  if (!chineseVoice) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.voice = chineseVoice;
  speechSynthesis.speak(utterance);
}
