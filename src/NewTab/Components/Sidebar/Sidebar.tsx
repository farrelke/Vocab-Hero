import * as React from "react";
import { PureComponent } from "react";
import "./Sidebar.scss";
import * as SidebarLogo from "./sidebar-logo.png";
import { getUserPreferences, Language } from "../../../Utils/DbUtils";

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

type Props = {
  selectPage: (page: Page, subPage: SubPage) => any;
  pages: Page[];
  selectedPage: Page;
};

const CnSubPagesDict = {
  [Page.Learn]: [SubPage.Learn],
  [Page.Add]: [SubPage.Input, SubPage.Search, SubPage.Paste],
  [Page.Manage]: [SubPage.Words],
  [Page.Import]: [SubPage.PreMade, SubPage.Pleco, SubPage.Anki, SubPage.Local],
  [Page.Reader]: [SubPage.Reader],
  [Page.UserPreferences]: [SubPage.Preferences]
};

const JaSubPagesDict = {
  [Page.Learn]: [SubPage.Learn],
  [Page.Add]: [SubPage.Input, SubPage.Search, SubPage.Paste],
  [Page.Manage]: [SubPage.Words],
  [Page.Import]: [SubPage.Anki, SubPage.Local],
  [Page.UserPreferences]: [SubPage.Preferences]
};

export const getSubPageDict = () => {
  const userPrefs = getUserPreferences();
  return userPrefs.language === Language.Chinese
    ? CnSubPagesDict
    : JaSubPagesDict;
};

class Sidebar extends PureComponent<Props> {
  onSelectPage = (page: Page) => {
    const subPagesDict = getSubPageDict();
    this.props.selectPage(page, subPagesDict[page]![0]);
  };

  render() {
    const isChinese = getUserPreferences().language === Language.Chinese;
    const { pages, selectedPage, selectPage } = this.props;

    return (
      <div className="Sidebar">
        <img className="Sidebar__logo" src={SidebarLogo} alt="Vocab Hero!" />
        <div className="Sidebar__logoText">
          Vocab {isChinese ? "英雄" : "勇者"}
        </div>

        {pages.map(page => (
          <div
            key={page}
            onClick={() => this.onSelectPage(page)}
            className={`Sidebar__option ${
              selectedPage === page ? "Sidebar__option--selected" : ""
            }`}
          >
            {page}
          </div>
        ))}
      </div>
    );
  }
}

export default Sidebar;
