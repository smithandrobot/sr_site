(function() {
	$('.menuSkin--toggle').each(function() {
		var $menu = $(this),
			$toggles = $menu.find('.menu-item'),
			$toggled = $menu.find('.toggled'),
			$active = null;

		$toggles.click(function() {
			var $clicked = $(this);
			if ($clicked.is($active)) { 
				$clicked = null;
			}

			if ($active) {
				$toggled.filter('[data-target="' + $active.data('target') + '"]').slideUp();
			}
			if ($clicked) {
				$toggled.filter('[data-target="' + $clicked.data('target') + '"]').slideDown();
			}

			$active = $clicked;
			
		});
	})
})();