// ==UserScript==
// @name         AryionPlugins
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  A simple script for easy viewing of artwork and comics.
// @license      MIT
// @author       OlehNoskov
// @homepage     https://github.com/OlehNoskovCPU/AryionPlugins
// @match        https://aryion.com/g4/view/*
// @include      https://aryion.com/g4/view/*
// ==/UserScript==

// Many thanks to Vore Witch for helping with the script!

var index, len;

const DownloadComicPage = async () => {
    const downloadLink = getDownloadLink()
    const image = await (await fetch(downloadLink)).blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(image);
    const title = (document.getElementsByClassName('user-link')[1]).textContent+" - "+(document.getElementsByClassName('g-box-title')[1]).textContent+"._.";
    link.download = title;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

const DownloadComics = async () =>{
    let i = Number(document.getElementById("PagesComics").value);
    if (i > 0){
        localStorage.setItem('I', i);
        await DownloadComicPage();
        getNextButton().click()
    }
}

const getDownloadLink = () => {
     const button = document.querySelectorAll("div > a");
     len = button.length
     for (index = 0; index < len; ++index){
         if(button[index].innerText == "Download"){
             return button[index].href;
         }
     }
}

const getNextButton = () => {
     const button = document.getElementById("next-link")
     if (button == null){
          const buttons = document.querySelectorAll("div > a");
          for (let i = 0; i < buttons.length - 1; i++){
              if(buttons[i].innerHTML == "Next &gt;"){
               return buttons[i];
              }
          }
      }
    return button
}



document.addEventListener('keydown', function(event) {
  let button = null;
  if( event.target.nodeName == "INPUT" || event.target.nodeName == "TEXTAREA" ) return;
  if (event.code == 'ArrowRight') {
      button = getNextButton()
  }
  else if (event.code == 'ArrowLeft'){
     button = document.getElementById("prev-link")
      if (button == null){
          button = document.querySelectorAll("div > a");
          len = button.length
          for (index = 0; index < len; ++index){
              if(button[index].innerHTML == "&lt; Prev"){
               button = button[index];
                  break;
              }
          }
      }
  }
  else if (event.shiftKey && event.keyCode == 68){
      void DownloadComicPage();
  }
  else if (event.shiftKey && event.keyCode == 70) {
     button = document.getElementById("fav-link")
  }
  if(button){
     button.click();
  }
});


const input = document.createElement("input");
input.type = "number";
input.value = localStorage.getItem("I");
input.id = "PagesComics";
let fragment = document.getElementsByClassName('func-box')[0];
fragment.appendChild(input);
const buttoninput = document.createElement("input");
buttoninput.type = "button";
buttoninput.id = "BUTTONDOWN"
buttoninput.value = "Download";

fragment = document.getElementsByClassName('func-box')[0];
fragment.appendChild(buttoninput);

document.getElementById('BUTTONDOWN').onclick = async () => {
   await DownloadComics();
};

const blockPage = () => {
    const waitBanner = document.createElement('div');
    waitBanner.setAttribute('style', 'z-index: 999999999; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #00000055; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 300%; text-shadow: 0 0 25px #000')
    waitBanner.innerText = 'Wait please, comic is downloading...'
    waitBanner.id = "BlockPage";
    document.querySelector('html').setAttribute('style', 'height: 100%; overflow: hidden')
    document.body.appendChild(waitBanner);
}

window.addEventListener('load', async () => {
    const nextButton = getNextButton();
    const pagesToDownload = localStorage.getItem('I');
    if (pagesToDownload > 1) {
        if (!nextButton || nextButton === null) {
        console.log(nextButton)
           localStorage.setItem("I", 0);
        } else {
            localStorage.setItem('I', pagesToDownload - 1);
        }
        if (nextButton) {
            blockPage();
        }
        console.log('a')
        await DownloadComicPage();
        nextButton.click()
    }
})
