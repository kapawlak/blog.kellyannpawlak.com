/*! 
Manual JS designed by Kelly Ann Pawlak 
Copyright (c) 2020 Kelly Ann Pawlak
Copyright (c) 2021 Kelly Ann Pawlak
Copyright (c) 2022 Kelly Ann Pawlak

This work is posted under the MIT License, you must keep the above attribution line.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


//Load markdown it and container plugin
var md = window.markdownit()
md.set({ html: true, javascript: true, code:false })
var container = window.markdownitContainer;

//Rendererfunc
function doRendering(md_text) {

 var markdown = md_text;
 return md.render(markdown);
}

// Parse Markdown
function includeHTML(filenum = linkfile) {
    var z, xhttp;
    var rand = Math.floor(Math.random() * 100000) //gennerate a random number to append to prevent cache of markdown file
    /*loop through a collection of all HTML elements:*/
    z = document.getElementById("maincontent");
    var fname=""; var fext=""
    if((filenum.split(".")).length>1){
        fname=filenum.split(".")[0]
        fext='.'+filenum.split(".")[1]
    }else{
        fname=filenum
        fext=".md"
    }

    file =  "pages/"+fname + fext + '?v=' + rand;
    if (file) {
        /*make an HTTP request using the attribute value as the file name:*/
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) { z.innerHTML =  doRendering(this.responseText);  processstyles();}
                if (this.status == 404) { z.innerHTML = `
                <h1 id='part0'>This page does not exist.</h1><br> 
                <center> If you believe this is a mistake, try a hard refresh with Ctrl + Shift +R </center>`; }

                /*remove the attribute, and call this function once more:*/
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /*exit the function:*/
        return;
    }

};




