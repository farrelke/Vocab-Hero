import { isUserLangChinese } from "../Utils/UserPreferencesUtils";

export enum Page {
  Test = "Test Words Page",
  Learn = "Main Page",
  Add = "Add Vocabulary",
  Manage = "Manage Vocabulary",
  Import = "Import Vocabulary",
  UserPreferences = "User Preferences",
  Reader = "Reader"
}

export enum SubPage {
  // Page.Test
  TestWords = "Test Words",

  // Page.Learn
  Learn = "Learn",

  // Page.Add
  Input = "Input",
  Search = "Search",
  Paste = "Paste",

  // Page.Manage
  Words = "Words",

  // Page.Import
  Pleco = "Pleco",
  Anki = "Anki",
  PreMade = "Vocabulary Lists",
  Local = "Local Import/Export",

  // Page.UserPreferences
  Preferences = "Preferences",

  // Page.Reader
  Reader = "Reader"
}

export const CN_PAGE_ORDER = [Page.Reader, Page.Manage, Page.Add, Page.Import, Page.UserPreferences, Page.Learn];
export const JA_PAGE_ORDER = [Page.Manage, Page.Add, Page.Import, Page.UserPreferences, Page.Learn];

// some pages are only supported by chinese version
export const getPageOrder = (): Page[] => {
  const isChinese = isUserLangChinese();
  return isChinese ? CN_PAGE_ORDER : JA_PAGE_ORDER;
};

const CN_SUB_PAGES_DICT = {
  [Page.Learn]: [SubPage.Learn],
  [Page.Add]: [SubPage.Input, SubPage.Search, SubPage.Paste],
  [Page.Manage]: [SubPage.Words],
  [Page.Import]: [SubPage.PreMade, SubPage.Pleco, SubPage.Anki, SubPage.Local],
  [Page.Reader]: [SubPage.Reader],
  [Page.UserPreferences]: [SubPage.Preferences]
};

const JA_SUB_PAGES_DICT = {
  [Page.Learn]: [SubPage.Learn],
  [Page.Add]: [SubPage.Input, SubPage.Search, SubPage.Paste],
  [Page.Manage]: [SubPage.Words],
  [Page.Import]: [SubPage.Anki, SubPage.Local],
  [Page.UserPreferences]: [SubPage.Preferences]
};

// some sub pages are only supported by chinese version
export const getSubPages = (page: Page) => {
  const isChinese = isUserLangChinese();
  return (isChinese ? CN_SUB_PAGES_DICT : JA_SUB_PAGES_DICT)[page] || [];
};
