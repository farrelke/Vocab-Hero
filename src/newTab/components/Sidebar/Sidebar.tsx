import * as React from "react";
import { PureComponent } from "react";
import "./Sidebar.scss";
import * as SidebarLogo from "./sidebar-logo.png";

type Props = {};

class Sidebar extends PureComponent<Props> {
  render() {
    const pages = [

      "Learn",
      "Manage Vocabulary",
      "Add Vocabulary",
      "Import / Export",
      "Preferences"
    ];
    const selected = "Learn";

    return (
      <div className="Sidebar">
        <img className="Sidebar__logo" src={SidebarLogo} alt="Vocab Hero!" />
        <div className="Sidebar__logoText">Vocab 英雄</div>

        {pages.map(page => (
          <div
            className={`Sidebar__option ${
              selected === page ? "Sidebar__option--selected" : ""
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
