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
    LINK = url;
    var [Sifted,SubSkills] = [ [],[] ];
    if (url.includes("proposal")) {
        const Container = document.querySelector(".up-slider");
        NAME = Container.querySelectorAll(".d-inline")[0].innerText;
        if (NAME.charAt(NAME.length -1) === " ") NAME = NAME.slice(0,-1);
        LOCATION = Container.querySelectorAll(".d-inline-block")[3].innerText;
        RATE = Container.querySelectorAll(".d-inline")[1].innerText;

        SubSkills = Container.querySelectorAll(".skills")[0].innerText.split("\n")
        for (i=0; i<SubSkills.length; i++) {
            if (SubSkills[i] != 'Skills') Sifted.push(' '+SubSkills[i]);
        }
        SKILLS = Sifted.toString().substring(1);

        ENGLISH = Container.querySelectorAll(".list-unstyled")[0].innerText.split(":")[1].substring(1);
        POSITION = Container.querySelectorAll(".break")[0].innerText;
        MORE = Container.querySelector("a.d-block").toString().substring(8)
    }
    else {
        NAME = document.querySelectorAll(".d-inline")[0].innerText.slice(0,-1);
        if (NAME.charAt(NAME.length -1) === " ") NAME = NAME.slice(0,-1);
        LOCATION = document.querySelectorAll(".d-inline-block")[3].innerText;
        POSITION = document.querySelectorAll(".mb-0")[6].innerText;

        SubSkills = document.querySelectorAll(".skills")[0].innerText.split("\n");
        for (i=0; i<SubSkills.length; i++) {
            if (SubSkills[i] != 'Skills') Sifted.push(' '+SubSkills[i]);
        }
        SKILLS = Sifted.toString().substring(1);

        ENGLISH = document.querySelectorAll(".d-inline-block")[12].innerText;
        RATE = document.querySelectorAll(".d-inline")[1].innerText;
    }
}

function SiftLinked() {
    var Sifted = [];
    for (i=0; i<3; i++) {
        Sifted.push(' '+document.querySelectorAll("a[data-field='skill_card_skill_topic']")[i].innerText.split("\n")[0]);
    }

    const Hidden = document.querySelectorAll(".visually-hidden");
    var Collated = " · ";
    for (i=0; i < Hidden.length; i++) {
        if (Hidden[i].innerText.includes("Skills:")) Collated = Collated+Hidden[i].innerText.substring(8)+" · ";
        else if (Hidden[i].innerText === "English") ENGLISH = Hidden[i+1].innerText;
    }

    var SubSkills = Collated.split(" · ");
    for (i=0; i<SubSkills.length; i++) {
        if (Sifted.indexOf(' '+SubSkills[i]) == -1 && Sifted != '') Sifted.push(' '+SubSkills[i]);
    }

    SKILLS = Sifted.toString().substring(1);
    NAME = document.querySelector(".text-heading-xlarge").innerText
    LINK = document.URL;
}

function SylphBack(response, xsndstatus) {
    if (xsndstatus == 200) {
        var STATUS = "✅ ";
        console.log(response);
        if (response.includes("DUPLICATE")) STATUS = "⚠️ DUPLICATE! "
        alert(STATUS+NAME+"\nPosition: "+POSITION+"\nSkills: "+SKILLS+"\nEnglish: "+ENGLISH)
        chrome.runtime.sendMessage({SpellCasted: true}); // Resets the extension icon to show the job is completed!
    }
    else {
        alert("⛔ ERROR!\nStatus: "+xsndstatus+"\nSylph didn't find her way home!");
        chrome.runtime.sendMessage({SpellCasted: false}); // To show a different icon indicating something's wrong...
    }
}

chrome.runtime.onMessage.addListener((request, sender) => {
    console.log('🧚‍♀️ Sylph!', request);
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
                if (XSnd.status === 0 || (XSnd.status >= 200 && XSnd.status <= 299)) SylphBack(XSnd.response, XSnd.status);
                else {
                    alert("⛔ ERROR!\nStatus: "+XSnd.status+"\nSylph didn't find her way home!");
                    chrome.runtime.sendMessage({SpellCasted: false}); // To show a different icon indicating something's wrong...
                }
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

