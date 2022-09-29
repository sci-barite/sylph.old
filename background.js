chrome.runtime.onInstalled.addListener(()=> {
    console.log('Sylph installed!');
});

chrome.bookmarks.onCreated.addListener((id, bookmark)=> {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { name: 'Sylph', bm: bookmark.parentId });
        console.log('Bookmark created, Sylph sent to content.js...');
    });
})