'use strict';

$(document).foundation();

// DOM ready:
$(function () {
	$('html').removeClass('no-js');

	// Init common modules
	app.mods.Fracs.Init();
	app.mods.Navigation.Init();
	app.mods.SVGInjector.Init();
});

// All assets (frames/images/objects) loaded:
$(window).load(function () {
	app.mods.Scrolling.Init();
});

var app = app || {
	vars: {
	},
	mods: {
		Fracs: {
			trackAll: false,
			Init: function () {
				// Handle UI updates in realtime but debounce the updating of the url hash and analytics tracking
				$('.frac').fracs('max', 'visible', function (best) {
					var id = $(best).attr('id');
					$('nav a.fracs').removeClass('active');
					$('nav a.fracs[href="#' + id + '"]').addClass('active');
				}).fracs('max', 'visible', $.debounce(1000, function (best) {
					var id = $(best).attr('id');
					if (this.trackAll || !$(best).hasClass('frac-notracking')) {
						app.mods.Util.UpdateUrlHash(id);
					}
				}));
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
						onAfter: function () {
							app.mods.Util.UpdateUrlHash(href);
						}
					});
				});
			}
		},
		Navigation: {
			Init: function () {
				// Using the current path (e.g. /Section/Page)
				var path = location.pathname;

				this.Go(path);
				path = location.search;
				this.Go(path);

				if (path.indexOf('print=true') >= 0) {
					window.print();
				}
			},
			Go: function (url) {
				// Handle links to the current path
				if (url) {
					$('a[href$="' + url + '"]:not([href^="http"])').addClass('active');
				}
			}
		},
		SVGInjector: {
			Init: function () {
				// Elements to inject
				var mySVGsToInject = document.querySelectorAll('img.svg-inject');

				// Options
				var injectorOptions = {
					evalScripts: 'once',
					pngFallback: '/images'
				};

				// Trigger the injection
				SVGInjector(mySVGsToInject, injectorOptions, function (totalSVGsInjected) {
				});
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
						$.bbq.pushState(hash.replace('#', ''), 2);
						$el.attr('id', id);
					} else {
						$.bbq.pushState(hash.replace('#', ''), 2);
					}
				}
			}
		}
	}
};
