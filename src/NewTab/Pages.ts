import { isUserLangChinese } from "../Utils/UserPreferencesUtils";

export enum Page {
  Test = "Test Words Page",
  Learn = "Main Page",
  Add = "Add Vocabulary",
  Manage = "Manage Vocabulary",
  Import = "Import Vocabulary",
  Reader = "Reader",
  UserPreferences = "User Preferences"
}

export enum SubPage {
  TestWords = "Test Words",

  Learn = "Learn",

  Input = "Input",
  Search = "Search",
  Paste = "Paste",

  Words = "Words",

  Pleco = "Pleco",
  Anki = "Anki",
  PreMade = "Vocabulary Lists",
  Local = "Local Import/Export",

  Preferences = "Preferences",

  Reader = "Reader"
}

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

export const getSubPages = (page: Page) => {
  const isChinese = isUserLangChinese();
  return (isChinese ? CN_SUB_PAGES_DICT : JA_SUB_PAGES_DICT)[page] || [];
};

export const CN_PAGE_ORDER = [Page.Reader, Page.Manage, Page.Add, Page.Import, Page.UserPreferences, Page.Learn];
export const JA_PAGE_ORDER = [Page.Manage, Page.Add, Page.Import, Page.UserPreferences, Page.Learn];

export const getPageOrder = () => {
  const isChinese = isUserLangChinese();
  return isChinese ? CN_PAGE_ORDER : JA_PAGE_ORDER;
};
