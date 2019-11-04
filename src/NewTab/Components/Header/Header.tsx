import * as React from "react";
import "./Header.scss";
import { getSubPages, Page, SubPage } from "../../Pages";
import classNames from "classnames";

type Props = {
  page: Page;
  subPage: SubPage;
  selectPage: (page: Page, subPage: SubPage) => unknown;
};

const Header = (props: Props) => {
  const subPages = getSubPages(props.page);

  return (
    <div className="Header">
      <div className="Header__title">{props.page}</div>
      <div className="Header__options">
        {subPages.map(subPage => (
          <div
            key={subPage}
            onClick={() => props.selectPage(props.page, subPage)}
            className={classNames("Header__option", {
              "Header__option--selected": subPage === props.subPage
            })}
          >
            {subPage}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
