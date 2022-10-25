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

//Reference Objects
var COUNTER = {}; //This keeps track of the number of each element and their reference name
var DIVHEAD = []; //This list lets us print out the headers for custom classes
var DIVFOOT = []; //This list lets us print ou the footers of custom classes using first-in-first-out when there are nested containers
const KATEXMAP = new Map(); //saves key pairs for retreiving latex in blurbs

//Class Groups
const fig_group = "justify-content-center text-center px-0 mx-3 mb-4" //Formatting that is special for figues -- adds margins to floated figs
const narrow_center = "col-lg-9 mx-auto my-5"
const blurb_center = "col-lg-8 mx-auto"
const collapsable_header = ' fs-4 align-bottom'


class Card{
  constructor(type, ref) {
    //Correct for non-alphanumeric
    ref=(ref||'').replace(/[^a-zA-Z0-9-_]/g,'')
    //Static
    this.type=type
    
    this.number= updateCounter(ref,type)
    this.ref= type + '-' + (ref||this.number)  
    this.id = type + this.number;

    //Mutable -- can be set in the calling routine below
    this.collapse=false
    this.headerText=''
    this.footerText=''
    this.styleList=[type, 'card']
    //   innerStyles=[heading classes   , body container classes , body text classes, footer classes]
    this.innerStyles=['text-center my-0', 'text-left'            , 'px-2'           , 'text-center' ]
    
    //Apply certain styles depending on card type
    switch(type)
    {
      case 'Intro':
        this.styleList.push(narrow_center, 'my-2','col-lg-11')
        this.innerStyles[1]='text-center'
        break
        case 'Quote':
          this.styleList.push(narrow_center, 'my-5','col-lg-11')
          this.innerStyles[1]='text-center, lead'
          break
      case 'Instruction':
        this.collapse=false
        this.headerText=``
        this.styleList.push(narrow_center, 'my-2')
        this.collapse=true
        break
      case 'Equation':
        this.footerText= `Equation ${this.number}`
        this.styleList.push(narrow_center)
        break
      case 'Figure':
        this.footerText= 'Figure ' + this.number
        this.styleList.push(fig_group)
        break
      case 'Code':
        this.styleList.push('col-lg-10', 'mx-auto', 'my-3', 'px-0')
        this.innerStyles[1]+=' mt-5, mx-0, px-0 '
        break
      case 'Video':
        this.styleList.push('col-lg-8', 'mx-auto', 'my-4')
        this.innerStyles[1]+=' ratio ratio-16x9'
        this.footerText= `Video ${this.number}`
        break
      case 'Note':
        this.styleList.push('mx-auto', 'my-4', 'col-8 bg-gradient')
        this.innerStyles[1]='text-center'
        this.headerText = '<i class="fa fa-thumb-tack fs-1" aria-hidden="true"></i>'
        break
      case 'Warning':
        this.styleList.push(' mx-auto bg-danger bg-gradient alert alert-warning  fade show hshaker')
        this.innerStyles= ['text-center text-light', 'text-center text-light fs-2', 'px-2' , 'text-center']
        this.headerText='<i class="fa fa-exclamation-triangle fs-1 rotor" aria-hidden="true"></i> '
        this.footerText='<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="bottom:0px!important; position:relative!important"></button>'
        break
      case 'Definition':
        this.styleList.push('')
        this.innerStyles[0]='text-left'
        this.headerText=`<span class='lead' > Definition: </span>`
        break
      case 'Table':
        this.styleList.push('')
        this.innerStyles[0]='text-left'
        this.footerText= 'Table ' + this.number 
        break
      case 'Hider':
        this.collapse=true
        this.styleList.push(narrow_center)
        this.innerStyles[0]+= ' fs-5 align-bottom text-left'
        break
      case 'Activity':
        this.collapse=true
        this.headerText= `<div class= ' container-fluid row justify-content-start'> <div class='col-lg-12'> <strong>Activity  </strong></div>`
        this.styleList.push('col-lg-11 my-5 mx-auto')
        this.innerStyles[0]+=collapsable_header
        break
      case 'Simulation':
        this.collapse=true
        this.headerText= `<div class= ' container-fluid row justify-content-start'> <div class='col-lg-12'> Simulation ${this.number} `
        this.styleList.push('col-lg-11 my-5 mx-auto')
        this.innerStyles[0]+= collapsable_header
        break
      case 'Card':
        this.styleList.push(narrow_center)
        break
      case 'Drop':
        this.collapse=true
        this.styleList.push(narrow_center)
        this.innerStyles[0]+= collapsable_header
        break
      case 'Prelab':
        this.styleList.push(blurb_center)
        this.headerText=`<i class="bi bi-journal-text"></i><strong> Prelab Assignment</strong> <i class="bi bi-journal-text"> </i>`
        break
      case 'Quiz':
        this.styleList.push(blurb_center, 'my-5')
        this.innerStyles[1]='text-center'
        this.headerText=`<i class="bi bi-check2-circle fs-2"></i> Your Understanding `
        break
    } 
  }

  publishCard (){ 
    this.collapse ?  classAcc(this) : classCard(this);    
  }

 }

function classCard(c) {
  DIVHEAD.push(`
  <div id="${c.ref}" 
    class="${[c.styleList.join(' ')]} " 
    data-kiwi="${c.number}" 
    data-type="${c.type}"> 
    ${c.headerText == '' || c.headerText == null ? '' :
      `<div class="card-header">
      <div class="${c.innerStyles[0]}">
        ${c.headerText}
      </div>
    </div>`}

    <div class="container ${c.innerStyles[1]}">
      <div class="card-text card-body ${c.innerStyles[2]}">
    `)

  DIVFOOT.push(`
      </div>
    </div>
    ${(c.footerText == '' || c.footerText == null ? '' :
      `<div class="card-footer">
      <div class="my-0 ${c.innerStyles[3]} ">
        ${c.footerText}
      </div>
    </div>`)}
    </div>`)
 c= null
}

function classAcc(c) {

  DIVHEAD.push(`
  <div id="${c.ref}" 
    class="accordion accordion-flush card col-card ${[c.styleList.join(' ')]} " 
    data-kiwi="${c.number}" 
    data-type="${c.type}"> 
    <div class="accordion-item ">
        <button 
          class="accordion-button collapsed ${c.innerStyles[0]}" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#${c.id}" 
          aria-expanded="false" 
          aria-controls="${c.id}">
            ${c.headerText}
        </button>
        <div id="${c.id}" 
        class="accordion-collapse collapse card-text ${c.styleList[1]}" 
        aria-labelled-by="${c.id}" data-bs-parent="#${c.ref}">
          <div class="accordion-body container">
    `)

  DIVFOOT.push(`
          </div>
        </div>
      </div>
    </div>`)
 c=null
}


//////////////// CUSTOM CONTAINER DEFS
///Full////
md.use(container, 'Full', {
// Input Format is: 
// Full (item 1 --- note 1|item 2 --- note 2|...)
  render: function (tokens, idx) {
    let args
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Full(.*)$/)[1]) //identifies the text that is not "Full", and identifies arguments seperated by a | 
      return full(args)
    } else {
      return ''
    }
  }
})

///INTRODUCTION////
md.use(container, 'Intro', {  
  // Input Format is:
  // Intro (Heading Line|material 1 --- comment|material 2 --- comment| ...)
  render: function (tokens, idx) {   
    if (tokens[idx].nesting === 1) {  
      args = strip(tokens[idx].info.trim().match(/^Intro(.*)$/)[1])
      let intro=new Card("Intro", args[0].replace(/[^a-zA-Z0-9]/g,''))
      intro.headerText=args[0]
      intro.footerText=(args.slice(1).length ? Full(args.slice(1)) : null)
      intro.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})


///Quote////
md.use(container, 'Quote', {  
  // Input Format is:
  // Intro (Heading Line|material 1 --- comment|material 2 --- comment| ...)
  render: function (tokens, idx) {   
    if (tokens[idx].nesting === 1) {  
      args = strip(tokens[idx].info.trim().match(/^Quote(.*)$/)[1])
      let intro=new Card("Quote", args[0].replace(/[^a-zA-Z0-9]/g,''))
      intro.headerText=args[0]
      intro.footerText=(args.slice(1).length ? Full(args.slice(1)) : null)
      intro.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///Quiz////
md.use(container, 'Quiz', {  
  // Input Format is:
  // Intro (Heading Line|material 1 --- comment|material 2 --- comment| ...)
  render: function (tokens, idx) {   
    if (tokens[idx].nesting === 1) {  
      args = strip_leave(tokens[idx].info.trim().match(/^Quiz(.*)$/)[1])
      let quiz=new Card("Quiz", args[0].replace(/[^a-zA-Z0-9]/g,''))
      quiz.publishCard()
      quizinner= quizzy(args.slice(1), quiz.ref)
      DIVFOOT[DIVFOOT.length-1]= quizinner  +DIVFOOT[DIVFOOT.length-1]
      console.log(quiz.ref)
      return `${DIVHEAD.pop()} `
    } else {
      return ` <hr>
      ${DIVFOOT.pop()}`
    }
  }
})

///Instruction///
md.use(container, 'Instruction', {
  // Input Format is: 
  // Instruction (reference-name)
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Instruction(.*)$/)[1])

      let ex = new Card('Instruction', args[0])
      ex.headerText+=  args[1] ? ` ${args[1]} ` : ''
      ex.styleList
      ex.innerStyles[3]+=' py-0'
      ex.styleList.push(' ' + args[2])
      ex.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///EQUATION///
md.use(container, 'Equation', {
  // Input Format is: 
  // Equation (reference-name, optional-header)
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Equation(.*)$/)[1])
      let eq = new Card('Equation', args[0])
      if(args[1]!= null && args[1]!=''){
      eq.headerText= md.render(args[1] )}
      eq.publishCard()    
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///Code
md.use(container, 'Code', {
// Input Format is: 
// Code (reference-name| optional-header)
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Code(.*)$/)[1])
      let code= new Card("Code", args[0])
      code.publishCard()

      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})
///

///VIDEO
md.use(container, 'Video', {
  // Input Format is: 
  // Video (reference-name| optional-header)
    render: function (tokens, idx) {
      let args;
      if (tokens[idx].nesting === 1) {
        args = strip(tokens[idx].info.trim().match(/^Video(.*)$/)[1])
        let vid= new Card("Video", args[0])
        vid.footerText+=( args[1]? ': ' + args[1] : '')
        vid.publishCard()
  
        return DIVHEAD.pop()
      } else {
        return DIVFOOT.pop()
      }
    }
  })
  ///


///NOTE
md.use(container, 'Note', {
// Input Format is: 
// Note (reference-name|width alignment)
  render: function (tokens, idx) {
    let args;

    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Note(.*)$/)[1])
      let note= new Card('Note', args[0])
      note.styleList.push(args[1] ? 'col-lg-' + args[1].replace("L","float-lg-start ").replace("R","float-lg-end") : 'col-lg-10 mx-auto' )
      note.publishCard()
 
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///WARNING
md.use(container, 'Warning', {
// Input Format is: 
// Warning (reference-name|optional-width)
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Warning(.*)$/)[1])
      let warn= new Card('Warning', args[0])
      warn.styleList.push(args[1] ? 'col-lg-' + args[1] : 'col-lg-5')
      warn.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///DEFINITION
md.use(container, 'Definition', {
  // Input Format is: 
  // Warning (optional-width)
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Definition(.*)$/)[1])

      let def= new Card("Definition", args[0])
      def.headerText+=`<span class=''>${args[0]} </span>`
      def.styleList.push(args[1] ? 'col-lg-' + args[1].replace("L","float-lg-start mt-0 mb-1 mx-3 ").replace("R","float-lg-end mt-0 mb-1 mx-3 ").replace("C","mx-auto my-4 ") : 'col-lg-10 mx-auto my-5' )
      def.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///PRELAB
md.use(container, 'Prelab', {
  // Input Format is: 
  // Warning (optional-width)
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Prelab(.*)$/)[1])

      let def= new Card("Prelab", args[0])

      def.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///TABLES
md.use(container, 'Table', {
  // Input Format is: 
  // Table (optional-ref|optional-title|width)
  render: function (tokens, idx) {
    let args;

    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Table(.*)$/)[1])
      let table=new Card("Table", args[0])
      table.styleList.push(args[2] ? 'col-lg-' + args[2].replace("L","float-lg-start mt-0 mb-1 mx-3 ").replace("R","float-lg-end mt-0 mb-1 mx-3 ").replace("C","mx-auto my-4 ") : 'col-lg-9 mx-auto my-5' )
     
      table.footerText+=( args[1]? ': ' + args[1] : '')
      table.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})
///




//////////////////////////////////////COLLAPSING
///Hider

md.use(container, 'Hider', {
  // Input Format is: 
  // Hider (optional-ref|title)
  render: function (tokens, idx) {
    let args
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Hider(.*)$/)[1])
      let hide= new Card('Hider', args[0] )
      hide.headerText=args[1]
      hide.publishCard()
      //card_maker_collapse('Hider', args[0], args[1], [group1, pad_mar].join(' '), inner_styles)
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})



///Activity
md.use(container, 'Activity', {
  // Input Format is: 
  // Activity (optional-ref|optional-title)
  render: function (tokens, idx) {
    let args
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Activity(.*)$/)[1])
      let Activity = new Card('Activity', args[0])
      Activity.headerText+= args[1] ?  `<div class='col-lg-12 text-left justify-content-start' > <span class='lead align-baseline' style="padding-left:0px"> ${args[1]} </span></div>` : ''
      Activity.headerText+='</div>'
      Activity.publishCard()
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})

///SIMULATION
md.use(container, 'Simulation', {
  // Input Format is: 
  // Simulation (optional-ref|optional-title)
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Simulation(.*)$/)[1])
      let sim= new Card('Simulation', args[0] )
      var title = 'Simulation #'
      if (args[1]) {
       sim.headerText+= `:<span class='lead' style="padding-left:10px"> ${args[1]} </span>`
      }
      sim.headerText+=`</div></div>`
      sim.publishCard()
      // card_maker_collapse('Simulation', args[0], title, [group1, pad_mar, args[2]].join(' '))
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})



///FIGURES: Complicated so use helper func/////////////
md.use(container, 'Figure', {
  // Input Format is: 
  // Figure (optional-ref|[size: xs, s, m, l, xl]|styles[R, L, Row])
  render: function (tokens, idx) {
    var args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^Figure(.*)$/)[1])
      fig = new Card('Figure', args[0])
      fig.styleList.push(args[1] || '')
      if (args[2]) {
        if (args[2].includes('Row')) {
          fig.styleList.push('mx-auto')
        } else if (!args[2].includes("L") && !args[2].includes("R")) {
          fig.styleList.push('mx-auto')
        }
      } else {
        fig.styleList.push('mx-auto')
      }

      fig.styleList.push(args[2] ? args[2].replace('Row', 'rowfig').replace('L', 'float-lg-start').replace('R', 'float-lg-end') : '')
      fig.publishCard()
      // card_maker('Figure', args[0], '', 'Figure #', [fig_group, extra, args[1]].join(' '), ['', 'text-center', ''])
      return DIVHEAD.pop()
    } else {
      return DIVFOOT.pop()
    }
  }
})


///Contact infor///
md.use(container, 'ContactTA', {
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^ContactTA(.*)$/)[1])
      return contacts("TAs")
    } else {
      return ''
    }
  }
})


md.use(container, 'ContactFA', {
  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^ContactFA(.*)$/)[1])
      return contacts("Faculty")
    } else {
      return ''
    }
  }
})






///GENERIC CARD

md.use(container, 'Card', {
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
    args = strip(tokens[idx].info.trim().match(/^Card(.*)$/)[1])
    
    let card = new Card('Card',args[0])
    card.headerText=args[1]
    card.footerText=args[2]
    card.styleList.push(args.slice(3))  
    card.publishCard()
    return DIVHEAD.pop()
    }else{
      return DIVFOOT.pop()
    }
  }
})


///GENERIC Accordion
md.use(container, 'Drop', {
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
    args = strip(tokens[idx].info.trim().match(/^Drop(.*)$/)[1])
    
    let drop = new Card('Drop',args[0])
    drop.headerText=args[1]
    drop.footerText=args[2]
    drop.innerStyles[0]+= ' ' + args.slice(3)  
    drop.publishCard()
    return DIVHEAD.pop()
    }else{
      return DIVFOOT.pop()
    }
  }
})
















////////////////////////////Utility Card Routines
//This counter
function updateCounter(ref, type){
  let this_count
  if (COUNTER[type]) {
    this_count= COUNTER[type].length + 1
    if (ref == '') {
      COUNTER[type].push([this_count, type+'-'+this_count])
    }else{
      COUNTER[type].push([this_count, type+'-'+ref])
    }
   ;
  } else {
    this_count=1
    COUNTER[type] = []
    
    if (ref == '') {
      COUNTER[type][0]=[this_count, type+'-'+this_count]
    }else{
      COUNTER[type][0]=[this_count, type+'-'+ref]
    }

  }

  return this_count
}








////Small Things

function strip_leave(m) {
  return md.utils.escapeHtml(m).trim().replace(/\((\(*(?:[^)(]*|\([^)]*\))*\)*)\)/g, "$1").split('|')

}

function strip(m) {
  // return md.utils.escapeHtml(m).trim().replace(/[()]/g, '').split('|')
  return md.utils.escapeHtml(m).trim().replace(/\((\(*(?:[^)(]*|\([^)]*\))*\)*)\)/g, "$1").split('|')
}



md.use(container, 'col', {

  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^col(.*)$/)[1])
      // opening tag
      return `<div class= "  align-items-end col-lg${args[0] ? (/\d/.test(args[0]) ? `-${args[0]}` : ` ${args[0]}`): ''}">`;
    } else {
      return '</div>'
    }
  }
});


md.use(container, 'row', {

  render: function (tokens, idx) {

    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^row(.*)$/)[1])
      // opening tag
      return `<div class="d-flex flex-row align-items-baseline ${args[0]}">`;
    } else {
      return '</div>'
    }
  }
});

md.use(container, 'center', {

  render: function (tokens, idx) {

    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^center(.*)$/)[1])
      // opening tag
      return `<div class="text-center">`;
    } else {
      return '</div>'
    }
  }
});
md.use(container, 'left', {

  render: function (tokens, idx) {

    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^left(.*)$/)[1])
      // opening tag
      return `<div class="text-left">`;
    } else {
      return '</div>'
    }
  }
});
md.use(container, 'right', {

  render: function (tokens, idx) {

    let args;
    if (tokens[idx].nesting === 1) {
      args = strip(tokens[idx].info.trim().match(/^right(.*)$/)[1])
      // opening tag
      return `<div class="text-right">`;
    } else {
      return '</div>'
    }
  }
});
















//////////////////Card making functions




/////////////////Uggly


function contacts(kind) {


  let role = ''
  let sectionhours, officehours, room
  let elmt =
    `<div class="row justify-content-center">
        <div id ="Contact${kind}" class="accordion accordion-flush card col-card Contact col-md-8 my-3 p-0" >
          <div class="accordion-item"> 
            <span class="my-0 accordion-header">
              <button class="accordion-button collapsed bg-KP-navy text-KP-orange" type="button" data-bs-toggle="collapse" data-bs-target="#Contact-${kind}" aria-expanded="false" aria-controls="Contact-${kind}">
               <div class="card-but"> Contact ${kind} of this Course</div>
              </button>
            </span>
            <div id="Contact-${kind}" class="accordion-collapse collapse card-text" aria-labelled-by="Contact-${kind}" data-bs-parent="#Contact${kind}">
              <div class="accordion-body  p-0">
       
    `
    sitedata[kind].forEach( (e)=> {
      sectionhours=''
      officehours=''
      room=''
    if (kind == "Management") {
      role = ` <li class="list-inline-item "><strong>Role:</strong> ${e["title"]} </li>`
    }
    if(e["officehours"]!='' && e["officehours"]!=  null){
      officehours=`<li class="list-inline-item "><strong>Office Hours:</strong> ${e["officehours"]}</li>`
    }
    if(e["sectionhours"]!='' && e["sectionhours"]!=  null){
      sectionhours=`<li class="list-inline-item "><strong>Section Hours:</strong> ${e["sectionhours"]}</li>`
    }  
    if(e["room"]!= '' && e["room"]!=null){
      room=`<li class="list-inline-item "><strong>Location:</strong> ${e["room"]}</li>`
    }
    console.log(e["first-name"],e["room"], null, e["room"]==null)

    elmt += `  
      <div class="card " style="width:100%; overflow:hidden">
      <div class="row g-0">
      <div class="ratio ratio-1x1" style="
            width:150px;
            background-image: url( ${e["img"]});
            background-size:cover;
            background-position:center;  ">
      
       
      </div>
      <div style="width:calc(100% - 150px)">
        <div class="card-body">
          <span class="card-title">${e["first-name"] + ' ' + e["last-name"]}
          <small class='text-muted'>${e["pronouns"]}</small>
                  <small class="badge bg-KP-navy address">${e["email"].replace('@','&commat;')}</small>
          </span>
          <ul class="list-inline p-0 m-0 ">
          
          ${sectionhours}
          ${officehours}
          ${room}
        
          ${role}
                </ul>
        </div>
      </div>
    </div>
  </div>
          `
  })

  elmt += `</div> 
    </div>
            </div>
          </div>
        </div>
      </div>`
  return elmt

}




md.use(container, 'Summary', {

  render: function (tokens, idx) {
    let args;
    if (tokens[idx].nesting === 1) {




      args = strip(tokens[idx].info.trim().match(/^Summary(.*)$/)[1])
      
      // opening tag
      let string= `
      <div class="Summary card col-lg-8 mx-auto ">
        <div class="card-header text-center display-6 ">
          Summary of the Lab
        </div>
        <div class='row g-0' >`
      
      if(COUNTER["Activity"]){
        string+=`
      
        <div class='col-3 text-center badge-Activity container fs-3 text-white'>
          <span class='badge badge-Activity fs-1 text-white'> ${COUNTER["Activity"].length} </span> <br> Activities
          </div> `    
      string+=`
        <div class='col-9' style='border-bottom:1px solid var(--bs-secondary)'>
          <ul class="list-inline px-1 py-0 mb-3 " >`
      COUNTER["Activity"].forEach((e)=> {
        string += `<li class="list-inline-item align-middle py-1">
            <a 
              tabindex="0"  
              href="#${e[1]}"
              role="button" 
              class="btn btn-sm badge-Activity position-relative mats text-white"  
              aria-pressed="false" autocomplete="off">
              Activity ${e[0]}
            </a>
          </li>
          `
        })
      
      string+=` </ul>
      </div>
      </div>`
      }
          

        string+=`
       
    
        <div class='row g-0'>
        <div class='col-3 text-center badge-Instruction container fs-3 text-white'>
          <span class='badge badge-Instruction fs-1 text-white'> ${COUNTER["Instruction"].length} </span> <br> Instructions
          </div> `
       
      string+=`
        <div class='col-9 '>
          <ul class="list-inline px-1 py-0 mb-3 " >`
 
        COUNTER["Instruction"].forEach((e)=> {
          string += `<li class="list-inline-item align-middle py-1">
              <a 
                tabindex="0"  
                href="#${e[1]}"
                role="button" 
                class="btn btn-sm badge-Instruction position-relative mats text-white"  
                aria-pressed="false" autocomplete="off">
                Instruction ${e[0]}
              </a>
            </li>`
          })
          
        string+=`</ul>
        </div>
        </div>
        <div class="card-footer text-center py-2" >
          Please be sure to complete all parts of the lab`
      return string
      ;
    } else {
      return ' </div></div></div>'
    }
  }
});



function full(args) {
  let obj, deet

  let list = `
     <ul class="list-inline Full px-1 py-0 mb-3 " ; border-bottom: 1px solid var(--bs-KP-lightgray)'>
      <li class="list-inline-item align-middle">

      </li>  
      `
  args.forEach((e) => {title = e.split('---')[0]; url = e.split('---').slice(1).join(' ');
    list += `<li class="list-inline-item align-middle py-1">
            <a class="btn btn-primary" href="${url}" role="button">${title}</a>
            </li>`
  })
  list+=`</ul>`
  return list;

}

function quizzy(args,ref) {
  let obj, deet

  let inner = `
  <div class="row">
  <div class="col">
     <ul class="Quiz px-1 py-0 mb-3 list-group-flush" >

      `
  args.forEach((e, i) => {
    // console.log(e)
    obj = e.split('---')[0]; deet = e.split('---').slice(1).join(' ');
    var katex_key=`${ref}_ans_${i}`
    KATEXMAP.set(katex_key, deet)
    // console.log(obj, deet)
    inner += `<li class="list-group-item align-middle py-1 ">
              <a tabindex="0"  role="button" class="btn btn-KP-navy position-relative quizlet" 
                id= '${ref}_ans_${i}'
                aria-pressed="false" autocomplete="off" data-modify="${ref}_answer" data-result="${deet}">
                ${obj} 
              </a>
            </li>
             `
      // document.getElementById(`${ref}_ans_${i}`).onclick= insert_quiz_text(deet, ref+'_answer')
  })

  inner+=`</div> 
  <div class="col quiz_ans align-middle" id="${ref}_answer" > Make a selection.</div>
  </div>`
  return inner;

}

