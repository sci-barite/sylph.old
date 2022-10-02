var [POSITION, LINK, NAME, RATE, SKILLS, ENGLISH, LOCATION, MORE] = ['Angular', '', 'NA', '', 'NA', 'NA', '', ''];

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

function SiftUpwork(url) {
    LINK = url
    if (url.includes("proposal")) {
        const container = document.querySelector(".up-slider");
        NAME = container.querySelectorAll(".d-inline")[0].innerText.slice(0,-1);
        LOCATION = container.querySelectorAll(".d-inline-block")[3].innerText;
        RATE = container.querySelectorAll(".d-inline")[1].innerText;
        SKILLS = container.querySelectorAll(".skills")[0].innerText.split("\n").toString();
        ENGLISH = container.querySelectorAll(".list-unstyled")[0].innerText.split(":")[1].substring(1);
        POSITION = container.querySelectorAll(".break")[0].innerText;
        MORE = container.querySelector("a.d-block").toString().substring(8)
    }
    else {
        NAME = document.querySelectorAll(".d-inline")[0].innerText.slice(0,-1);
        LOCATION = document.querySelectorAll(".d-inline-block")[3].innerText;
        POSITION = document.querySelectorAll(".mb-0")[6].innerText;
        SKILLS = document.querySelectorAll(".skills")[0].innerText.split("\n").slice(1).toString();
        ENGLISH = document.querySelectorAll(".d-inline-block")[12].innerText;
        RATE = document.querySelectorAll(".d-inline")[1].innerText;
    }
}

function SiftLinked() {
    var Sifted = [];
    for (i=0; i<3; i++) {
        Sifted.push(' '+document.querySelectorAll("a[data-field='skill_card_skill_topic']")[i].innerText.split("\n")[0]);
    }

    const hidden = document.querySelectorAll(".visually-hidden");
    var collated = " · ";
    for (i=0; i < hidden.length; i++) {
        if (hidden[i].innerText.includes("Skills:")) collated = collated+hidden[i].innerText.substring(8)+" · ";
        else if (hidden[i].innerText === "English") ENGLISH = hidden[i+1].innerText;
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
        var DUP = "✅ ";
        let message = JSON.stringify(response);
        console.log(message);
        if (message.includes("DUPLICATE")) DUP = "⚠️ DUPLICATE! "
        alert(DUP+NAME+"\nPosition: "+POSITION+"\nSkills: "+SKILLS+"\nEnglish: "+ENGLISH)
    }
}

chrome.runtime.onMessage.addListener((request, sender) => {
    console.log('Request', request);
    if (request.name == 'Sylph') {
        switch (request.site.substring(12,18)) {
            case "linked": SiftLinked(); break;
            case "ni.co/": SiftDjinni(); break;
            case "upwork": SiftUpwork(request.site); break; // The function should check if it's a profile or proposal page!
            default: alert(request.site.substring(12,18)+": Can't read website name!"); return;
        }
        const XSnd = new XMLHttpRequest();
        XSnd.onreadystatechange = () => {
            if (XSnd.readyState === XMLHttpRequest.DONE) {
                if (XSnd.status === 0 || (XSnd.status >= 200 && XSnd.status < 400)) SylphBack(XSnd.response);
                else alert("⛔ ERROR!\nStatus: "+XSnd.status+"\nSylph didn't find her way home!");
            }
         }
        XSnd.open('GET', // Probably better to replace it with POST at some point, but for now this works well.
        'https://script.google.com/macros/s/AKfycbylzxHp2vMRO3aDOL-rK2nZZZzv08_fHQclUU6PEndziQ5YwuMYVTT6712U66gLsCuC/exec?'+
        'name='+NAME+'&pos='+POSITION // Ideally it should be the bookmark's folder title, for now it's hardcoded for LinkedIn.
        +'&skills='+SKILLS+'&eng='+ENGLISH+'&rate='+RATE+'&loc='+LOCATION+'&url='+LINK+'&more='+MORE,
        true);
        XSnd.send();
    }
});

