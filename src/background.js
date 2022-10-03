chrome.runtime.onInstalled.addListener(()=> {
    console.log('Sylph installed!');
});

chrome.bookmarks.onCreated.addListener((id, bookmark)=> {
    chrome.bookmarks.get(bookmark.parentId, (folder) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { name: 'Sylph', site: bookmark.url, position: folder[0].title });
            console.log("Bookmark created in '"+folder[0].title+"', Sylph is casting her spell...");
            chrome.pageAction.setIcon({
                tabId: tabs[0].id,
                path: "images/sylph-magic32.png" // To show that magic is at work..!
            });
        });
    });
});

chrome.runtime.onMessage.addListener(function(Sylph) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (Sylph.SpellCasted) {
            chrome.pageAction.setIcon({
                tabId: tabs[0].id,
                path: "images/sylph32.png" // Resets the extension icon to show the job is completed!
            });
        }
        else {
            chrome.pageAction.setIcon({
                tabId: tabs[0].id,
                path: "images/sylph-hurt32.png" // Different icon indicating something's wrong...
            });
        }
    });
});