;function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

function pauseVideo(iframe) {
  iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}

;(function($) {
	$('html')
		.removeClass('no-js')
		.addClass('js');


	// owl carousel
	$('.carousel').owlCarousel({
		addClassActive: true,
		navigation: true,
		pagination: false,
		rewindNav: false,
		singleItem: true,
    beforeMove: function($element) {
      var $item = this.$owlItems.eq(this.prevItem),
        $iframe = $item.find('.carousel-slide-video iframe');

      if ($iframe.length > 0) {
        pauseVideo($iframe[0]);
      }
    }
	});

  $('body').fitVids();

  // carousel dynamic loader
  var slideSizer = function() {
    $('.carsousel-slide-image').each(function() {
      var $this = $(this),
        width = $this.width(),
        fullWidth = $(this).data('width'),
        fullHeight = $(this).data('height'),
        ratio = width/fullWidth;

      $this.height(Math.round(fullHeight * ratio));
    });
  };
  slideSizer();
  openPanel();
  $(window).resize(debounce(slideSizer, 250)); // add debouncing

  /*
   * Exapand Panels on page load if 'About' or 'Contact'
   * hashes are present
  */
  function openPanel() {
    var hash = location.hash.replace('#', '');
    if(hash === 'about' || hash === 'contact') {
      $('[data-link='+hash+']').click();
    }
  }

  var slideCheck = function() {
    var windowTop = window.scrollY,
      windowHeight = $(window).height(),
      windowBottom = windowTop + windowHeight,
      offset = windowHeight*1.3,
      $images = $('.carousel img'),
      $loadedImages = $images.filter('[src]'),
      $unloadedImages = $images.filter(':not([src])');
    
    $loadedImages.each(function() {
      var $this = $(this),
          top = $this.offset().top,
          bottom = top + $this.height();

      if (bottom < windowTop - offset || top > windowBottom + offset) {
        $this.attr('src', null);
      }
    });

    $unloadedImages.each(function() {
      var $this = $(this),
          top = $this.offset().top,
          bottom = top + $this.parents('.carousel-slide').height(); // img height is 0

      if ((top > windowTop - offset && bottom < windowBottom + offset) ||
        (top > windowTop - offset && top < windowBottom + offset) ||
        (bottom > windowTop - offset && bottom < windowBottom + offset)) {
        $this.attr('src', $this.attr('data-src'));
      }
    });
  }
  slideCheck();
  $(window).on('load', slideCheck);

  $(window).scroll(debounce(slideCheck, 250));
  
  function forms(selector, successSelector, errorSelector) {
    var $form = $(selector),
        $formSuccess = $(successSelector),
        $formError = $(errorSelector),
        $nameField = $form.find('[name=name]'),
        $emailField = $form.find('[name=email]'),
        $commentField = $form.find('[name=comments]'),
        $charCount = $form.find('.char-count')

    hasValidationErrors = function() {
      var error = false;

      if ($nameField.val().length == 0) {
        $nameField.addClass('invalid');
        error = true;
      } else {
        $nameField.removeClass('invalid');
      }

      if (!/\S+@\S+\.\S+/.test($emailField.val())) { // basic validation, server is doing full
        $emailField.addClass('invalid');
        error = true;
      } else { 
        $emailField.removeClass('invalid');
      }

      if ($commentField.val().length == 0) {
        $commentField.addClass('invalid');
        error = true;
      } else {
        $commentField.removeClass('invalid');
      }
      return error;
    };
  
    $($form.find('[name=name],[name=email],[name=comments]')).blur(hasValidationErrors);
    
    $commentField.on('keyup', function() {
      var $this = $(this),
          $el = $('.characters-remaining'),
          length = $this.val().length,
          charsLeft = 250 - length,
          percent = (charsLeft/250),
          startRed = 57,
          endRed = 255,
          startGreen = 181,
          endGreen = 81,
          startBlue = 0,
          endBlue = 51,
          redDiff = startRed - endRed,
          greenDiff = startGreen - endGreen,
          blueDiff = startBlue - endBlue,
          red = parseInt(redDiff*percent-redDiff),
          green = parseInt(greenDiff*percent-greenDiff),
          blue = parseInt(blueDiff*percent-blueDiff)

      $charCount.text(charsLeft);
      $el.css('color', 'rgb('+(startRed+red)+', '+(startGreen+green)+', '+(startBlue+blue))
      // start at rgb(57, 181, 0)
      // end rgb(255, 81, 51)
    })

    $form.submit(function(e) {
      e.preventDefault();
      if (hasValidationErrors()) return;
      $formError.fadeOut();
      
      $.ajax({
        type: 'POST',
        url: this.action,
        data: $(this).serialize(),
        success: function(data) {
          $formSuccess.fadeIn();
          $form.fadeOut();
        },
        error: function(msg) {
          $formError.text(msg);
          $formError.fadeIn();
        }
      });
    });
  }
  
  if($('#contactForm').length > 0) forms('#contactForm', '#contactSuccess', '#contactError');
  if($('#contactFormMarketo').length > 0) forms('#contactFormMarketo', '#contactSuccessMarketo', '#contactErrorMarketo');

  window.SARMap = {
    mapCenter: new google.maps.LatLng(30.35269,-97.7502),
    map: null,
    _loaded: false,
    _markerURL: window.location.origin + '/images/map_marker.png',

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

  // google.maps.event.addDomListener(window, 'load', SARMap.initialize);
  // google.maps.event.addDomListener(window, 'resize', SARMap.center);

  
  var _gaq=[ ['_setAccount','UA-23810379-1'],['_trackPageview'] ]; // Change UA-XXXXX-X to be your site's ID
  (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
  g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
  s.parentNode.insertBefore(g,s)}(document,'script'));
  
})(jQuery);
