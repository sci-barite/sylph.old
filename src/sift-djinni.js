// The most straightforward of the three.

function SiftDjinni(position) {
    NAME = document.querySelector("#candidate_name")?.innerText;
    ENGLISH = document.querySelector(".inbox-thread-candidate-info")?.innerText;
    SKILLS = document.querySelector(".inbox-candidate-details--title")?.innerText.split(",")[0]+" "+ENGLISH.split(" · ")[0];
    ENGLISH = ENGLISH.split(" · ")[1];
    RATE = document.querySelector(".inbox-candidate-details--title")?.innerText.split(",")[1];
    if (document.querySelector(".page-header")?.innerText.split("›")[0].includes("Inbox")) POSITION = position;
    else POSITION = document.querySelector(".page-header")?.innerText.substring(11).split("›")[0];
    LOCATION = document.querySelector(".page-header")?.innerText.substring(11).split(', ')[2];
    LINK = document.URL;
}