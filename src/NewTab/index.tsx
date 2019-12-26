import * as React from "react";
import * as ReactDOM from "react-dom";
import NewTabPage from "./NewTabPage";
import ReviewTab from "../ReviewTab/ReviewTab";
import { initDb } from "../Utils/DB/IndexdbUtils";


const renderPage = () => {
  initDb();
  const [url, action] = location.href.split("#");

  if (action) {
    const [actionType, value] = action.split("=");
    if (actionType === "forceReview") {
      const [tabId, url] = value.split("-");
      ReactDOM.render(
        <ReviewTab tabId={Number(tabId)} redirectUrl={url} />,
        document.getElementById("root")
      );
      return;
    }
  }
  ReactDOM.render(<NewTabPage />, document.getElementById("root"));
};

if (chrome && chrome.tabs && chrome.tabs.query) {
  chrome.tabs.query({ active: true, currentWindow: true }, renderPage);
} else {
  window.addEventListener("load", renderPage);
}
