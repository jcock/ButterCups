'use strict';

// DOM ready:
$(function () {
	$(document).foundation();
	$('html').removeClass('no-js');

	// Init common modules
	app.mods.Fracs.Init();
	app.mods.SVGInjector.Init();
});

// All assets (frames/images/objects) loaded:
$(window).load(function () {
	app.mods.Scrolling.Init();
});

var app = app || {
	mods: {
		Fracs: {
			trackAll: false,
			Init: function () {
				$('.frac').fracs('max', 'visible', function (best) {
					var id = $(best).attr('id');
					$('nav a.fracs').removeClass('active');
					$('nav a.fracs[href="#' + id + '"]').addClass('active');
				});
			}
		},
		Scrolling: {
			selector: '.scrollTo',
			Init: function () {
				$(this.selector).click(function (e) {
					e.preventDefault();
					var href = $(this).attr('href');
					var $target = $(href);
					$.scrollTo($target, 250, {
						offset: -10,
						axis: 'y',
					});
				});
			}
		},
		SVGInjector: {
			Init: function () {
				var mySVGsToInject = document.querySelectorAll('img.svg-inject');
				SVGInjector(mySVGsToInject);
			}
		},
		Util: {
			UpdateUrlHash: function (hash) {
				// make sure we're dealing with a good hash
				if (typeof hash !== 'undefined') {
					// ensure consistency
					if (hash.indexOf('#') < 0) {
						hash = '#' + hash;
					}
					var $el = $(hash);
					if (typeof $el !== undefined) {
						// prevent scrolling by removing the id, setting the hash, then restoring the id
						var id = $el.attr('id');
						$el.removeAttr('id');
						history.pushState(hash.replace('#', ''), 2);
						$el.attr('id', id);
					} else {
						history.pushState(hash.replace('#', ''), 2);
					}
				}
			}
		}
	}
};
