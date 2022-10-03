var CastingIndex = 1;
var SylphCasting = false;
var Tab;

function SylphCasts()
{               
   if ( SylphCasting )
   {
      chrome.pageAction.setIcon({tabId: Tab, path: 'images/sylph-casts'+CastingIndex+'.png'});
      CastingIndex = (CastingIndex + 1) % 10;
      window.setTimeout(SylphCasts, 200); // Animation for the win!
   }
}

chrome.runtime.onInstalled.addListener(()=> {
    console.log('Sylph installed!');
});

chrome.bookmarks.onCreated.addListener((id, bookmark)=> {
    chrome.bookmarks.get(bookmark.parentId, (folder) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            Tab = tabs[0].id
            chrome.tabs.sendMessage(Tab, { name: 'Sylph', site: bookmark.url, position: folder[0].title });
            console.log("Bookmark created in '"+folder[0].title+"', Sylph is casting her spell...");
            SylphCasting = true;
            SylphCasts();
        });
    });
});

chrome.runtime.onMessage.addListener(function(Sylph) {
    if (Sylph.SpellSuccessful) {
        SylphCasting = false;
        chrome.pageAction.setIcon({tabId: Tab, path: "images/sylph32.png"}); // Reset to original icon
    }
    else {
        SylphCasting = false;
        chrome.pageAction.setIcon({tabId: Tab, path: "images/sylph-hurt.png"}); // Sylph hurt in case of error
    }
});