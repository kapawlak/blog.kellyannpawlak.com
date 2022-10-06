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

function processstyles(){
  
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ]
  })  
  modal_img()
  replace_tags()
  if (linkfile == "Home"){
    // importDirData()
  }else{
    tableOfContents('[data-toc]', '[data-content]')
  }
    
  table_list=document.querySelectorAll('.Table table')

  
  for (i = 0; i < table_list.length; i++) {
    table_list[i].setAttribute('class', 'table table-striped')
  }
  

 

  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  
    return new bootstrap.Popover(popoverTriggerEl, {
      trigger: 'focus'
    }) })

    document.querySelectorAll('.Code p').forEach(el => {
      // then highlight each
      hljs.highlightElement(el);
    });
    
}



function replace_tags() {
    var text = document.querySelectorAll(' #maincontent >*:not(code):not(pre)')
    text.forEach( (t) => {
     
      emojified = t.innerHTML.replace(/(\@)(.{2})(-)(.*?)(\@)/g, `<i class='$2 $2-$4'></i>`)
      t.innerHTML = emojified
  
      fnoted = t.innerHTML.replace(/\[fn\](.*?)\[\/fn\]/g, 
      `<span class= 'mytooltip' tabindex="0"><sup>]</sup>
      </span><span class ='tooltiptext'>$1</span>`)
      t.innerHTML = fnoted
  
      checked = t.innerHTML.replace(/\[c\]/g, "<input type= 'checkbox'>")
      t.innerHTML = checked
     
      popper=t.innerHTML.replace(/(;;;)(.*?)(;;;)/g,` 
      <a tabindex="0" class=" text-primary p-0 m-0 align-top" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="$2" style='text-indent:0px;'><i class="bi bi-question-square-fill"></i></a>`)
      t.innerHTML = popper
      
      tabs=t.innerHTML.replaceAll('!!!T!!!','      ')
      t.innerHTML=tabs

      quick_math(t)
      
      
      
    })
    

    var links = document.querySelectorAll('#maincontent a')
    for (i = 0; i < links.length; i++) {
      if( links[i].innerHTML ==''){

      links[i].innerHTML ='Invalid Link'
      var link_id = links[i].getAttribute("href").replace('#','');

      let link_ref= document.getElementById(link_id)
  
      if(link_ref){
      links[i].innerHTML = `${link_ref.dataset.type} ${link_ref.dataset.kiwi}`}
      }
    }


    

 
  }
  



function scrolltohash(){
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (window.location.hash && isChrome) {
            setTimeout(function () {
                var hash = window.location.hash;
                window.location.hash = "";
                window.location.hash = hash;
            }, 300);
          }
        }




function emergency_reload_iframes(){
  iframes= document.getElementsByTagName('iframe')
  for (i=1;i < iframes.length; i++){
  iframes[i].src=iframes[i].src
  }
}

