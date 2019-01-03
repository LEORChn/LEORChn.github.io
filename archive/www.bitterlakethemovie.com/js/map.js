window.addEvent('domready', function() {
	var map = $('map');
	var areaElems = $$('#navigation area');
	var origHighlight = '';
	var classList = map.className.split(' ');
	for (var i = 0; i < classList.length; i++) {
		if (classList[i].substr(0, 3)=='hl-') {
			origHighlight = classList[i];
			break;
		}
	}
	var currHighlight = origHighlight;
	areaElems.addEvent('mouseenter', function(e) {
		map.removeClass(currHighlight);
		currHighlight = 'hl-'+e.target.id.substr(5);
		map.addClass(currHighlight);
	});
	areaElems.addEvent('mouseleave', function() {
		map.removeClass(currHighlight);
		currHighlight = origHighlight;
		map.addClass(currHighlight);
	});
	map.addEvent('mouseleave', function() {
		map.removeClass(currHighlight);
		currHighlight = origHighlight;
		map.addClass(currHighlight);
	});
});
/*
     FILE ARCHIVED ON 17:07:01 Feb 10, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:46:44 Dec 31, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 111.0 (3)
  esindex: 0.01
  captures_list: 136.751
  CDXLines.iter: 15.074 (3)
  PetaboxLoader3.datanode: 173.265 (4)
  exclusion.robots: 0.207
  exclusion.robots.policy: 0.191
  RedisCDXSource: 6.844
  PetaboxLoader3.resolve: 26.224
  load_resource: 100.221
*/