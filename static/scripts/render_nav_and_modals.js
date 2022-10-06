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

const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
var dateObj = new Date();
var month =monthNames[ dateObj.getMonth]; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();


let sitedata
let MonthList = document.getElementById('MonthList')
let TitleList = document.getElementById('TitleList')
let currmonth = month+String(year).slice(2)




///Initiate the top navigation page and the links.
function init_nav(linkfile) {

  fetch("index.json?v=" + Math.floor(Math.random() * 100000))
    .then(response => {
      return response.json();
    })
    .then(data => stash(data));
  function stash(data) {
    sitedata = data;
    includeHTML(linkfile);


    Object.keys(sitedata['page-links']).forEach((link) => {
      if (link != 'Home.md'  && link !='index.md') {
        var my_button = Object.assign(NewNode('a'), { classList: "dropdown-item", innerHTML: `${link}`, href: "#" })
        my_button.setAttribute('data-bs-toggle', `collapse`)
        my_button.setAttribute('data-bs-target', `#collapse${link}`)

        MonthList
          .appendChild(Object.assign(NewNode('li')))
          .appendChild(my_button)
          .parentNode
          .appendChild(NewNode('li'))
          .appendChild(NewNode('hr', ["dropdown-divider"]))
          .parentNode
          .parentNode

          my_button.addEventListener('click', function (e) {
            currmonth=link
            document.getElementById('dropdown-month').innerText=link
            updateTitleList()
      })
        
      }
    })



  }

  //     PageList
  //     .appendChild(NewNode('li'))
  //     .appendChild(Object.assign(NewNode('a'), {classList: "dropdown-item", href: `?linkfile=${link["file"]}`, innerHTML: link }))
  //     .parentNode
  //     .parentNode
  //     .appendChild(NewNode('li'))
  //     .appendChild(NewNode('hr',["dropdown-divider"]))
  //     .parentNode
  //     .parentNode}
  // } )


}






function updateTitleList() {
  var titledata = sitedata['page-links'][currmonth]
  TitleList.innerHTML = ""

  console.log(titledata)
  Object.keys(titledata).forEach((data) => {

      console.log(data)
      var my_button = Object.assign(NewNode('a'), { classList: "dropdown-item", innerHTML: `${titledata[data]}`, href: `?linkfile=${currmonth}/${data}` })

      my_button.addEventListener('click', function (e) {
        currmonth=link
        document.getElementById('dropdown-title').innerText=titledata[data]
  })


      TitleList
        .appendChild(Object.assign(NewNode('li')))
        .appendChild(my_button)
        .parentNode
        .appendChild(NewNode('li'))
        .appendChild(NewNode('hr', ["dropdown-divider"]))
        .parentNode
        .parentNode
    


  })

}

var infoModal = document.getElementById('infoModal')
infoModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget
  // Extract info from data-bs-* attributes
  var recipient = button.getAttribute('data-name')
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  var modalTitle = infoModal.querySelector('.modal-title')
  var modalBodyInput = infoModal.querySelector('.modal-body')

  modalTitle.innerHTML = `Contact <span class='text-CQ-seagreen'>${recipient}</span>`

  modalBodyInput.innerHTML = ''
  let color
  if (button.getAttribute('data-title') == "Quantum Applications Engineer") {
    color = "primary"
  } else {
    color = "danger"
  }

  if (button.getAttribute('data-img')) {
    modalBodyInput.innerHTML += `
    <img src="${button.getAttribute('data-img')}" class="img-fluid rounded" style="max-height:200px;"></img>
    <br>
    <br>
    `
  }

  modalBodyInput.innerHTML +=
    `<strong>${recipient}</strong> 
    <br>
    <small class="text-muted pronoun">${button.getAttribute('data-pronouns')}</small>
    <br>
   <span class="badge bg-${color}" style="font-size: 12pt">${button.getAttribute('data-title')}</span>
   <hr>`

  if (button.getAttribute('data-email') != 'undefined') {
    modalBodyInput.innerHTML += `
  <b>Email:</b> <br>
  <a href="mailto:${button.getAttribute('data-email')}">${button.getAttribute('data-email')}</a>
  <br><hr>
  `}
  if (button.getAttribute('data-location') != '' && button.getAttribute('data-location') != 'undefined' && button.getAttribute('data-location') != null) {
    modalBodyInput.innerHTML += `
    
  <b>Location:</b> <br>
  ${button.getAttribute('data-location')}

  `}

})

var imgModal = document.getElementById('imgModal')
imgModal.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  var image = event.relatedTarget
  // Extract info from data-bs-* attributes
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  var modalBodyInput = imgModal.querySelector('.modal-body')


  modalBodyInput.innerHTML = `
  <img src="${image.getAttribute('src')}"  alt="${image.getAttribute('alt')} width="100%" style="max-width:100%"></img>
  <hr>
  <p id= "modal_cap">
  ${image.getAttribute('title')}
  </p>
  `

  quick_math(document.getElementById('imgModal'))
})


function modal_img() {
  imgs = document.querySelectorAll("img")
  for (i = 0; i < imgs.length; i++) {
    if (!imgs[i].classList.contains('NoClick')){
    imgs[i].setAttribute('data-bs-toggle', "modal")
    imgs[i].setAttribute('data-bs-target', "#imgModal")
    if (imgs[i].getAttribute('title') && !imgs[i].classList.contains('NoShow')) {
      imgs[i].outerHTML += imgs[i].getAttribute('title')
    }}
  }
}


window.document.onload = function (e) {
  console.log("document.onload", e, Date.now(), window.tdiff,
    (window.tdiff[0] = Date.now()) && window.tdiff.reduce(fred));
}



////////////////////// Utility

function ListMembers(dictionary, groupdiv) {
  dictionary.forEach((member) => {
    member['name'] = member['first-name'] + ' ' + member['last-name']
    member['bs-toggle'] = 'modal'
    member['bs-target'] = "#infoModal"
    button = groupdiv
      .appendChild(NewNode('div', ["dropdown-item", "text-center", "py-1"]))
      .appendChild(Object.assign(NewNode('div', ["col-sm-12", "nav-links", "lead"]), { innerHTML: `${member['first-name']} ${member['last-name']}` }))
      .parentNode
      .appendChild(NewNode('div', ["row", "bg-CQ-lightgray", "p-1"]))
      .appendChild(Object.assign(NewNode('a', ["col"]), { href: "mailto:${email}", innerHTML: `<i class="bi bi-envelope-fill px-1"></i>` }))
      .parentNode
      .appendChild(Object.assign(NewNode('button', ['btn', 'col', 'px-1', 'py-0']), { innerHTML: `<i class="bi bi-info-circle text-primary"></i></button>` }))

    Object.keys(member).forEach((datum) => { button.setAttribute(`data-${datum}`, member[datum]) })

  })
}

function NewNode(tag, classList = null) {
  let this_node = Object.assign(document.createElement(tag));

  if (Array.isArray(classList)) {
    classList.forEach((e) => { this_node.classList.add(e) });
  }

  return this_node
}



function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}



function quick_math(t) {

  renderMathInElement(t, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ]
  })
}




// let dropdowns = document.querySelectorAll('.dropdown-toggle')
// dropdowns.forEach((dd)=>{
//     dd.addEventListener('click', function (e) {
//         var el = this.nextElementSibling
//         el.style.display = el.style.display==='block'?'none':'block'
//     })
// })