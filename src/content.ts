var [POSITION, LINK, NAME, RATE, SKILLS, ENGLISH, LOCATION, MORE] = ['Angular', '', 'NA', '', 'NA', 'NA', '', ''];

function SiftLinked(position) {
    var Sifted: Array<string> = [];
    for (var i=0; i<3; i++) {
        Sifted.push(' '+
        (document.querySelectorAll("a[data-field='skill_card_skill_topic']")[i] as HTMLElement).innerText.split("\n")[0]);
    }

    const Hidden = document.querySelectorAll(".visually-hidden");
    var Collated = " · ";
    for (i=0; i < Hidden.length; i++) {
        let String: string = (Hidden[i] as HTMLElement).innerText;
        if (String.includes("Skills:") && String.includes("·")) 
            Collated = Collated+String.substring(8)+" · ";
        else if (String === "English") ENGLISH = (Hidden[i+1] as HTMLElement).innerText;
    }

    var SubSkills = Collated.split(" · ");
    for (i=0; i<SubSkills.length; i++) {
        if (Sifted.indexOf(' '+SubSkills[i]) == -1 && Sifted[i] != '') Sifted.push(' '+SubSkills[i]);
    }

    SKILLS = Sifted.toString().substring(1);
    NAME = (document.querySelector(".text-heading-xlarge") as HTMLElement).innerText
    POSITION = position;
    LINK = document.URL;
} 

function SiftDjinni(position) {
    NAME = (document.querySelector("#candidate_name") as HTMLElement).innerText;
    ENGLISH = (document.querySelector(".inbox-thread-candidate-info") as HTMLElement).innerText;
    SKILLS = (document.querySelector(".inbox-candidate-details--title") as HTMLElement).innerText;
    RATE = SKILLS.split(",")[1];
    SKILLS = SKILLS.split(",")[0]+" "+ENGLISH.split(" · ")[0];
    ENGLISH = ENGLISH.split(" · ")[1];
    if ((document.querySelector(".page-header") as HTMLElement).innerText.split("›")[0].includes("Inbox")) 
         POSITION = position;
    else POSITION = (document.querySelector(".page-header") as HTMLElement).innerText.substring(11).split("›")[0];
    LOCATION = (document.querySelectorAll("li.inbox-candidate-details--item")[2] as HTMLElement).innerText.split('\n')[1];
    LINK = document.URL;
}

function SiftUpwork(url) {
    LINK = url;
    var Sifted: Array<string> = [];
    var SubSkills: Array<string> = [];
    if (url.includes("proposal")) {
        const Container = document.querySelector(".up-slider");

        NAME = (Container?.querySelectorAll(".d-inline")[0] as HTMLElement).innerText.trim();
        LOCATION = (Container?.querySelectorAll(".d-inline-block")[3] as HTMLElement).innerText;
        RATE = (Container?.querySelectorAll(".d-inline")[0] as HTMLElement).innerText.trim();

        const Skills = (Container?.querySelectorAll(".skills") as NodeList)

        if (Skills[0]) { // It's inconsistent: sometimes it's 0, sometimes 1. Length is key.
            SubSkills = (Skills[0] as HTMLElement).innerText.split("\n");
            if (SubSkills.length > 20 && Container?.querySelectorAll(".skills")[1]) 
                SubSkills = (Skills[1] as HTMLElement).innerText.split("\n");
            for (var i=0; i<SubSkills.length; i++) if (!SubSkills[i].includes("Skills")) Sifted.push(' '+SubSkills[i]);
        }
        else if (Container?.querySelectorAll("div[data-test='ontology-attribute-group-tree-viewer-wrapper'")[1]) {
            SubSkills = 
            (Container.querySelectorAll("div[data-test='ontology-attribute-group-tree-viewer-wrapper'")[1] as HTMLElement).innerText.split("\n")
            for (i=0; i<SubSkills.length; i++) 
                if (!SubSkills[i].includes("Skills") && !SubSkills[i].includes("Development") && !SubSkills[i].includes("Business"))
                    Sifted.push(' '+SubSkills[i]);
        }
        else Sifted.push(' ERR: Could not parse any skill!');
        SKILLS = Sifted.toString().substring(1);
        
        POSITION = (Container?.querySelectorAll(".break")[0] as HTMLElement).innerText.trim();
        ENGLISH = (Container?.querySelectorAll("div[data-test='language'")[0] as HTMLElement).innerText.split(":")[1].trim()
        MORE = (Container?.querySelector("a.d-block") as HTMLElement).toString().substring(12) // Keeping it shorter to avoid GET limits...
    }
    else {
        NAME = (document.querySelectorAll(".d-inline")[0] as HTMLElement).innerText.trim();
        LOCATION = (document.querySelectorAll(".d-inline-block")[3] as HTMLElement).innerText;
        RATE = (document.querySelectorAll(".d-inline")[1] as HTMLElement).innerText.trim();

        SubSkills = (document.querySelectorAll(".skills")[0] as HTMLElement).innerText.split("\n");
        for (i=0; i<SubSkills.length; i++) if (!SubSkills[i].includes("Skills")) Sifted.push(' '+SubSkills[i]);
        SKILLS = Sifted.toString().substring(1);

        if (document.querySelectorAll(".up-card")[3].querySelector("em.break"))
            POSITION = (document.querySelectorAll(".up-card")[3].querySelector("em.break") as HTMLElement).innerText;
        else POSITION = (document.querySelectorAll("h2.mb-0")[1] as HTMLElement).innerText.trim();

        const lists = document.querySelectorAll(".list-unstyled");
        ENGLISH = (lists[1].querySelector("span.d-inline-block") as HTMLElement).innerText
    }
}

function SylphBack(response, status) {
    if (status == 200) {
        var STATUS = "✅ ";
        console.log(response);
        if (response.includes("DUPLICATE")) STATUS = "⚠️ DUPLICATE! "
        alert(STATUS+NAME+"\nPosition: "+POSITION+"\nSkills: "+SKILLS+"\nEnglish: "+ENGLISH)
        chrome.runtime.sendMessage({SpellSuccessful: true}); // Resets the extension icon to show the job is completed!
    }
    else {
        alert("⛔ ERROR!\nStatus: "+status+"\nSylph didn't find her way home!");
        chrome.runtime.sendMessage({SpellSuccessful: false}); // Update icon to show something's wrong...
    }
}

chrome.runtime.onMessage.addListener((request, sender) => {
    console.log('🧚‍♀️ Sylph!', request);
    if (request.name == 'Sylph') {
        switch (request.site.substring(12,18)) {
            case "linked": SiftLinked(request.position); break;
            case "ni.co/": SiftDjinni(request.position); break;
            case "upwork": SiftUpwork(request.site); break; // The function should check if it's a profile or proposal page!
            default: alert(request.site.substring(12,18)+": Can't read website name!"); return;
        }
        SKILLS = SKILLS.replace("++", "➕➕"); // Call it "escaping" the string...
        POSITION = POSITION.replace("+", "➕");
        const XSnd = new XMLHttpRequest();
        XSnd.onreadystatechange = () => {
            if (XSnd.readyState === XMLHttpRequest.DONE) {
                if (XSnd.status === 0 || (XSnd.status >= 200 && XSnd.status < 400)) SylphBack(XSnd.response, XSnd.status);
                else {
                    alert("⛔ ERROR!\nStatus: "+XSnd.status+"\nSylph didn't find her way home!");
                    chrome.runtime.sendMessage({SpellSuccessful: false}); // Update icon to show something's wrong...
                }
            }
         }
        XSnd.open('GET', // Probably better to replace it with POST at some point, but for now this works well.
        'https://script.google.com/macros/s/AKfycbyZb43hadRmFpjDg1ynHnY31z6yIPT0tzaSbNMBNcBB76dfPWCssOXFTfwXRVGGzrZ0/exec?'+
        'name='+NAME+'&pos='+POSITION // Now it can even be the bookmark's folder, as per the original idea!
        +'&skills='+SKILLS+'&eng='+ENGLISH+'&rate='+RATE+'&loc='+LOCATION+'&url='+LINK+'&more='+MORE,
        true);
        XSnd.send();
    }
});

