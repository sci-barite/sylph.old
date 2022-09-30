var SKILLS = 'NA';
var ENGLISH = 'NA';

function Sift() {
    var strings = [];
    document.querySelectorAll('[aria-hidden="true"]').forEach(item => {item.removeAttribute('aria-hidden');});
    for (i=0; i<128; i++) {
        if (document.querySelectorAll(".visually-hidden")[i]?.innerText.includes("Skills")) {
            for (var j=i; j<(i+16); j++) {
                strings.push(document.querySelectorAll(".visually-hidden")[j]?.innerText);
            }
            i=i+j;
        }
    }
    var skills = [];
    strings.forEach(function(entry,j) {
        if (strings[j]?.startsWith('Skil')) {
            switch (strings[j]?.substring(4,7)) {
                case 'ls:' :
                    let subskills = strings[j]?.substring(8).split(" · ");
                    subskills.forEach(function(entry,k) {
                        if (skills.indexOf(' '+subskills[k]) == -1) skills.push(' '+subskills[k]);
                    });
                    break;
                case 'ls': 
                    for (var i=1; i<16; i++) {
                        if (!parseInt(strings[j+i]?.charAt(0)) && strings[j+i]?.length < 35) {
                            switch (strings[j+i]?.substring(0,5)) {
                                case "Skill": case "Passe": case "Endor": case "Compl": case "Schoo": case 'Langu': case "Unive": break;
                                case "Influ": case "Group":  case "Inter": case "Recom": i=i+16; break;
                                case "Engli": ENGLISH = strings[j+i+1]; i=i+16; break;
                                default:
                                    if (skills.indexOf(' '+strings[j+i]) == -1) skills.push(' '+strings[j+i]);
                                    break;
                            }
                        }
                    }
                    break;
            }
        }
    });
    SKILLS = skills.toString().substring(1);
}

chrome.runtime.onMessage.addListener((request, sender) => {
    console.log('Request', request);
    if (request.name == 'Sylph') {
        Sift();
        const XSnd = new XMLHttpRequest();
        XSnd.open('GET', // Probably better to replace it with POST at some point, but for now this works well.
        'https://script.google.com/macros/s/AKfycbwK7mV22bg8rHwdtggzbPVv8dRZgm7MNe6uAQnkZoOjrVvcPqR4W2TrqvIN-p6__NrM/exec?'+
        'name='+document.title.replace(' | LinkedIn', '')+'&pos='+'Python + C' // Ideally it should be the bookmark's folder title!
        +'&skills='+SKILLS+'&eng='+ENGLISH+'&url='+document.URL,
        true);
        XSnd.send();
    }
});

