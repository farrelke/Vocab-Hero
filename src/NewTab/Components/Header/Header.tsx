import * as React from "react";
import { PureComponent } from "react";
import "./Header.scss";
import { getSubPageDict, Page, SubPage } from "../Sidebar/Sidebar";

type Props = {
  page: Page;
  subPage: SubPage;
  selectPage: (page: Page, subPage: SubPage) => any;
};

class Header extends PureComponent<Props> {
  render() {
    const { page, subPage, selectPage } = this.props;

    const subPages = getSubPageDict()[page] || [];

    return (
      <div className="Header">
        <div className="Header__title">{page}</div>
        <div className="Header__options">
          {subPages.map(subPageOpt => (
            <div
              key={subPageOpt}
              onClick={() => selectPage(page, subPageOpt)}
              className={`Header__option ${
                subPage === subPageOpt ? "Header__option--selected" : ""
              }`}
            >
              {subPageOpt}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Header;
