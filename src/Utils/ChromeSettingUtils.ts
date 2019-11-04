import { WordDict } from "./DB/IndexdbUtils";

export type ChromeSettings = {
  forceReview: boolean;
};

// wordDict is only for speeding up the reader mode
export type ChromeStorage = ChromeSettings & {
  wordDict?: WordDict;
};

export const getChromeSettings = async (): Promise<ChromeSettings> => {
  const val = await getChromeLocalVal("forceReview", false);
  return { forceReview: val };
};

export const getChromeLocalVal = <T>(key: string, defaultVal: T): Promise<T> => {
  return new Promise(resolve => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([key], res => resolve(undefined ? defaultVal : res[key]));
    } else {
      return defaultVal;
    }
  });
};

export const updateChromeSetting = (settings: Partial<ChromeStorage>) => {
  chrome && chrome.storage && chrome.storage.local && chrome.storage.local.set(settings);
};
