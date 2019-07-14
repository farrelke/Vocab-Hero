
export enum Language {
  Chinese = "Chinese",
  Japanese = "Japanese"
}
export const Languages = Object.keys(Language);

export type UserPreferences = {
  language: Language;
  voiceURI: string;
};

let preferences: UserPreferences;

export const getUserPreferences = () => {
  if (preferences) return preferences;
  preferences = JSON.parse(localStorage.getItem("userPreferences")) || {
    language: Language.Chinese,
    voiceURI: "Google\u00A0普通话（中国大陆）" // unicode space is different from ascii space :(
  };
  return preferences;
};

export const setUserPreferences = (userPreferences: UserPreferences) => {
  preferences = userPreferences;
  localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
};
