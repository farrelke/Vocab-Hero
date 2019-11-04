import * as React from "react";
import "./Sidebar.scss";
import * as SidebarLogo from "./sidebar-logo.png";
import { isUserLangChinese } from "../../../Utils/UserPreferencesUtils";
import classNames from "classnames";
import { getPageOrder, getSubPages, Page, SubPage } from "../../Pages";

type Props = {
  selectPage: (page: Page, subPage: SubPage) => any;
  selectedPage: Page;
};

const Sidebar = (props: Props) => {
  const isChinese = isUserLangChinese();
  const pageOrder = getPageOrder();

  const onSelectPage = (page: Page) => {
    const subPages = getSubPages(page);
    props.selectPage(page, subPages[0]);
  };

  return (
    <div className="Sidebar">
      <img className="Sidebar__logo" src={SidebarLogo} alt="Vocab Hero!" />
      <div className="Sidebar__logoText">Vocab {isChinese ? "英雄" : "勇者"}</div>

      {pageOrder.map(page => (
        <div
          key={page}
          onClick={() => onSelectPage(page)}
          className={classNames("Sidebar__option", {
            "Sidebar__option--selected": props.selectedPage === page
          })}
        >
          {page}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
