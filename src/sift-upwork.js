// The longest of the three, because it can do two different kinds of pages.

function SiftUpwork(url) {
    LINK = url;
    var [Sifted,SubSkills] = [ [],[] ];
    if (url.includes("proposal")) {
        const Container = document.querySelector(".up-slider");

        NAME = Container.querySelector(".d-inline").innerText.trim();
        LOCATION = Container.querySelectorAll(".d-inline-block")[3].innerText;
        RATE = Container.querySelectorAll(".d-inline")[1].innerText.trim();

        if (Container.querySelectorAll(".skills")[0]) { // It's inconsistent: sometimes it's 0, sometimes 1. Length is key.
            SubSkills = Container.querySelectorAll(".skills")[0].innerText.split("\n");
            if (SubSkills.length > 20 && Container.querySelectorAll(".skills")[1]) 
                SubSkills = Container.querySelectorAll(".skills")[1].innerText.split("\n");
            for (i=0; i<SubSkills.length; i++) if (!SubSkills[i].includes("Skills")) Sifted.push(' '+SubSkills[i]);
        }
        else if (Container.querySelectorAll("div[data-test='ontology-attribute-group-tree-viewer-wrapper'")[1]) {
            SubSkills = Container.querySelectorAll("div[data-test='ontology-attribute-group-tree-viewer-wrapper'")[1].innerText.split("\n")
            for (i=0; i<SubSkills.length; i++) 
                if (!SubSkills[i].includes("Skills") && !SubSkills[i].includes("Development") && !SubSkills[i].includes("Business"))
                    Sifted.push(' '+SubSkills[i]);
        }
        else Sifted.push(' ERR: Could not parse any skill!');
        SKILLS = Sifted.toString().substring(1);
        
        POSITION = Container.querySelectorAll(".break")[0].innerText.trim();
        ENGLISH = Container.querySelectorAll("div[data-test='language'")[0].innerText.split(":")[1].trim()
        MORE = Container.querySelector("a.d-block").toString().substring(12) // Keeping it shorter not to exceed GET limits...
    }
    else {
        NAME = document.querySelectorAll(".d-inline")[0].innerText.trim();
        LOCATION = document.querySelectorAll(".d-inline-block")[3].innerText;
        RATE = document.querySelectorAll(".d-inline")[1].innerText.trim();

        SubSkills = document.querySelectorAll(".skills")[0].innerText.split("\n");
        for (i=0; i<SubSkills.length; i++) if (!SubSkills[i].includes("Skills")) Sifted.push(' '+SubSkills[i]);
        SKILLS = Sifted.toString().substring(1);

        if (document.querySelectorAll(".up-card")[3].querySelector("em.break"))
            POSITION = document.querySelectorAll(".up-card")[3].querySelector("em.break").innerText;
        else POSITION = document.querySelectorAll("h2.mb-0")[1].innerText.trim();

        const lists = document.querySelectorAll(".list-unstyled");
        ENGLISH = lists[1].querySelector("span.d-inline-block").innerText
    }
}