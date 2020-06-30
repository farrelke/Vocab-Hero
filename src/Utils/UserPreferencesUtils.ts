export enum Language {
  Chinese = "Chinese",
  Japanese = "Japanese"
}
export const Languages = Object.keys(Language);

export type UserPreferences = {
  showChinesePodLink: true;
  language: Language;
  voiceURI: string;
  forceReviewAutoSpeak: boolean;
  disableToneColors: boolean;
};

let preferences: UserPreferences;

export const getUserPreferences = () => {
  if (preferences) return preferences;
  preferences =
    JSON.parse(localStorage.getItem("userPreferences")) ||
    ({
      showChinesePodLink: true,
      language: Language.Chinese,
      voiceURI: "Google\u00A0普通话（中国大陆）", // unicode space is different from ascii space :(
      forceReviewAutoSpeak: false,
      disableToneColors: false
    } as UserPreferences);

  if (preferences.showChinesePodLink === undefined) {
    preferences.showChinesePodLink = true;
  }

  return preferences;
};

export const isUserLangChinese = () => {
  return getUserPreferences().language === Language.Chinese;
};

export const setUserPreferences = (userPreferences: UserPreferences) => {
  preferences = userPreferences;
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
};
