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
    var Sifted = [];
    document.querySelectorAll('[aria-hidden="true"]').forEach(item => {item.removeAttribute('aria-hidden');});
    
    // Main Skills first
    for (i=0; i<3; i++) {
        Sifted.push(' '+document.querySelectorAll("a[data-field='skill_card_skill_topic']")[i].innerText.split("\n")[0]);
    }

    const hidden = document.querySelectorAll(".visually-hidden");
    var collated = " · ";
    for (i=0; i < hidden.length; i++) {
        if (hidden[i].innerText.includes("Skills:")) collated = collated+hidden[i].innerText.substring(8)+" · ";
        else if (hidden[i].innerText.includes("English")) ENGLISH = hidden[i+1].innerText;
    }

    var subskills = collated.split(" · ");
    for (i=0; i<subskills.length; i++) {
        if (Sifted.indexOf(' '+subskills[i]) == -1 && Sifted != '') Sifted.push(' '+subskills[i]);
    }

    SKILLS = Sifted.toString().substring(1);
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

