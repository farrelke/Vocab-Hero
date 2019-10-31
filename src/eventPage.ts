// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  return false;
});

const ONE_MIN = 60 * 1000;
const TIME_TIL_NEXT_REVIEW = 30 * ONE_MIN;

const forceReview = (tabId: number, url: string) => {
  chrome.storage.local.get(
    ["lastReview", "forceReview"],
    ({ lastReview, forceReview }) => {
      if (!forceReview) return;

      let shouldForceReview = true;
      if (lastReview) {
        try {
          const lastTime = new Date(lastReview).getTime();
          const now = new Date().getTime();
          shouldForceReview = now - TIME_TIL_NEXT_REVIEW > lastTime;
        } catch (e) {
          // something went wrong, better to just disable
          // we don't want to piss off the user
          shouldForceReview = false;
        }
      }

      if (shouldForceReview) {
        const extensionUrl = chrome.extension.getURL(
          `index.html#forceReview=${tabId}-${url}`
        );
        chrome.storage.local.set({ lastReview: new Date().toString() });
        chrome.tabs.update(null, {
          url: extensionUrl
        });

        setTimeout(() => {
          chrome.history.deleteUrl({ url: extensionUrl });
        }, 10000);
      }
    }
  );
};

const setForceReviewHooks = () => {
  const filter = {
    url: [{ hostContains: "reddit.com" }, { hostContains: "reddit.it" }]
  };
  const onUrlChange = details => {
    // https://out.reddit.com contains a token which will expire and break the redirect link
    if (details.url.indexOf("https://out.reddit.com") === -1) {
      forceReview(details.tabId, details.url);
    }
  };
  chrome.webNavigation.onCommitted.addListener(onUrlChange, filter);
  chrome.webNavigation.onHistoryStateUpdated.addListener(onUrlChange, filter);
};

setForceReviewHooks();

chrome.browserAction.onClicked.addListener(() => {
  window.focus();
  chrome.tabs.create({
    url: chrome.extension.getURL("index.html")
  });
});
