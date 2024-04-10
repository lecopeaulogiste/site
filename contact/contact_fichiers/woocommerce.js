jQuery(document).ready(function($) {
	
	//product tabs
	jQuery('#product-tab a').on('click',function (e) { 
		var prodcutTabA = jQuery(this);
		if(!prodcutTabA.parent('li').hasClass('active')){
			var prodcutTabHref = prodcutTabA.attr('href').substr(1);
			prodcutTabA.parent('li').addClass('active');
			prodcutTabA.parent('li').siblings().removeClass('active');
			jQuery('#'+prodcutTabHref).addClass('active');
			jQuery('#'+prodcutTabHref).siblings().removeClass('active');
		}
		return false;
	});
	
	//show shipping calculator box in Cart page
	if(jQuery('.shipping-calculator-form').length){
		
		jQuery('.shipping-calculator-form').siblings('h4.lined-heading').css('cursor','pointer');
		
		jQuery('.shipping-calculator-form').siblings('h4.lined-heading').on('click', function(){
		
			jQuery(".shipping-calculator-form").slideToggle(500, function() {
				if (jQuery(this).is(":visible")) {
					
				}
			});

			return false;
		
		})
		
	}
	
	//Close Login form box
	jQuery('.modal-header').find('button').on('click', function(){
	
		if(jQuery('#login-form,#modal-mask').hasClass('in')){
		
			jQuery('#login-form,#modal-mask').removeClass('in').addClass('out');
		
		}

		return false;
	
	});
	//open Login formbox
	jQuery('.show-login').on('click', function(){
	
		if(!jQuery('#login-form,#modal-mask').hasClass('in')){
		
			jQuery('#login-form,#modal-mask').addClass('in').removeClass('out');
			jQuery('#login-form').find('form').show(300);
		
		}

		return false;
	
	});

	jQuery('.woocommerce-product-rating').each(function() { 
		jQuery(this).appendTo('.price');

	});

	//Plus & Minus Buttons To Add to Cart Quantity Input
	jQuery('.sea-quanlity-btn').on( 'click', function() {
        // Get current quantity values
        var qty = $( this ).siblings( '.qty' );
        var val   = parseFloat(qty.val());
        var max = parseFloat(qty.attr( 'max' ));
        var min = parseFloat(qty.attr( 'min' ));
        var step = parseFloat(qty.attr( 'step' ));

        // Change the value if plus or minus
        if ( $( this ).is( '.plus' ) ) {
           if ( max && ( max <= val ) ) {
              qty.val( max );
           } else {
              qty.val( val + step );
           }
        } else {
           if ( min && ( min >= val ) ) {
              qty.val( min );
           } else if ( val > 1 ) {
              qty.val( val - step );
           }
        }
        return false;
    });
  
});

jQuery(window).on('resize', function(){
	if (jQuery('.woocommerce-product-gallery').length){
		jQuery('.woocommerce-product-gallery').css({'width':''}); 
	}
});

jQuery(window).on('load', function(){ 

	setTimeout(function(){

		getGalleryItems = function() {
				var $slides = jQuery('.woocommerce-product-gallery__image:not(.clone)'),
					items   = [];

				if ( $slides.length > 0 ) {
					$slides.each( function( i, el ) {
						var img = jQuery( el ).find( 'img' );

						if ( img.length ) {
							var large_image_src = img.attr( 'data-large_image' ),
								large_image_w   = img.attr( 'data-large_image_width' ),
								large_image_h   = img.attr( 'data-large_image_height' ),
								alt             = img.attr( 'alt' ),
								item            = {
									alt  : alt,
									src  : large_image_src,
									w    : large_image_w,
									h    : large_image_h,
									title: img.attr( 'data-caption' ) ? img.attr( 'data-caption' ) : img.attr( 'title' )
								};
							items.push( item );
						}
					} );
				}
				return items;
			};
	},50)

	var sea_flex_thumb = function() {
		let sliderMain = jQuery('.flex-viewport').css({'opacity':'1'}),
						sliderNav = jQuery('.flex-control-nav'),
						h = sliderMain.height();
				sliderNav.css({'height': h + 'px'});
				sliderNav.append('<div class="nav-inn"></div>').append('<span class="navi-next"></span>').prepend('<span class="navi-prev hide-narrow"></span>');
				sliderNav.find('li').appendTo('.nav-inn');
				let naviInn = sliderNav.find('.nav-inn').css({'top':0}),
						naviInnH = naviInn.height(),
						_next = sliderNav.find('.navi-next'),
						_prev = sliderNav.find('.navi-prev'),
						dis = naviInnH - h,
						unitImg = sliderNav.find('img'),
						unitH = Number(sliderNav.find('li').outerHeight(true)); 

				unitImg.on('mouseover', function(){
					jQuery(this).trigger('click');
				})
				
				if ( dis <= 0 ) _next.addClass('hide-narrow');
				
				sliderNav.on('click', function(event) {
					
					let currentPosi = naviInn[0].style.top,
							target = event.target;
					
					currentPosi = currentPosi.replace(/[^-\d.]/g, '');
					currentPosi = Number(currentPosi); 

					if ( currentPosi === 'none' || ! currentPosi ) currentPosi = 0; 
					
					if ( target.className === 'navi-next' ) {
						currentPosi -= unitH;

						naviInn.css({'top': currentPosi + 'px' })
						_prev.removeClass('hide-narrow');
						if ( Math.abs(currentPosi) >= dis ) {  
							_next.addClass('hide-narrow');
						}
					}

					if ( target.className === 'navi-prev' ) {
						currentPosi += unitH;
						naviInn.css({'top': currentPosi + 'px' })
						_next.removeClass('hide-narrow');
						if ( Math.abs(currentPosi) <= 0 ) {  
							_prev.addClass('hide-narrow');
						}
					}
					event.preventDefault(); 
				});
	}
	
	if ( jQuery('body').find('.sea-vertical-slider').length ) { 
		setTimeout(function() {
			
			let w = jQuery('.woocommerce-product-gallery').width();
			//Fix showing line if width is float value		
			jQuery('.woocommerce-product-gallery').css({'width': Math.floor(w) + 'px'}); 

			setTimeout(sea_flex_thumb,50);

			jQuery(window).trigger('resize');
		},50) 
	}
});