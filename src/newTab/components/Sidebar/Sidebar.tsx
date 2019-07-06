import * as React from "react";
import { PureComponent } from "react";
import "./Sidebar.scss";
import * as SidebarLogo from "./sidebar-logo.png";
import { speak } from "../../../Utils/SpeechUtils";

export enum Page {
  Learn = "Main Page",
  Add = "Add Vocabulary",
  Manage = "Manage Vocabulary",
  Import = "Import Vocabulary"
}

export enum SubPage {
  Learn = "Learn",

  Input = "Input",
  Search = "Search",
  Paste = "Paste",

  Words = "Words",

  Pleco = "Pleco",
  Anki = "Anki",
  PreMade = "Vocabulary Lists",
  Local = "Local Import/Export"
}

type Props = {
  selectPage: (page: Page, subPage: SubPage) => any;
  pages: Page[];
  selectedPage: Page;
};

export const SubPagesDict = {
  [Page.Learn]: [SubPage.Learn],
  [Page.Add]: [SubPage.Input, SubPage.Search, SubPage.Paste],
  [Page.Manage]: [SubPage.Words],
  [Page.Import]: [SubPage.Pleco, SubPage.Anki, SubPage.PreMade, SubPage.Local]
};

class Sidebar extends PureComponent<Props> {
  render() {
    const { pages, selectedPage, selectPage } = this.props;

    return (
      <div className="Sidebar">
        <img className="Sidebar__logo" src={SidebarLogo} alt="Vocab Hero!" />
        <div className="Sidebar__logoText">Vocab 英雄</div>

        {pages.map(page => (
          <div
            key={page}
            onClick={() => selectPage(page, SubPagesDict[page]![0])}
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
