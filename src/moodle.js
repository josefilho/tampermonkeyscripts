// ==UserScript==
// @name         Link Blank
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open all links with target blank
// @author       NullByte
// @include      http://ead.uems.br/moodle/course/*
// ==/UserScript==

function checkIfAvailableToOpen(link) {
  const icon = link.firstElementChild.getAttribute("src");
  if (icon.search("url") !== -1 || icon.search("pdf") !== -1 || icon.search("bmp") !== -1){
    return true;
  }
  return false;
}

(function() {
  'use strict';
  const links = document.getElementsByClassName("aalink");
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    link.removeAttribute("onclick");
    if ( checkIfAvailableToOpen(link) ) {
      link.addEventListener("click", e => {
        e.preventDefault();
        const documentOpened = window.open(link.getAttribute("href"), '_blank');
        console.log("Waiting for document to be loaded...");
        let check = setInterval(() => {
          if (documentOpened.document.body.innerText !== '') {
            clearInterval(check);
            console.log("Document loaded!");
            const content = documentOpened.document;
            documentOpened.close();

            const urlWorkContent = content.getElementsByTagName("a");
            if (urlWorkContent.length > 0) {
              const linksToOpen = [];
              for (let i = 0; i < urlWorkContent.length; i++) {
                const link = urlWorkContent[i];
                if (link.href && link.getAttribute("onclick") && link.getAttribute("onclick").includes("window.open")) {
                  linksToOpen.push(link);
                  link.setAttribute("onclick", '');
                }
              }
              if (linksToOpen.length > 1) {
                alert("Há mais de um link para abrir aqui!");
              } else {
                linksToOpen[0].setAttribute("target", "_blank");
                linksToOpen[0].click();
              }
            }
          }
        }, 5);
      });
    }
    else {
      link.setAttribute("target", "_blank");
    }
  }
})();