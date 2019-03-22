if ($(window).width() < 751) {
	$('[data-srcset], [srcset]').each( function() {
		var m_link = $(this).attr('data-srcset');
		//console.log(m_link);
		if (m_link) {
			$(this).attr('data-srcset', 'm/' + m_link );
		} else {
			m_link = $(this).attr('srcset');
			$(this).attr('srcset', 'm/' + m_link );
		}
	});
	$('img').each( function() {
		
		if (!$(this).hasClass('lazyload') ){
			var m_link = $(this).attr('src');
			$(this).attr('src', 'm/' + m_link );
		} else {
			var m_link = $(this).attr('data-src');
			$(this).attr('data-src', 'm/' + m_link );	
		}
	});
}

$(window).on('load', function() {
	$('body').addClass('is-preload');
	if ($(window).scrollTop() > 0) {
		$('html').addClass('scrolled');
	}
	var t = 150;

	window.setTimeout(function() {
		$('body').removeClass('is-preload').addClass('load');
		$('#app').removeClass('loading');
	}, t);
});

$(document).ready(function() {
	$('body').mouseleave(function(event) {
		if (event.pageY - window.pageYOffset < 0 && !localStorage.popmodal) {
			if (!$(this).hasClass('m-open')) {
				localStorage.popmodal = 1;
				$.magnificPopup.open({
					items: {
						src: '#popup-live', // can be a HTML string, jQuery object, or CSS selector
						type: 'inline'
					},
					tClose: 'Закрыть',
					fixedContentPos: false,
					fixedBgPos: false,
					overflowY: 'auto',
					closeBtnInside: true,
					preloader: true,
					mainClass: 'mfp-zoom',
					removalDelay: 300,
				});
			}
		}
	});
});

$(function() {

	$('[type=tel]').intlTelInput({
		allowExtensions: false,
		autoFormat: true,
		autoHideDialCode: false,
		autoPlaceholder: false,
		defaultCountry: "auto",
		geoIpLookup: function(callback) {
			$.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
				var countryCode = (resp && resp.country) ? resp.country : "";
				callback(countryCode);
			});
		},
		nationalMode: false,
		numberType: 'MOBILE',
		preferredCountries: ['ua', 'ru', 'by', 'us'],
		utilsScript: 'js/utils.js'
	});

	
	/*
	$('.player').click(function() {

		$(this).find('.thumb').css('opacity', '0');
		var videoId = $(this).data('player');

		var options = {
			id: 287993463,
			width: 640,
			loop: true
		};

		var player = new Vimeo.Player(videoId, options);

		player.setVolume(.5);
		player.play();

		player.on('play', function() {
			var pl = $("#ytplayer").closest('.sec');
			pl.css('height', pl.height() + 120).addClass('play');
		});

		$('.play-off').click(function() {
			$(this).closest('.sec').removeClass('play');
			player.pause();
		});
	});
	*/

	$(window).scroll(function() {
		if ( $(window).scrollTop() > $('#two').offset().top + $('#two').height() ) {
			$('#two').addClass('fix');
			$('.header').addClass('fix');
		} else {
			$('#two').removeClass('fix');
			$('.header').removeClass('fix');
		}
		if (!$('html').hasClass('scrolled')) {
			$('html').addClass('scrolled');
		}
	});

	$('.anchor').click(function() {
		var btn = $(this).data('href');

		var target = $(btn);
		target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

		$('html,body').animate({
			scrollTop: target.offset().top + 5
		}, 1500);

		return false;
	});

	$('.popup-terms').magnificPopup({
		type: 'inline',
		fixedContentPos: true,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		midClick: true,
		mainClass: 'mfp-zoom',
	});
	$('.popup').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: false,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: true,
		midClick: true,
		removalDelay: 300,
		mainClass: 'mfp-zoom-in',
		callbacks: {
			beforeOpen: function() {
				this.st.mainClass = this.st.el.attr('data-effect');
				$('[name=l_btn]').val(this.st.el.attr('data-btn'));
				$('[name=l_name]').val(this.st.el.attr('data-btn'));
			}
		}
	});

	$('.popup-youtube, .popup-gmaps').magnificPopup({
		type: 'iframe',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: true,
		midClick: true,
		closeBtnInside: true,
	});

	var $slick = $('.slider');


	$slick.slick({
		speed: 600,
		centerMode: true,
		variableWidth: true,
		//slidesToShow: 1.5,
		arrows: false,
		infinite: true,
		dots: false,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 992,
				draggable: true,
				settings: {
					slidesToShow: 1,
					variableWidth: false,
					centerMode: true,
				}
			},
			{
				breakpoint: 768,
				draggable: true,
				settings: {
					slidesToShow: 1,
					variableWidth: false,
					centerMode: false,
				}
			}
		]
	});

	$slick.slick('slickGoTo', 1);

	$slick.on('beforeChange', function (event, slick, currentSlide, nextSlide) {

        var i = (nextSlide ? nextSlide : 0);
        var nav_w = +(100 / slick.slideCount);
       

        if (i == 0) {
			$('.target').attr('style', 'left: 0; width: ' + nav_w + '%;');
        } else {
        	var nav_t = nav_w * i;
        	//console.log(nav_t);
			$('.target').attr('style', 'left: '+ nav_t +'%; width: ' + nav_w + '%;');
        }
    });

	if (browser.mobile) {
		$('html').addClass('touch');
	}

	

	$('.nn-prev').click(function() {
		if (!$(this).hasClass('hid')) {
			$slick.slick('slickPrev');
		}
	});

	$('.nn-next').click(function() {
		if (!$(this).hasClass('hid')) {
			$slick.slick('slickNext');
		}
	});
	

}); // end