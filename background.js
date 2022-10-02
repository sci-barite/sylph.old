chrome.runtime.onInstalled.addListener(()=> {
    console.log('Sylph installed!');
});

chrome.bookmarks.onCreated.addListener((id, bookmark)=> {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { name: 'Sylph', site: bookmark.url });
        console.log('Bookmark created, Sylph sent to content.js...');
        chrome.pageAction.setIcon({
            tabId: tabs[0].id,
            path: "images/sylph-magic32.png"
        });
    });
})

chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.pageAction.setIcon({
            tabId: tabs[0].id,
            path: "images/sylph32.png"
        });
    });
});