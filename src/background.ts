chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension has been installed. Reason:", details.reason);
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

console.log("Hello World!");