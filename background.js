chrome.runtime.onInstalled.addListener(()=> {
    console.log('Sylph installed!');
});

chrome.bookmarks.onCreated.addListener((id, bookmark)=> {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { name: 'Sylph', site: bookmark.url });
        console.log('Bookmark created, Sylph is casting her spell...');
        chrome.pageAction.setIcon({
            tabId: tabs[0].id,
            path: "images/sylph-magic32.png"
        });
    });
})

chrome.runtime.onMessage.addListener(function(Sylph) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (Sylph.SpellCasted) {
            chrome.pageAction.setIcon({
                tabId: tabs[0].id,
                path: "images/sylph32.png"
            });
        }
        else {
            chrome.pageAction.setIcon({
                tabId: tabs[0].id,
                path: "images/sylph-hurt32.png"
            });
        }
    });
});