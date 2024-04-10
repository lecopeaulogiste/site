//mod -> text

(function($){

    "use strict";
	
	var UxCBMod = [];
	
	//window
	UxCBMod.win = $(window);
	UxCBMod.doc = $(document);
	
	//module text effect
	UxCBMod.fnModuleTextMaskMod = function(){
		UxCBMod.textMaskMod.each(function() {
			var module = $(this).parent().parent();
			var blendWrap = $(this).find('.background-blend');
			var effectMod = $(this).data('effect');
			var video = module.find('.background-video');
			
			switch(effectMod){
				case 'standard-to-mask':
					ScrollTrigger.create({
						trigger: module,
			            start: "top 60%",
			            onEnter: function(){
							blendWrap.addClass('enable-mask').removeClass('disable-mask');
							if(!video.length){
								blendWrap.addClass('enable-mask');
							}
						},
						onLeaveBack: function(){
							blendWrap.removeClass('enable-mask').addClass('disable-mask');
						}
					});
				break;
				
				case 'mask-to-standard':
					ScrollTrigger.create({
						trigger: module,
			            start: "top 60%",
			            onEnter: function(direction){ 
							blendWrap.removeClass('enable-mask').addClass('disable-mask');
						},
						onLeaveBack: function(){
							blendWrap.removeClass('disable-mask');
							if(!video.length){
								blendWrap.addClass('enable-mask');
							}
						}
					});
				break;
			}
		});
	}
	
	//Text module backgroud image clip
	UxCBMod.fnTextBgimgClip = function(textBgimgClip){
		textBgimgClip.each(function(){
			var textclip = $(this);
			var textclipDeepest = textclip.children(),
				textclipNext = textclipDeepest;
			while (textclipNext.length) {
			    textclipDeepest = textclipNext;
			    textclipNext = textclipNext.children();
			}
			if(!textclipNext.is('br')){
				if(!textclipDeepest.hasClass('text-clip-style')) {
					textclipDeepest.addClass('text-clip-style');
				}
			}
		});
	}
	//Set a width for Big number, or Text module will jitter during animation
	UxCBMod.fnBignumberSize = function(bignumbers){
		bignumbers.each(function(){
			let bignumberMain = $(this).find('.big-number-main'),
				bignumberSub =  $(this).find('.big-number-sub'),
				bignumberW = bignumberMain.width();
			if (bignumberSub.length) {
				bignumberW += bignumberSub.outerWidth(true);
			}
			$(this).css({'width': bignumberW + 'px'});
		})
	}

	
	//UxCBMod init
	UxCBMod.fnInit = function(){
		UxCBMod.module = $('.bm-builder > .module');
		
		if(!UxCBMod.module.length){
			if($('.bm-builder > .bm-row').length){
				UxCBMod.module = $('.bm-builder > .bm-row > .module');
			}
		}
		
		UxCBMod.textMaskMod = UxCBMod.module.find('[data-effect]');
		UxCBMod.textBgimgClip = UxCBMod.module.find('.bm-text-bgimg-mask');
		UxCBMod.textBigNumber = UxCBMod.module.find('.big-number');
		
		if(UxCBMod.textMaskMod.length){
			UxCBMod.fnModuleTextMaskMod();
		}
		
		//text module background image clip
		if(UxCBMod.textBgimgClip.length){
			UxCBMod.fnTextBgimgClip(UxCBMod.textBgimgClip);
		}

		//Set a width for Big number - call
		if (UxCBMod.textBigNumber.length){
			UxCBMod.fnBignumberSize(UxCBMod.textBigNumber)
		}
	};
	
	//document ready
	UxCBMod.doc.ready(function(){
		if(UxCBModGlobal){
			UxCBModGlobal['text'] = UxCBMod;
		}
	});
	
	//win load
	UxCBMod.win.on('load',function(){
		UxCBMod.fnInit();
	});
	
	//Set a width for Big number - call resize
	UxCBMod.win.on('resize', sea_debounce( function(){
		if (UxCBMod.textBigNumber.length){
			UxCBMod.fnBignumberSize(UxCBMod.textBigNumber)
		}
	}, 100));
	
	
})(jQuery);