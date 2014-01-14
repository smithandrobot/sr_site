


(function($) {
	$('html')
		.removeClass('no-js')
		.addClass('js');


	// owl carousel
	$('.carousel').owlCarousel({
		addClassActive: true,
		navigation: true,
		pagination: false,
		rewindNav: false,
		singleItem: true
	});

	$('img').unveil(200);

  window.SARMap = {
    mapCenter: new google.maps.LatLng(30.35269,-97.7502),
    map: null,
    _loaded: false,
    _markerURL: 'http://smithandrobot.com/assets/components/images/map_marker.png',

    initialize: function() {
      if (SARMap._loaded) return;
      SARMap._loaded = true;

      SARMap.map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: SARMap.mapCenter,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      SARMap.addMarker(30.3526, -97.7502);
    },

    addMarker: function(lat, lon) {
      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: SARMap.map,
        icon: SARMap._markerURL
      });
    },

    center: function() {
      SARMap.map.setCenter(SARMap.mapCenter);
    },

    resize: function() {
      google.maps.event.trigger(SARMap.map, 'resize');
    }
  }

  google.maps.event.addDomListener(window, 'load', SARMap.initialize);

  // var _gaq=[ ['_setAccount','UA-23810379-1'],['_trackPageview'] ]; // Change UA-XXXXX-X to be your site's ID
  // (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
  //   g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
  //   s.parentNode.insertBefore(g,s)}(document,'script'));
})(jQuery);