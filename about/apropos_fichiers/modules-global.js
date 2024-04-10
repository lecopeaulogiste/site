//mod -> global

UxCBModModuleIsotope = [];

(function($){

    "use strict";
    
    var UxCBMod = [];
    
    //window
    UxCBMod.win = $(window);
    UxCBMod.doc = $(document);
    UxCBMod.body = $('body');
    UxCBMod.pageLoader = $('.page-loading');
    
    UxCBMod.itemQueue = [];
    UxCBMod.itemDelay = 150;
    UxCBMod.queueTimer;
    UxCBMod.pageLoaderEnable = UxCBMod.pageLoader.length && UxCBMod.pageLoader.hasClass('visible-again') ? true : false;
    
    //condition
    //Migrated modules-global.js
    UxCBMod.isMobile = function(){
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || UxCBMod.win.width() < 769){
            return true; 
        }else{
            return false;
        }
    }
    
    UxCBMod.fnParseQuery = function(query){
        var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
        var obj = {};
        while(reg.exec(query)){
            obj[RegExp.$1] = RegExp.$2;
        }
        return obj;
    }

    //Modules scrolled anmation 
    UxCBMod.fnModuleAnimationScroll = function(animationScroll){
        
        let animationScrollParent = animationScroll.parents('.module')[0]; 
        let animationData = animationScroll.attr('data-animation');
        
        
        //Start Postion
        let animationStartScroll = '80%';

        if (animationScrollParent && animationScrollParent.getAttribute('data-animationstart')) {
            animationStartScroll = animationScrollParent.getAttribute('data-animationstart');
        }

        let animationStart = 'top ' + animationStartScroll;

        //duration option
        let animationDuration = 0.5;
        if (animationScrollParent && animationScrollParent.getAttribute('data-animationduration') ) {
            animationDuration = Number(animationScrollParent.getAttribute('data-animationduration'));
        }

        //play again or not
        let animationAgain = 'off';
        if (animationScrollParent && animationScrollParent.getAttribute('data-animationagain')) {
            animationAgain = String(animationScrollParent.getAttribute('data-animationagain'));
        }

        //Ease
        let animationEase = 'none';
        if (animationScrollParent && animationScrollParent.getAttribute('data-animationease')) {
            animationEase = animationScrollParent.getAttribute('data-animationease');
        /*ease options: power1 powser2 power3 powser4 elastic back bounce slow circ expo sine*/ 
        }

        //Stagger time
        let animationStagger = 0.2;
        if (animationScrollParent && animationScrollParent.getAttribute('data-animationstagger')) {
            animationStagger = Number(animationScrollParent.getAttribute('data-animationstagger'))
        }

        //Scroll item(s) 
        let animationItem = animationScroll;
        //split text
        let splitText = animationItem.find('.text-split');
        if (splitText.length) { 
            gsap.registerPlugin(SplitText); 
            let splitTextLine = new SplitText(splitText, { type: 'lines', reduceWhiteSpace: false, linesClass: 'spline' });
            let splitTextLineParent = new SplitText(splitText, { type: 'lines', reduceWhiteSpace: false, linesClass: 'spline-parent' });
            animationItem = splitTextLine.lines;  
            gsap.set(splitText, { opacity: 1 });
            window.addEventListener('resize',() => { 
                splitTextLine.revert();
            })
        }
            
        const timeLineEnterAnim = function (i, animationScrollItem) {
            gsap.timeline({ delay: i * animationStagger, 
                onComplete: function(){
                    $(animationScrollItem).css({'clipPath':'initial'});
                }
             }).to(animationScrollItem, {
                opacity: 1,
                x: 0,
                y: 0,
                rotation: 0,
                rotationY: 0,
                rotationX: 0,
                scale: 1,
                duration: animationDuration,
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: animationEase,
                stagger: animationStagger
            });

            //Big Number animation
            const bigNumberAnima = animationScrollItem.querySelector('.show-big-number');
            if (bigNumberAnima) {
                const bigNumber = bigNumberAnima.querySelector('.big-number-main');
                const bigNumberTl = gsap.timeline();
                bigNumberTl.from(bigNumber, {
                    duration: .3,
                    ease: 'none',
                    innerText: 0,
                   // roundProps: 'innerText',
                    delay: animationDuration,
                    onUpdate: function() { 
                        const newNum = gsap.getProperty(bigNumber, 'innerText');
                        // bigNumber.innerText = UxCBMod.fnNumberWithCommas(newNum);
                        bigNumber.innerText = parseInt(newNum)
                    },
                    onComplete: function () {
                        bigNumberAnima.classList.add('show-sub');
                    }
                })
            }
        }
        // UxCBMod.fnNumberWithCommas = function(n) {
        //     var parts=n.toString().split(".");
        //     return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // }
        const timeLineLeaveFn = function (i, animationScrollItem) {
            if (!splitText.length) {
                animationData = animationScrollItem.getAttribute('data-animation');
            }
            let animationObj = { opacity: 0, overwrite: true };  
            //From what status
            switch(animationData) {
                case 'from-top': animationObj.y = -100; break;
                case 'from-bottom': animationObj.y = 100; break;
                case 'from-left': animationObj.x = -120; break;
                case 'from-right': animationObj.x = 120; break;
                case 'zoomin': animationObj.scale = 0.7; break;
                case 'zoomout': animationObj.scale = 1.3; break;
                case 'from-zoom-mask': animationObj.clipPath = 'polygon(10% 5%,90% 5%,90% 95%,10% 95%)'; break;
                case 'from-zoom-mask2': animationObj.clipPath = 'polygon(0% 20%,100% 20%,100% 80%,0% 80%)';  break;
                case 'from-left-mask': animationObj.clipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'; animationObj.opacity= '.5'; animationObj.x = -120; break;
                case 'from-right-mask': animationObj.clipPath = 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'; animationObj.opacity= '.5';animationObj.x = 120; break;
                case 'from-top-mask': animationObj.clipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'; animationObj.opacity = '.5'; break;
                case 'from-bottom-mask': animationObj.clipPath = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'; animationObj.opacity= '.5'; break;
                case 'rotate-downleft': animationObj.rotate = '-90deg';  break;
                case 'rotate-downright': animationObj.rotate = '90deg';  break;
                case 'flip-y': animationObj.rotationY = '45deg';  break;
                case 'flip-x': animationObj.rotationX = '45deg';  break;
                case 'from-top-long': animationObj.y = -1000;  break;
                case 'from-bottom-long': animationObj.y = 1000;  break;
                case 'from-left-long': animationObj.x = -1000; break;
                case 'from-right-long': animationObj.x = 1000; break;
                case 'from-top-short': animationObj.y = -40;  break;
                case 'from-bottom-short': animationObj.y = 40;  break;
                case 'from-left-short': animationObj.x = -40; break;
                case 'from-right-short': animationObj.x = 40; break;
                default: animationObj.opacity = 0; break;
            }
            gsap.timeline({ 
                delay: i * animationStagger, 
                onStart: function(){
                    $(animationScrollItem).css({'clipPath':'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'});
                } 
            }).to(animationScrollItem, animationObj);

            //Big Number animation
            const bigNumberAnima = animationScrollItem.querySelector('.show-big-number');
            if (bigNumberAnima!==null) bigNumberAnima.classList.remove('show-sub');
        }

        const animationStartFn = function(animationScrollItem){
            if (!splitText.length && animationScrollItem[0] != undefined ) {
                animationData = animationScrollItem[0].getAttribute('data-animation');
            }
            switch(animationData) {
                case 'from-top': animationStart = 'top+=100px ' + animationStartScroll; break;
                case 'from-bottom': animationStart = 'top-=100px ' + animationStartScroll; break;
                case 'from-top-long': animationStart = 'top+=1000px ' + animationStartScroll; break;
                case 'from-bottom-long': animationStart = 'top-=1000px ' + animationStartScroll; break;
                case 'from-top-short': animationStart = 'top+=40px ' + animationStartScroll; break;
                case 'from-bottom-short': animationStart = 'top-=40px ' + animationStartScroll; break;
                default: animationStart ='top '+ animationStartScroll;
            }
            return animationStart;
        }

        const animationOnce = animationAgain === 'on' ? false : true; 
        setTimeout(function(){
            ScrollTrigger.batch(animationItem, { //markers:true,
                trigger: animationItem,
                once: animationOnce,
                start: animationStartFn(animationItem),
                end: 'bottom top',
                interval: 0.2, 
                onEnter: batch => batch.forEach((item, i) => {
                    timeLineEnterAnim(i, item);
                }),
                onLeaveBack: batch => batch.forEach((animationScrollItem, i) => {
                    if (animationAgain === 'on') { 
                        timeLineLeaveFn(i, animationScrollItem);
                    }
                })
            })
        },50)
        
    }
    //Group go-to-snap
    UxCBMod.goToSection = function(thisSection, sectionGotoTopSpacing){
        let y = $(thisSection).offset().top - sectionGotoTopSpacing;
        gsap.to(window, {
            scrollTo: {y: y, autoKill: false},
            duration: 1
        });
    }
 
    //Group Unier color animation
    UxCBMod.fnModuleParentRowGsap = function(){
        const moduleMainContent = document.querySelector('.entry'),
              moduleParents = moduleMainContent.querySelector('.bm-builder'),
              moduleParentRows = moduleParents.querySelectorAll('.bm-row'),  
              bgUniver = document.querySelector('.univer-color'),
              ifUniverColor = moduleParents.querySelector('[data-change-color="on"]');
        if (moduleParentRows.length) {
            gsap.registerPlugin(ScrollTrigger);
            gsap.utils.toArray(moduleParentRows).forEach( (thisSection, i) => {
                const sectionChangeColor = thisSection.getAttribute('data-change-color'),
                      sectionBackcolor = thisSection.getAttribute('data-backcolor') ? thisSection.getAttribute('data-backcolor') : 'transparent',
                      sectionFrontcolor = thisSection.getAttribute('data-frontcolor'),
                      sectionLogocolor = thisSection.getAttribute('data-logocolor'), 
                      sectionGotoTop = thisSection.getAttribute('data-goto-top'),
                      sectionGotoTopSpacing = thisSection.getAttribute('data-goto-top-spacing'),
                      sectionGotoTopDisableM = thisSection.getAttribute('data-goto-disable-m'); 
                
                //for Group go-to-snap
                let scrollTriggerCreate = function(){
                    ScrollTrigger.create({
                        trigger: thisSection, 
                        start: "top bottom-=1",
                        end: "bottom top+=2",
                        onEnter: () => {
                            UxCBMod.goToSection(thisSection, sectionGotoTopSpacing)
                        },
                        onEnterBack: () => {
                            UxCBMod.goToSection(thisSection, sectionGotoTopSpacing)
                        }
                    });
                }
                if (sectionGotoTop == 'on') {
                    if (sectionGotoTopDisableM === 'on'){
                        ScrollTrigger.matchMedia({
                            '(min-width: 768px)': function() {
                                scrollTriggerCreate();
                            }
                        })
                    } else {
                        scrollTriggerCreate();
                    }
                    
                }

                //for Group univer BG color transition
                function univerColorFn() {
                    gsap.to(bgUniver, { background: sectionBackcolor, duration: 0.3 })
                    UxCBMod.body.get(0).style.setProperty('--fontcolor-univer', sectionFrontcolor);
                    if (sectionChangeColor == 'on') {
                        if (!UxCBMod.body.hasClass('bm-enable-univer')) {
                            UxCBMod.body.addClass('bm-enable-univer');
                        }
                        if (sectionFrontcolor == 'null' || sectionFrontcolor == '') { } else {
                            if (!UxCBMod.body.hasClass('bm-enable-univer-textcolor')) {
                                UxCBMod.body.addClass('bm-enable-univer-textcolor');
                            }
                        }
                    } else {
                        UxCBMod.body.removeClass('bm-enable-univer');
                        UxCBMod.body.removeClass('bm-enable-univer-textcolor');
                    }
                    
                    if (sectionLogocolor == 'default-logo-univer') {
                        UxCBMod.body.removeClass('alt-logo-univer');
                        UxCBMod.body.addClass('default-logo-univer');
                    } else if (sectionLogocolor == 'alt-logo-univer') {
                        UxCBMod.body.removeClass('default-logo-univer');
                        UxCBMod.body.addClass('alt-logo-univer');
                    } else {
                        UxCBMod.body.removeClass('default-logo-univer');
                        UxCBMod.body.removeClass('alt-logo-univer');
                    }
                }
                //Sroll to call unverColorFn
                if (ifUniverColor !== null) {
                    setTimeout(function () { 
                        ScrollTrigger.create({
                            trigger: thisSection,
                            start:'top 50%',
                            end:'bottom 50%',
                            onEnter: () => univerColorFn(),
                            onEnterBack: () => univerColorFn()
                        })
                    },10)
                }
                
            });
        }
    }
    
    //module filter
    UxCBMod.fnModuleFilters = function(module){
        var filters = module.find('.filters [data-filter]'),
            moduleParents = module.find('.container-masonry'),
            moduleMasonryList = moduleParents.find('.masonry-list'),
            moduleUnique = moduleMasonryList.data('unique'),
            dropDown = module.find('.filter-dropdown-wrap'),
            dropDownTrg = module.find('.filter-dropdown-trigger');

        if(filters.length){
            filters.each(function(){
                var filter = $(this);
                let ajaxing = false;

                filter.on('click', function(e){
                    var filterValue = $(this).attr('data-filter');
                    var postID = $(this).attr('data-postid');
                    var postCount = Number($(this).find('.filter-num').text());
                    var postFound = 0;
                    var postNumber = 0;
                    var post__not_in = [];
                    var catID = 0;

                    if ( dropDown.length ) {
                        if ( e.target.innerText ) dropDownTrg.text(e.target.innerText);
                    }

                    if(moduleParents.hasClass('container-masonry')){
                        postFound = Number(moduleParents.attr('data-found'));
                        postNumber = Number(moduleParents.attr('data-number'));
                    }
                    
                    if(moduleMasonryList.hasClass('infiniti-scroll')){
                        moduleMasonryList.addClass('infiniti-scrolling');
                    }
                    
                    var moduleIsotope = UxCBModModuleIsotope[moduleUnique];
                    if(moduleIsotope){
                        moduleIsotope.isotope({ filter: filterValue }); 
                        $(this).parent().siblings().removeClass('active');
                        $(this).parent().addClass('active');
                        
                        if(filterValue != '*'){
                            catID = $(this).attr('data-catid');
                            postFound = postCount;
                        }
                        
                        moduleMasonryList.find('section').each(function(){
                            var section_postid = $(this).attr('data-postid');
                            
                            if(filterValue == '*'){
                                post__not_in.push(section_postid);
                            }else{
                                if($(this).is(filterValue)){
                                    post__not_in.push(section_postid);
                                }
                            }
                        });
                        
                        var isotopeLoadMore = moduleParents.find('.page_twitter');
                        if(post__not_in.length >= postFound){
                            isotopeLoadMore.hide();
                        }else{
                            isotopeLoadMore.show();
                        }
                        
                        if( ajaxing == false ) {
                            ajaxing = true;
                            if((post__not_in.length < postNumber) && (filterValue != '*')){
                                var thisPostNumber = postNumber - post__not_in.length;
                                $.post(ajaxurl, {
                                    'action': 'ux_cb_module_grid_container',
                                    'catID': catID,
                                    'postID': postID,
                                    'post__not_in': post__not_in,
                                    'postNumber': thisPostNumber,
                                    'moduleUnique': moduleUnique
                                }).done(function(result){
                                    var content = $(result);
                                    if(moduleMasonryList.hasClass('metro-list')) {
                                        UxCBMod.fnIsotopeMetro(module, content);
                                        //moduleIsotope.isotope('layout');
                                    }
                                    moduleIsotope.isotope('insert', content);
                                    if(moduleMasonryList.hasClass('infiniti-scroll')){
                                        moduleMasonryList.removeClass('infiniti-scrolling');
                                    }else{
                                        var thisPostCount = moduleMasonryList.find('section' +filterValue).length;
                                        if(thisPostCount >= postFound){
                                            isotopeLoadMore.hide();
                                        }else{
                                            isotopeLoadMore.show();
                                        }
                                    }
                                    
                                    UxCBMod.fnBindFunctionOnAjaxedItems(content);

                                    ajaxing = false;
                                });
                            }else{
                                moduleMasonryList.removeClass('infiniti-scrolling');
                            }
                        }
                        
                    }
                    
                    return false;
                });
                
            });
        }
    }
    
    //module loadmore
    UxCBMod.fnModuleLoadmore = function(module){
        var loadMore = module.find('.page_twitter');
        var loadMoreClick = loadMore.find('> a');
        var moduleParents = module.find('.container-masonry');
        var moduleMasonryList = moduleParents.find('.masonry-list');
        var moduleUnique = loadMore.data('unique');
        var moduleID = loadMore.attr('data-moduleid');
        
        loadMoreClick.on('click',function(){
            var thisMoreClick = $(this);
            var postID = $(this).attr('data-postid');
            var pagedMAX = Number($(this).attr('data-max'));
            var paged = Number($(this).attr('data-paged'));
            var pageText = loadMore.attr('data-pagetext');
            var pageLoadingText = loadMore.attr('data-loadingtext');
            var postFound = 0;
            var catID = 0;
            var post__not_in = [];
            var filters = module.find('.filters');
            var moduleIsotope = UxCBModModuleIsotope[moduleUnique];
            var ajaxAction = 'ux_cb_module_grid_container';
            
            if(moduleParents.hasClass('container-masonry')){
                postFound = Number(moduleParents.attr('data-found'));
            }
            
            if(moduleID == 'masonry-grid'){
                ajaxAction = 'ux_cb_module_masonry_grid_container';
                postFound = Number(thisMoreClick.attr('data-found'));
            }
            
            moduleMasonryList.find('section').each(function(){
                var section_postid = $(this).attr('data-postid');
                
                if(filters.length){
                    var filterActive = filters.find('li.active');
                    var filterValue = filterActive.find('> a').attr('data-filter');
                    var postCount = Number(filterActive.find('.filter-num').text());
                    
                    if(filterValue == '*'){
                        post__not_in.push(section_postid);
                    }else{
                        catID = filterActive.find('> a').attr('data-catid');
                        if($(this).is(filterValue)){
                            post__not_in.push(section_postid);
                        }
                    }
                }else{
                    post__not_in.push(section_postid);
                }
            });
            
            loadMoreClick.text(pageLoadingText);
            
            if(!moduleMasonryList.hasClass('loading-more')){
                moduleMasonryList.addClass('loading-more');
                $.post(ajaxurl, {
                    'action': ajaxAction,
                    'catID': catID,
                    'postID': postID,
                    'post__not_in': post__not_in,
                    'moduleUnique': moduleUnique,
                    'paged-s': paged
                }).done(function(result){
                    var content = $(result);
                    var thisPostCount = moduleMasonryList.find('section[data-postid]').length;
                    
                    if(moduleID == 'masonry-grid'){
                        loadMore.prev().append(content);
                        if(UxCBModGlobal['masonry-grid']){
                            UxCBModGlobal['masonry-grid'].fnGridStackResize(loadMore.prev());
                        }
                        thisPostCount = module.find('.grid-stack-item[data-postid]').length;

                    }else{
                        
                        if(moduleMasonryList.hasClass('metro-list')) {
                            UxCBMod.fnIsotopeMetro(module, content);
                            //moduleIsotope.isotope('layout');
                        }
                        moduleIsotope.isotope('insert', content); 
                        thisPostCount = moduleMasonryList.find('section[data-postid]').length;
                    }
                    
                    loadMoreClick.text(pageText);
                    moduleMasonryList.removeClass('loading-more');
                    
                    thisMoreClick.attr('data-paged', paged + 1);
                    
                    if(filters.length){
                        var filterActive = filters.find('li.active');
                        var filterValue = filterActive.find('> a').attr('data-filter');
                        var postCount = Number(filterActive.find('.filter-num').text());
                        if(filterValue != '*'){
                            thisPostCount = moduleIsotope.find('section' +filterValue+ '[data-postid]').length;
                            postFound = postCount;
                        }else{
                            postFound = postCount;
                        }
                    }
                    
                    if(thisPostCount >= postFound){
                        loadMore.hide();
                    }else{
                        loadMore.show();
                    }
                    
                    UxCBMod.fnBindFunctionOnAjaxedItems(content);

                });
            }
            
            return false;
        });
    }

    //module infiniti scroll
    UxCBMod.fnModuleInfinitiScroll = function(module){
        var infinitiHide = module.find('.infiniscroll-hide');
        if(!infinitiHide.length){
            return;
        }
        var moduleID = infinitiHide.attr('data-moduleid');
        var moduleParents = module.find('.container-masonry');
        var moduleMasonryList = moduleParents.find('.masonry-list');
        if( moduleID == 'masonry-grid' ) {
            moduleMasonryList = module.find('.grid-stack');
        }
        var moduleUnique = moduleMasonryList.data('unique');
        var infinitiDos = infinitiHide.find('.infinite-dots');
        
        setTimeout(function(){

            ScrollTrigger.create({
            trigger: infinitiHide,
            start: "top bottom",
            onEnter: function(){
                var postID = moduleMasonryList.attr('data-postid');
                var paged = Number(infinitiHide.attr('data-paged'));
                var postFound = 0;
                var catID = 0;
                var post__not_in = [];
                var filters = module.find('.filters');
                var moduleIsotope = UxCBModModuleIsotope[moduleUnique];
                var ajaxAction = 'ux_cb_module_grid_container';

                if(moduleParents.hasClass('container-masonry')){
                    postFound = Number(moduleParents.attr('data-found'));
                }

                if(moduleID == 'masonry-grid'){
                    ajaxAction = 'ux_cb_module_masonry_grid_container';
                    postFound = Number(infinitiHide.attr('data-found'));
                }
        
                moduleMasonryList.find('section').each(function(){
                    var section_postid = $(this).attr('data-postid');
                    
                    if(filters.length){
                        var filterActive = filters.find('li.active');
                        var filterValue = filterActive.find('> a').attr('data-filter');
                        var postCount = Number(filterActive.find('.filter-num').text());
                        
                        if(filterValue == '*'){
                            post__not_in.push(section_postid);
                        }else{
                            catID = filterActive.find('> a').attr('data-catid');
                            if($(this).is(filterValue)){
                                post__not_in.push(section_postid);
                            }
                        }
                    }else{
                        post__not_in.push(section_postid);
                    }
                });
                
                if(!moduleMasonryList.hasClass('infiniti-scrolling')){
                    moduleMasonryList.addClass('infiniti-scrolling');
                    infinitiDos.css({'opacity':'1'});
                    $.post(ajaxurl, {
                        'action': ajaxAction,
                        'catID': catID,
                        'postID': postID,
                        'post__not_in': post__not_in,
                        'moduleUnique': moduleUnique,
                        'paged-s': paged
                    }).done(function(result){
                        var content = $(result); 
                        var thisPostCount = moduleMasonryList.find('section[data-postid]').length; 
                        if(moduleID == 'masonry-grid'){ 
                            infinitiHide.prev().append(content);
                            if(UxCBModGlobal['masonry-grid']){
                                UxCBModGlobal['masonry-grid'].fnGridStackResize(infinitiHide.prev()); 
                                infinitiHide.attr('data-paged', paged + 1);
                            }
                            thisPostCount = module.find('.grid-stack-item[data-postid]').length;
                        }else{
                            if(moduleMasonryList.hasClass('metro-list')) {
                                UxCBMod.fnIsotopeMetro(module, content);
                                //moduleIsotope.isotope('layout');
                            }
                            if(moduleIsotope != undefined){
                                moduleIsotope.isotope('insert', content); 
                            }
                            thisPostCount = moduleMasonryList.find('section[data-postid]').length;
                        }
                        
                        
                        if(filters.length){
                            var filterActive = filters.find('li.active');
                            var filterValue = filterActive.find('> a').attr('data-filter');
                            var postCount = Number(filterActive.find('.filter-num').text());
                            if(filterValue != '*'){
                                thisPostCount = moduleIsotope.find('section' +filterValue+ '[data-postid]').length;
                                postFound = postCount;
                            }
                        }
                        
                        if(thisPostCount < postFound){
                            moduleMasonryList.removeClass('infiniti-scrolling');
                        }
                        
                        infinitiDos.css({'display':'none'});

                        UxCBMod.fnModuleInfinitiScroll(module);
                        
                        UxCBMod.fnBindFunctionOnAjaxedItems(content);
                    });
                }
            }
        });

        },10);
        
    }

    //bind function(eg page_loader) for ajaxed items
    UxCBMod.fnBindFunctionOnAjaxedItems = function(content) {
      setTimeout(function() {
          new LazyLoad();
          const newItems = content.find('.grid-item-inside');
          if (newItems.length) {
              if (newItems[0].hasAttribute('data-animation')) {
                  UxCBMod.fnModuleAnimationScroll(newItems);
              }
              if (UxCBMod.pageLoaderEnable && window.sea_page_loader){
                newItems.find('.grid-item-tit-a,.grid-item-cate-a,.grid-item-tag,.grid-item-mask-link').on('click',function(){    
                  sea_page_loader($(this))
                  return false
                })
              }
              if (content.hasClass('sea-grid-item')) {
                UxCBMod.fnGridHoverOnTouch(content);
              }
          }
      }, 10);
    }
    
    //Hover effect of Grid and MasonryGrid for touch screen
    UxCBMod.fnGridHoverOnTouch = function(item){
      if (!Modernizr.touchevents) return;
      item.each(function(){
        var _this = $(this),
        _this_a   = _this.find('.grid-item-mask-link'),
        _this_c   = _this.find('.sea-grid-item-con'),
        _this_url = _this_a.attr('href');
        if (!_this_a.hasClass('lightbox-item')){
          if (_this.find('.grid-item-inside').hasClass('bm-touch-tab')) {
            _this.on('touchstart', sea_debounce(function(e){
              if(!_this_c.hasClass('bm-hover')){
                _this_c.addClass('bm-hover');
                _this.siblings().find('.sea-grid-item-con').removeClass('bm-hover');
              }
              e.stopPropagation();
            },60));
          
            if(!_this_c.hasClass('ux-ajax-page-transition-link')){
              _this.on('click', function(){
                if(_this_c.hasClass('bm-hover')){
                  _this_c.removeClass('bm-hover');
                }
                if (UxCBMod.pageLoaderEnable && window.sea_page_loader) {
                  sea_page_loader(_this_a)
                } else {
                  setTimeout(function(){
                    window.location.href = _this_url;
                  }, 50);
                }
              });
            }
          }
        }
      });
    }

    //Isotope Metro
    UxCBMod.fnIsotopeMetro = function(module, grid_items){
        var winWidth   = window.innerWidth,
            _this_wrap = module.find('.container-masonry'),
            m_list     = _this_wrap.find('.masonry-list'),
            listWidth  = m_list.width(),
            spaceH = m_list.data('spaceh'),
            spaceV = m_list.data('spacev'),
            col = m_list.data('col'),
            ratio  = _this_wrap.data('ratio'),
            gridText   = _this_wrap.data('text');  

        if (winWidth < 768) {
            col = m_list.data('col-m');
            if(col === 1) {
                return;
            }
            spaceH = m_list.data('spaceh-m');
            spaceV = m_list.data('spacev-m');
        }

        if (ratio === '') {
            ratio = 0.75
        }

        var gridW = Math.floor(listWidth / col);

        grid_items.each(function () {
            var grid = $(this).find('.grid-item-inside');
            var gridText = $(this).find('.grid-item-con-text-tit-shown');
            var gridTextH = 0;
            if (gridText.length) {
                gridTextH = gridText.outerHeight(true);
            }
            if ($(this).hasClass('grid-item-tall')){
                grid.css({ 
                    width : gridW * 1 - spaceH + 'px',
                    height : gridW * ratio*2 - spaceV + gridTextH*2 + 'px'
                });
                grid.find('.brick-content').css({
                    paddingTop: ((gridW * ratio*2 - spaceV + gridTextH)/(gridW * 1 - spaceH)) * 100 + '%'
                });
            } else if ($(this).hasClass('grid-item-long')) {
                grid.css({ 
                    width : gridW * 2 - spaceH + 'px',
                    height : gridW * ratio - spaceV + gridTextH + 'px',
                });
                grid.find('.brick-content').css({
                    paddingTop: ((gridW * ratio - spaceV)/(gridW * 2 - spaceH)) * 100 + '%'
                });
            } else if ($(this).hasClass('grid-item-big')) {
                grid.css({ 
                    width : gridW * 2 - spaceH + 'px',
                    height : gridW * ratio*2 - spaceV + gridTextH*2 + 'px',
                });
                grid.find('.brick-content').css({
                    paddingTop: ((gridW * ratio*2 - spaceV + gridTextH)/(gridW * 2 - spaceH)) * 100 + '%'
                });
            } else {
                grid.css({ 
                    width : gridW * 1 - spaceH + 'px',
                    height : gridW * ratio - spaceV + gridTextH + 'px'
                });
                grid.find('.brick-content').css({
                    paddingTop: ((gridW * ratio - spaceV)/(gridW * 1 - spaceH)) * 100 + '%'
                });
            }
        });
    }
    
    //UxCBMod init
    UxCBMod.fnInit = function(){
        //call lazyload
        (function () {
            var myLazyLoad = new LazyLoad({
                elements_selector: ".lazy"
            });
        }());
        
        UxCBMod.module = $('.bm-builder > .module');
        UxCBMod.photoSwipe = $('.lightbox-photoswipe');
        UxCBMod.moduleHasAnimation = $('.module.module-animation');
        UxCBMod.tabs = $('.sea-tabs');
        UxCBMod.buttons = $('.btn-mod-wrap');
        
        //Call Lightbox 
        if(UxCBMod.photoSwipe.length){
            UxCBInitPhotoSwipeFromDOM('.lightbox-photoswipe');
        }
        
        if (UxCBMod.moduleHasAnimation.length) {  
            UxCBMod.moduleHasAnimation.imagesLoaded(function () {           
                UxCBMod.moduleHasAnimation.each(function () {
                    let animationScroll = $(this).find('*[data-animation]');
                    UxCBMod.fnModuleAnimationScroll(animationScroll);
                });
            });
        }

        //Call Hover effect of Grid and MasonryGrid for touch screen 
        UxCBMod.seaGridItem = UxCBMod.module.find('.sea-grid-item');
        if ( UxCBMod.seaGridItem.length){ 
          UxCBMod.fnGridHoverOnTouch(UxCBMod.seaGridItem);
        }

        //Call page loader
        if (UxCBMod.pageLoaderEnable && window.sea_page_loader){
          $('.grid-item-tit-a,.grid-item-cate-a,.grid-item-tag').on('click',function(){    
            sea_page_loader($(this))
            return false
          })
        }
        
        //page module init
        if(UxCBMod.module.length){
            var containerModuleWidthSum = 0;
            UxCBMod.module.each(function(index){
                var module = $(this);
                var moduleParent = module.parent('.bm-builder');
                var moduleWidth = module.width();
                var moduleCol = Number(module.attr('data-module-col'));
                var moduleOffsetNumber = 0;
                
                var moduleOffset = module.attr('class').match(/col-offset-[1-9][0-9]?/);
                if(moduleOffset){
                    switch(moduleOffset[0]){
                        case 'col-offset-1': moduleOffsetNumber = 1; break;
                        case 'col-offset-2': moduleOffsetNumber = 2; break;
                        case 'col-offset-3': moduleOffsetNumber = 3; break;
                        case 'col-offset-4': moduleOffsetNumber = 4; break;
                        case 'col-offset-5': moduleOffsetNumber = 5; break;
                        case 'col-offset-6': moduleOffsetNumber = 6; break;
                        case 'col-offset-7': moduleOffsetNumber = 7; break;
                        case 'col-offset-8': moduleOffsetNumber = 8; break;
                        case 'col-offset-9': moduleOffsetNumber = 9; break;
                        case 'col-offset-10': moduleOffsetNumber = 10; break;
                        case 'col-offset-11': moduleOffsetNumber = 11; break;
                    }
                }
                
                module.attr('data-index', index);
                containerModuleWidthSum = containerModuleWidthSum + moduleCol + moduleOffsetNumber;
                
                if(containerModuleWidthSum > 12 || index == 0 || moduleCol == 0){
                    module.addClass('ux-first-mod-row');
                    var row = $('<div class="bm-row" data-index="' +index+ '" data-frontcolor="" data-backcolor="" data-logocolor=""></div>');
                    moduleParent.append(row);
                }
                
                if(containerModuleWidthSum > 12){
                    containerModuleWidthSum = 0 + moduleCol + moduleOffsetNumber;
                }
                
                if(moduleCol == 0){
                    containerModuleWidthSum = 12;
                }
                
                if(module.hasClass('col-0')){
                    var containerWidth = UxCBMod.body.outerWidth();
                    var containerMargin = (containerWidth - moduleWidth) / 2;

                    $(window).trigger('resize'); 
                }
                
                if(UxCBMod.body.hasClass('page') || UxCBMod.body.hasClass('single') || UxCBMod.body.hasClass('blog')){
                    if(module.find('.filters').length){
                        UxCBMod.fnModuleFilters(module);
                    }
                    if(module.find('.page_twitter').length){
                        UxCBMod.fnModuleLoadmore(module);
                    }
                    if(module.find('.infiniti-scroll').length){
                        setTimeout(function(){
                            UxCBMod.fnModuleInfinitiScroll(module);
                        },20);
                    }
                    if (module.find('.metro-list').length) {
                        UxCBMod.fnIsotopeMetro(module, module.find('.grid-item'));
                        UxCBMod.win.on( 'resize', function () {
                            UxCBMod.fnIsotopeMetro(module, module.find('.grid-item'));
                        }).resize();
                    }
                }

                //Slide down icon
                if(module.find('.sea-scrolldown-btn').length){
                    setTimeout(function(){
                        UxCBMod.sectionHeight = module.find('>.module-inside').height() || 500;
                        module.find('.sea-scrolldown-btn').on('click touchstart',function(){
                            $('html, body').animate({scrollTop:UxCBMod.sectionHeight}, 400);
                            return false;
                        })
                    },10)
                }
            });
            
            UxCBMod.module.each(function(index){
                var module = $(this),
                    moduleChangeColor = module.data('change-color'),
                    moduleForegroundColor = module.data('frontcolor'),
                    moduleBackgroundColor = module.data('backcolor'),
                    moduleLogoColor = module.data('logocolor'),
                    moduleGotoTop = module.data('goto-top'),
                    moduleGotoTopDisableM = module.data('goto-disable-m'),
                    moduleGotoTopSpacing = Number(module.data('goto-top-spacing')), 
                    moduleParent = module.parent('.bm-builder'),
                    moduleParentRows = moduleParent.find('.bm-row'),
                    moduleGroupSameHeight = module.data('groupsameheight');
                if(!moduleForegroundColor){
                    moduleForegroundColor = '';
                }
                if(!moduleBackgroundColor){
                    moduleBackgroundColor = 'transparent';
                }
                
                moduleParentRows.each(function(){
                    var row = $(this);
                    var rowIndex = Number(row.data('index'));
                    var rowNextIndex = Number(row.next().data('index'));
                    
                    if (!rowNextIndex) {    
                        if (index >= rowIndex) {
                            row.append(module);
                            if (moduleChangeColor == 'on') {
                                row.attr('data-change-color', moduleChangeColor);
                                if (row.attr('data-frontcolor') == '') {
                                    row.attr('data-frontcolor', moduleForegroundColor);
                                    row.attr('data-backcolor', moduleBackgroundColor);
                                    row.attr('data-logocolor', moduleLogoColor);
                                    row.attr('data-module', index);
                                }
                            }

                            if(moduleGotoTop == 'on'){
                                row.attr('data-goto-top', moduleGotoTop);
                                row.attr('data-goto-top-spacing', moduleGotoTopSpacing);
                                row.attr('data-goto-disable-m', moduleGotoTopDisableM);
                            }

                            if(moduleGroupSameHeight == 'on'){
                                row.attr('data-groupsameheight', moduleGroupSameHeight);
                            }
                        }

                    } else {
                        
                        if (index >= rowIndex && index < rowNextIndex) {
                            row.append(module);
                            if (moduleChangeColor == 'on') {
                                row.attr('data-change-color', moduleChangeColor);
                                if (row.attr('data-frontcolor') == '') {
                                    row.attr('data-frontcolor', moduleForegroundColor);
                                    row.attr('data-backcolor', moduleBackgroundColor);
                                    row.attr('data-logocolor', moduleLogoColor);
                                    row.attr('data-module', index);
                                }
                            }
                            
                            if(moduleGotoTop == 'on'){
                                row.attr('data-goto-top', moduleGotoTop);
                                row.attr('data-goto-top-spacing', moduleGotoTopSpacing);
                                row.attr('data-goto-disable-m', moduleGotoTopDisableM);
                            }

                            if(moduleGroupSameHeight == 'on'){
                                row.attr('data-groupsameheight', moduleGroupSameHeight);
                            }
                        }
                    }
                });
                moduleParentRows.removeAttr('data-index');
            });
            
            if ($('.entry .bm-builder').length) {
                UxCBMod.fnModuleParentRowGsap();
            }

            //Tabs
            if ( UxCBMod.tabs.length ) {
                UxCBMod.tabs.each(function(){
                    var tabs = $(this);
                    tabs.find('.sea-tab-a').each(function(){
                        var tab_a = $(this),
                            uniID = tab_a.data('item-id'),
                            tab_li = tab_a.parent();
                        tab_a.on('click', function(){ 
                            tab_li.siblings().removeClass('active');
                            if (!tab_li.hasClass('active')) tab_li.addClass('active');
                            tab_a.siblings().removeClass('active');
                            tabs.find('.sea-tab-panel').removeClass('active');
                            tabs.find('.sea-tab-panel-' + uniID).addClass('active');
                            return false;
                        })
                    })
                })
            }

            //Buttons - hover image
            if (UxCBMod.buttons.length) {
              let winH = UxCBMod.win.height(),
                  winW = UxCBMod.win.width();
              UxCBMod.buttonsHoverImgPosi = function(btnImg){
                let btnImgId = btnImg.data('btnitem'),
                    btn = btnImg.siblings('.ux-btn-a-'+btnImgId),
                    originPosi;
                if (btn.hasClass('below-btn')){
                  originPosi = 'below'
                }
                if (Modernizr.touchevents) {
                  btn.attr('href', '');
                }
                let btnoffLeft = btn.offset()['left'],
                    btnOffTop = btn.offset()['top'],
                    btnImgLeft = btnoffLeft + (btn.outerWidth() / 2 - btnImg.width() / 2),
                    isOutScreenBottom = btnImg.offset()['top'] - UxCBMod.win.scrollTop() + btnImg.height() - winH,
                    isOutScreenTop = UxCBMod.win.scrollTop() - btnImg.offset()['top'],
                    isOutScreenLeft = 0 - btnImg.offset()['left'],
                    isOutScreenRight = btnImgLeft + btnImg.width() - winW;

                if (btnImgLeft < 0) { 
                  btnImgLeft = btnoffLeft; 
                }
                if (isOutScreenRight > 0) {
                  btnImg.css({'right': 0});
                } else {
                  btnImg.offset({'left': btnImgLeft});
                }
                if ( isOutScreenBottom > 0 && isOutScreenTop > 0) return;
                if ((btn.hasClass('below-btn') && isOutScreenBottom > 0) || (btn.hasClass('over-btn') && isOutScreenTop > 0)) { 
                  btn.toggleClass('below-btn').toggleClass('over-btn'); 
                }
              }

              UxCBMod.buttons.each(function(){
                let button = $(this);
                if (button.find('.btn-img-wrap').length) {
                  button.find('.btn-img-wrap').each(function(){
                    let btnImg = $(this),
                        btnImgId = btnImg.data('btnitem'),
                        btn = btnImg.siblings('.ux-btn-a-'+btnImgId),
                        href = btn.attr('href');

                    UxCBMod.buttonsHoverImgPosi(btnImg);
                    
                    UxCBMod.win.on('scroll resize', sea_throttle(function() {
                      UxCBMod.buttonsHoverImgPosi(btnImg);
                      if (btn.hasClass('bm-hover')) btn.removeClass('bm-hover');
                    },300));
                    
                    btn.on('mouseenter touchstart touchend click', function(e) {
                      if (Modernizr.touchevents && e.type === 'click') {
                        e.preventDefault;
                      } 
                    	if (e.type === 'touchstart' || e.type === 'touchend') {
                    		if (btn.hasClass('bm-hover')){
                    			return;
                    		}else{
                          UxCBMod.body.find('.ux-btn').removeClass('bm-hover');
                    			btn.addClass('bm-hover');
                    		}
                      }

                      if (e.type === 'touchstart' || e.type === 'touchend') {
                      	if (href) btn.attr('href', href);
                      	return false;
                      }
                      
                    })
                  })//end btn each
                }
              })
            }
        }
    }
    
    //document ready
    UxCBMod.doc.ready(function(){
        if(UxCBModGlobal){
            UxCBModGlobal['global'] = UxCBMod;
        }
    });
    
    //win load
    UxCBMod.win.on('load',function(){
        UxCBMod.fnInit();
    });

    //Call Font observer
    if (UxCBMod.body.hasClass('without-page-fadein')) {
        var seaFontobservers = []; 
        Object.keys(seaFontData).forEach(function(family) {
            var data = seaFontData[family];
            var obs = new FontFaceObserver(family, data);
            seaFontobservers.push(obs.load());
        });

        Promise.all(seaFontobservers).then(function(fonts) {
            UxCBMod.body.removeClass('without-page-fadein');
        }).catch(function(err) {
            console.warn('Some critical font are not available:', err);
            UxCBMod.body.removeClass('without-page-fadein');
        });
    }
    
})(jQuery);

function UxCBInitPhotoSwipeFromDOM(gallerySelector){
    var parseThumbnailElements = function(el){
        var thumbElements = jQuery(el).find('[data-lightbox=\"true\"]'),
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            type,
            item,
            seaGridItem;

        for(var i = 0; i < numNodes; i++){

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1){
                continue;
            }

            //linkEl = figureEl.children[0]; // <a> element
            linkEl = jQuery(figureEl).find('.lightbox-item');

            size = linkEl.attr('data-size') ? linkEl.attr('data-size').split('x') : [800, 600];
            type = linkEl.attr('data-type');

            // create slide object
            if(type == 'video'){
                item = {
                    html: linkEl.find('> div').html()
                }
            }else{
                item = {
                    src: linkEl.attr('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };
            }

            if(figureEl.children.length > 0){
                // <figcaption> content
                item.title = linkEl.attr('data-title') ? linkEl.attr('data-title') : linkEl.attr('title'); 
            }

            if(linkEl.find('img').length > 0){
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.find('img').attr('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn

            seaGridItem = jQuery(figureEl).parents('.sea-grid-item');
            
            if( seaGridItem.length ){
                if( seaGridItem.is(":visible") ){
                    items.push(item);
                }
            } else {
                items.push(item);
            }
            
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn){
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e){
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el){
            if(el.tagName) return (el.hasAttribute('data-lightbox') && el.getAttribute('data-lightbox') === 'true');
        });

        if (!clickedListItem){
            if (jQuery(e.target).is('a') || jQuery(e.target).parents().is('a')){ 
                var targetUrl = jQuery(e.target).attr('href') || jQuery(e.target).parents('a').attr('href');
                if (!targetUrl) return;
                if(e.target.target === '_blank'){
                    window.open(targetUrl,'_blank');
                } else{
                   return window.location.href = targetUrl;
                }
            }
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = jQuery(clickedListItem).parents('.lightbox-photoswipe'),
            childNodes = clickedGallery.find('[data-lightbox=\"true\"]'),
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index,
            seaGridItem;

        for (var i = 0; i < numChildNodes; i++){
            
            if(childNodes[i].nodeType !== 1){ 
                continue; 
            }

            seaGridItem = jQuery(childNodes[i]).parents('.sea-grid-item');
            
            if(seaGridItem.length){
                if(!seaGridItem.is(":visible")){
                    continue;
                }
            }

            if(childNodes[i] === clickedListItem){
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        
        if(index >= 0){
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery[0]);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function(){
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if(!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL){
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items,
            shareButtons = [
                {id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
                {id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
                {id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/'+ '?url={{url}}&media={{image_url}}&description={{text}}'},
                {id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
            ];

        items = parseThumbnailElements(galleryElement);
        if(typeof photoSwipeLocalize!=="undefined"){
            shareButtons = photoSwipeLocalize;
        }

        // define options (if needed)
        options = {
            index: index,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            showHideOpacity:true,

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },
            
            addCaptionHTMLFn: function(item, captionEl, isFake) {
                if(!item.title) {
                    captionEl.children[0].innerText = '';
                    return false;
                }
                captionEl.children[0].innerHTML = item.title;
                return true;
            },
            
            getImageURLForShare: function( shareButtonData ) { 
                return items[index].src || '';
            },

            shareButtons: shareButtons,
            
            getPageURLForShare: function( shareButtonData ) {
                return items[index].src || '';
            },
            
            getTextForShare: function( shareButtonData ) {
                return items[index].title || '';
            },
            
            // Parse output of share links
            parseShareButtonOut: function(shareButtonData, shareButtonOut) { 
                return shareButtonOut;
            }
        };
        
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        var radios = document.getElementsByName('gallery-style');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                if(radios[i].id == 'radio-all-controls') {

                } else if(radios[i].id == 'radio-minimal-black') {
                    options.mainClass = 'pswp--minimal--dark';
                    options.barsSize = {top:0,bottom:0};
                    options.captionEl = false;
                    options.fullscreenEl = false;
                    options.shareEl = false;
                    options.bgOpacity = 0.85;
                    options.tapToClose = true;
                    options.tapToToggleControls = false;
                }
                break;
            }
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
        gallery.listen('beforeChange', function() {
          var currItem = jQuery(gallery.currItem.container);
          jQuery('.videoWrapper iframe').removeClass('active');
          var currItemIframe = currItem.find('.videoWrapper iframe').addClass('active');
          jQuery('.videoWrapper iframe').each(function() {
            if (!jQuery(this).hasClass('active')) {
              jQuery(this).attr('src', jQuery(this).attr('src'));
            }
          });
        });

        gallery.listen('close', function() {
            isFilterClick = true;
          jQuery('.videoWrapper iframe').each(function() {
            jQuery(this).attr('src', jQuery(this).attr('src'));
          });
        }); 
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);
    
    for(var i = 0, l = galleryElements.length; i < l; i++){
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
}