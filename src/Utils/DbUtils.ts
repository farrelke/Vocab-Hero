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
      forceReviewAutoSpeak: false
    } as UserPreferences);

  if (preferences.showChinesePodLink === undefined) {
    preferences.showChinesePodLink = true;
  }

  return preferences;
};

export const setUserPreferences = (userPreferences: UserPreferences) => {
  preferences = userPreferences;
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
};

export const getChromeSettings = async (): Promise<{
  forceReview: boolean;
}> => {
  const val = await getChromeLocalVal("forceReview", false);
  return { forceReview: val };
};
export const updateForceReview = (forceReview: boolean) => {
  updateChromeSetting({ forceReview });
};

export const getChromeLocalVal = <T>(
  key: string,
  defaultVal: T
): Promise<T> => {
  return new Promise(resolve => {
    if (chrome) {
      chrome.storage.local.get([key], res =>
        resolve(undefined ? defaultVal : res[key])
      );
    } else {
      return defaultVal;
    }
  });
};

export const updateChromeSetting = (settings: { [key: string] : any }) => {
  chrome && chrome.storage.local.set(settings);
};