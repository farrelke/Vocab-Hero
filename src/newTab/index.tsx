import * as React from "react";
import * as ReactDOM from "react-dom";
import NewTabPage from "./NewTabPage";

if (chrome && chrome.tabs && chrome.tabs.query) {
  chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    ReactDOM.render(<NewTabPage />, document.getElementById("root"));
  });
} else {
  window.addEventListener('load',  () => {
    ReactDOM.render(
      <NewTabPage />,
      document.getElementById("root")
    );
  });
}
