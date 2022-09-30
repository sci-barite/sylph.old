var SKILLS = 'NA';
var ENGLISH = 'NA';

function Sift() {
    var strings = [];
    document.querySelectorAll('[aria-hidden="true"]').forEach(item => {item.removeAttribute('aria-hidden');});
    alert(document.querySelectorAll(".visually-hidden").length);
    for (i=0; i<document.querySelectorAll(".visually-hidden").length; i++) {
        if (document.querySelectorAll(".visually-hidden")[i]?.innerText.startsWith("Skills")) {
            for (var y=i; y<(i+12); y++) {
                strings.push(document.querySelectorAll(".visually-hidden")[y]?.innerText);
            }
        }
        if (document.querySelectorAll(".visually-hidden")[i]?.innerText.startsWith("Languages")) {
            for (var z=i; z<(i+6); z++) {
                strings.push(document.querySelectorAll(".visually-hidden")[z]?.innerText);
            }
        }
    }
    alert(strings.toString());
    var skills = [];
    strings.forEach(function(entry,j) {
        if (strings[j]?.startsWith('Skil') || strings[j]?.startsWith('Engl')) {
            switch (strings[j]?.substring(4,7)) {
                case 'ls:' :
                    let subskills = strings[j]?.substring(8).split(" · ");
                    subskills.forEach(function(entry,k) {
                        if (skills.indexOf(' '+subskills[k]) == -1) skills.push(' '+subskills[k]);
                    });
                    break;
                case 'ls': 
                    for (var i=1; i<12; i++) {
                        if (!parseInt(strings[j+i]?.charAt(0)) && strings[j+i]?.length < 35) {
                            switch (strings[j+i]?.substring(0,5)) {
                                case "Skill": case "Passe": case "Endor": case "Compl": case "Schoo": case 'Langu': case "Unive": break;
                                case "Recom": case "Recei": case "Given" : case "Nothi": break;
                                case "Influ": case "Group":  case "Inter": i=i+16; break;
                                case "Engli": ENGLISH = strings[j+i+1]; i=i+16; break;
                                default:
                                    if (skills.indexOf(' '+strings[j+i]) == -1) skills.push(' '+strings[j+i]);
                                    break;
                            }
                        }
                    }
                    break;
                case 'ish' : ENGLISH = strings[j+1]; break;
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

