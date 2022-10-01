var LINK = '';
var NAME = 'NA';
var RATE = 'NA';
var SKILLS = 'NA';
var ENGLISH = 'NA';
var LOCATION = '';
var POSITION = 'Angular';
var RESPONSE = 0;

function SiftDjinni() {
    NAME = document.querySelector("#candidate_name")?.innerText;
    ENGLISH = document.querySelector(".inbox-thread-candidate-info")?.innerText;
    SKILLS = document.querySelector(".inbox-candidate-details--title")?.innerText.split(",")[0]+" "+ENGLISH.split(" · ")[0];
    ENGLISH = ENGLISH.split(" · ")[1];
    RATE = document.querySelector(".inbox-candidate-details--title")?.innerText.split(",")[1];
    POSITION = document.querySelector(".page-header")?.innerText.substring(11).split("›")[0];
    LOCATION = document.querySelector(".page-header")?.innerText.substring(11).split(', ')[2];
    LINK = document.URL;
}

function SiftLinked() {
    var strings = [];
    document.querySelectorAll('[aria-hidden="true"]').forEach(item => {item.removeAttribute('aria-hidden');});
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
                                case "Skill": case "Passe": case "Endor": case "Compl": case "Schoo": case 'Langu':
                                case "Unive": case "Recom": case "Recei": case "Given" : case "Nothi": break;
                                case "Engli": case "Англи": ENGLISH = strings[j+i+1]; i=i+16; break;
                                case "Influ": case "Group":  case "Inter": i=i+16; break;
                                case "Proje": i=i+2; break;
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
    NAME = document.title.replace(' | LinkedIn', '');
    LINK = document.URL;
}

function SylphBack(response) {
    if (JSON.stringify(response).length > 10) {
        RESPONSE++
        var DUP = "✅ ";
        if (RESPONSE % 2 == 0) {
            let message = JSON.stringify(response);
            console.log(message);
            if (message.includes("DUPLICATE")) DUP = "⚠️ DUPLICATE! "
            alert(DUP+NAME+"\nPosition: "+POSITION+"\nSkills: "+SKILLS+"\nEnglish: "+ENGLISH)
        }
    }
}

chrome.runtime.onMessage.addListener((request, sender) => {
    console.log('Request', request);
    if (request.name == 'Sylph') {
        switch (request.site.substring(12,18)) {
            case "linked": SiftLinked(); break;
            case "ni.co/": SiftDjinni(); break;
            case "upwork": SiftUpwork(); break; // The function should check if it's a profile or proposal page!
            default: alert(request.site.substring(12,18)+": Can't read website name!"); return;
        }
        const XSnd = new XMLHttpRequest();
        XSnd.onreadystatechange = function() {
            SylphBack(XSnd.response);
         }
        XSnd.open('GET', // Probably better to replace it with POST at some point, but for now this works well.
        'https://script.google.com/macros/s/AKfycbykyHuIELGCZxsCs-WSK8nr5FfBV6l8PMtF94eN3hWBxoay1lD_s_fL0lGU_yNJPi4e/exec?'+
        'name='+NAME+'&pos='+POSITION // Ideally it should be the bookmark's folder title, but now it's declare in the code.
        +'&skills='+SKILLS+'&eng='+ENGLISH+'&rate='+RATE+'&loc='+LOCATION+'&url='+LINK,
        true);
        XSnd.send();
    }
});

