/*! tableOfContents.js v1.0.0 | (c) 2020 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/table-of-contents */

/*
 * Automatically generate a table of contents from the headings on the page
 * @param  {String} content A selector for the element that the content is in
 * @param  {String} target  The selector for the container to render the table of contents into
 * @param  {Object} options An object of user options [optional]
 */

function romanize(num) {
	var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
	for (i in lookup) {
	  while (num >= lookup[i]) {
		roman += i;
		num -= lookup[i];
	  }
	}
	return roman;
  }

var tableOfContents = function (content, target, options) {
	//name headers and give special IDs
	headers = document.querySelectorAll("#maincontent > h1");
	for (i = 0; i < headers.length; i++) {
		elmnt = headers[i];
		if (i > 0) {
			elmnt.innerHTML = elmnt.innerHTML
		}
		elmnt.id = "part" + i;
	}

	//
	// Variables
	//

	// Get content
	var contentWrap = document.querySelector(content);
	var toc = document.querySelector(target);
	if (!contentWrap || !toc) {
		return;
	}
	// Settings & Defaults
	var defaults = {
		levels: 'h1, h2',
		heading: ' <b>Jump To: </b>',
		headingLevel: 'h4',
		listType: 'ul class="list-unstyled mb-0" '
	};
	var settings = {};

	// Placeholder for headings
	var headings;


	//
	// Methods
	//

	/**
	 * Merge user options into defaults
	 * @param  {Object} obj The user options
	 */
	var merge = function (obj) {
		for (var key in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, key)) {
				settings[key] = Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : defaults[key];
			}
		}
	};

	/**
	 * Create an ID for a heading if one does not exist
	 * @param  {Node} heading The heading element
	 */
	var createID = function (heading) {
		if (heading.id.length) return;
		heading.id =  heading.textContent.replace(/[^A-Za-z0-9]/g, '');
	};

	/**
	 * Get the HTML to indent a list a specific number of levels
	 * @param  {Integer} count The number of times to indent the list
	 * @return {String}        The HTML
	 */
	var getIndent = function (count) {
		var html = '';
		for (var i = 0; i < count; i++) {
			html += '<' + settings.listType + '>';
		}
		return html;
	};

	/**
	 * Get the HTML to close an indented list a specific number of levels
	 * @param  {Integer} count The number of times to "outdent" the list
	 * @return {String}        The HTML
	 */
	var getOutdent = function (count) {
		var html = '';
		for (var i = 0; i < count; i++) {
			html += '</' + settings.listType + '></li>';
		}
		return html;
	};

	/**
	 * Get the HTML string to start a new list of headings
	 * @param  {Integer} diff  The number of levels in or out from the current level the list is
	 * @param  {Integer} index The index of the heading in the "headings" NodeList
	 * @return {String}        The HTML
	 */
	var getStartingHTML = function (diff, index) {

		// If indenting
		if (diff > 0) {
			return getIndent(diff);
		}

		// If outdenting
		if (diff < 0) {
			return getOutdent(Math.abs(diff));
		}

		// If it's not the first item and there's no difference
		if (index && !diff) {
			return '' //'</li>';
		}

		return '';

	};

	/**
	 * Inject the table of contents into the DOM
	 */
	var injectTOC = function () {

		// Track the current heading level
		var level = headings[0].tagName.slice(1);
		var startingLevel = level;
		var current_name= ''
		

		// Cache the number of headings
		var len = headings.length - 1;

		// Inject the HTML into the DOM
		toc.innerHTML =
			// '<' + settings.headingLevel + ' class="nav-item ">' + settings.heading + '</' + settings.headingLevel + '>' +
			// '<' + settings.listType + '>' +
			Array.prototype.map.call(headings, function (heading, index) {

				// Add an ID if one is missing
				createID(heading);

				// Check the heading level vs. the current list
				var currentLevel = heading.tagName.slice(1);
				var levelDifference = currentLevel - level;
				level = currentLevel;
				var html = getStartingHTML(levelDifference, index) ;

				// Generate the HTML
				if(currentLevel == 1){
					current_name= heading.id + '_collapse'
		
					html +=
					
						//'<li>' +
							`</div>
						</div>
						<div class="accordion-item" style="padding-bottom:-20px;">
							<span class="accordion-header ac-h2" id="${heading.id}acc">
								<button class="accordion-button collapsed ac-heads" type="button" data-bs-toggle="collapse" data-bs-target="#${current_name}">
									<span>
										${heading.innerHTML.trim()}
									</span>
								</button>
							</span>
							<div class="collapse" id="${current_name}" >
								<div class="accordion-collapse collapse show" aria-labelledby="${current_name}">
									<div class="">
										<a class="nav-link ac-min" href="#${heading.id}">
											${heading.innerHTML.trim()}
										</a>
									</div>
								</div>
							`
							;
			
					// If the last item, close it all out
					if (index === len) {
						// html += getOutdent(Math.abs(startingLevel - currentLevel));
					}
				}else{
					html +=
						//'<li>' +
					
						'<li class="ac-list" aria-labelled-by="'+current_name+'">'+
						'<a class="nav-link nav-item ac-min" href="#' + heading.id + '">' +
						heading.innerHTML.trim() +
						'</a>'+			
						'</li>';

					// If the last item, close it all out
					if (index === len) {
						html +=//  getOutdent(Math.abs(startingLevel - currentLevel)) +
						'</div></div>' ;
					}
				}

				return html;

			}).join('') +
			// '</' + settings.listType + '>' +
			'</div>';
	};

	/**
	 * Initialize the script
	 */
	var init = function () {

		// Merge any user settings into the defaults
		merge(options || {});

		// Get the headings
		// If none are found, don't render a list
		headings = contentWrap.querySelectorAll(settings.levels);
		if (!headings.length) {
	
			toc.innerHTML = "none found"
			return;
		}

		// Inject the table of contents
		injectTOC();

	};


	//
	// Initialize the script
	//

	init();

};