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
  preferences = JSON.parse(localStorage.getItem("userPreferences")) || {
    showChinesePodLink: true,
    language: Language.Chinese,
    voiceURI: "Google\u00A0普通话（中国大陆）", // unicode space is different from ascii space :(
    forceReviewAutoSpeak: false
  } as UserPreferences;

  if (preferences.showChinesePodLink === undefined) {
    preferences.showChinesePodLink = true;
  }

  return preferences;
};

export const setUserPreferences = (userPreferences: UserPreferences) => {
  preferences = userPreferences;
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
};

export const getChromeSettings = (): Promise<{
  forceReview: boolean;
}> => {
  return new Promise(resolve => {
    if (chrome) {
      chrome.storage.local.get(["forceReview"], res =>
        resolve({
          forceReview: !!res.forceReview
        })
      )
    } else {
      return { forceReview: false }
    }
  });
};
 export const updateForceReview = (forceReview: boolean) => {
   chrome && chrome.storage.local.set({ forceReview });
 };