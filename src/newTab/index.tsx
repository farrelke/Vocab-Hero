import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NewTabPage from "./NewTabPage";


chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    ReactDOM.render(<NewTabPage />, document.getElementById('root'));
});
