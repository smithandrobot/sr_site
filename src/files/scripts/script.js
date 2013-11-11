(function($) {
	$('html')
		.removeClass('no-js')
		.addClass('js');


	// owl carousel
	$('.carousel').owlCarousel({
		addClassActive: true,
		navigation: true,
		rewindNav: false,
		singleItem: true
	});
})(jQuery);