(function() {
	$toggles = $('.menu-item[data-target]'),
	$closers = $('.contentPane-closeButton');
	$active = null;

	$toggles.click(function() {
		var $clicked = $(this);

		if ($clicked.is($active)) {
			$($active.data('target')).slideUp();
			$active = null;
		} else if ($active) {
			$($active.data('target')).slideUp(function() {
				$($clicked.data('target')).slideDown();
				$active = $clicked;
			});
		} else {
			$($clicked.data('target')).slideDown();
			$active = $clicked;
		}
	});

	$closers.click(function() {
		$(this).parents('.contentPane').slideUp();
		$active = null;
	});
})();