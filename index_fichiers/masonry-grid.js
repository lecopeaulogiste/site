//mod -> masonry-grid

(function($){

    "use strict";
    
    var UxCBMod = [];
    
    //window
    UxCBMod.win = $(window);
    UxCBMod.doc = $(document);
    UxCBMod.body= $('body');

    //fn grid stack init size
    UxCBMod.fnGridStackInitSize = function(gridStack){
        gridStack.find('.grid-stack-item').each(function(){
            var gs_x = Number($(this).attr('data-gs-x'));
            var gs_y = Number($(this).attr('data-gs-y'));
            var gs_width = Number($(this).attr('data-gs-width'));
            var gs_height = Number($(this).attr('data-gs-height'));
            
            $(this).attr({
                'data-o-x': gs_x,
                'data-o-y': gs_y,
                'data-o-width': gs_width,
                'data-o-height': gs_height
            });
        });
        
        UxCBMod.fnGridStackOrder(gridStack);
    }
    
    UxCBMod.fnArrayUnique = function(array){
        var n = [];
        for(var i = 0; i < array.length; i++){
            if (n.indexOf(array[i]) == -1) n.push(array[i]);
        }
        return n;
    }
    
    UxCBMod.fnArraySortNumber = function(a,b){
        return a - b
    }
    
    UxCBMod.fnGridStackOrder = function(gridStack){
        var orderArray = [];
        
        gridStack.find('.grid-stack-item').each(function(){
            var gs_y = Number($(this).attr('data-gs-y'));
            orderArray.push(gs_y);
        });
        
        orderArray = UxCBMod.fnArrayUnique(orderArray);
        orderArray.sort(UxCBMod.fnArraySortNumber);
        
        var newOrderArray = [];
        var orderIndex = 0;
        
        $.each(orderArray, function(index, orderY){
            var xOrder = [];
            orderY = Number(orderY);
            gridStack.find('.grid-stack-item').each(function(){
                var gs_x = Number($(this).attr('data-gs-x'));
                var gs_y = Number($(this).attr('data-gs-y'));
                
                if(Number(orderY) == gs_y){
                    xOrder.push(gs_x);
                }
            });
            
            xOrder = UxCBMod.fnArrayUnique(xOrder);
            xOrder.sort(UxCBMod.fnArraySortNumber);
            
            $.each(xOrder, function(index, orderX){
                orderX = Number(orderX);
                var orderTarget = gridStack.find('.grid-stack-item[data-gs-x="' +orderX+ '"][data-gs-y="' +orderY+ '"]');
                
                if(orderTarget.length){
                    orderTarget.attr('data-gs-order', orderIndex);
                    gridStack.append(orderTarget);
                    orderIndex++;
                }
            });
        });
    }
    
    //fn grid stack resize
    UxCBMod.fnGridStackResize = function(gridStack){
        var gridStackWidth = gridStack.width(); 
        var gridStackSpacingH = gridStack.data('spacing-h');
        var gridStackSpacingV = gridStack.data('spacing-v');
        if (UxCBMod.win.width() < 768 && gridStack.hasClass('grid-stack-origin-layout-mobile')) { 
            var gridStackSpacingH = gridStack.data('spacing-mobile-h');
            var gridStackSpacingV = gridStack.data('spacing-mobile-v');
        }
        var gridStackColWidth = (gridStackWidth + gridStackSpacingH) / 24;
        var gridStackOffsetTop = gridStack.offset().top;
        var gridOffsetTop = [];
        
        
        gridStack.find('.grid-stack-item').each(function(){
            var item = $(this),
                gs_x = Number(item.attr('data-gs-x')),
                gs_y = Number(item.attr('data-gs-y')),
                gs_width = Number(item.attr('data-gs-width')),
                gs_height = Number(item.attr('data-gs-height')),
                set_height = gridStackColWidth * gs_height,
                set_top = gridStackColWidth * gs_y,
                gs_content = item.find('.grid-stack-item-content'),
                gs_brick_content = item.find('.brick-content');
            
            item.css({
                'position': 'absolute',
                width: gridStackColWidth * gs_width + 'px',
                height: set_height + 'px',
                left: gridStackColWidth * gs_x + 'px',
                top: set_top + 'px'
            });
            if(gridStack.hasClass('masonry-grid-show-text')){
                var text_height = gs_brick_content.find('.grid-item-con-text-show').height();
                var image_height = Number(set_height - text_height);
               // gs_brick_content.css('max-height',+image_height+'px');
            }
            
            if (gs_content.height() > 0 && gs_content.width() > 0){
                setTimeout(function(){
                    if (UxCBMod.win.width() < 767 && !gridStack.hasClass('grid-stack-origin-layout-mobile')) { 
                        gs_brick_content.css('padding-top', (gs_height / gs_width) * 100 + '%');
                    } else {
                        gs_brick_content.css('padding-top', (gs_content.height() / gs_content.width()) * 100 + '%');
                    }
                    
                },20); 
            }
            
            gridOffsetTop.push(set_top + item.height());
             
        });
        
        var gridStackHeight = Math.max.apply(Math,gridOffsetTop);
        gridStack.height(gridStackHeight);
        
        if (!gridStack.hasClass('grid-stack-origin-layout-mobile') ) {
            if(UxCBMod.win.width() <= 767){
                if (!gridStack.hasClass('grid-stack-one-column-mode')) {
                    gridStack.addClass('grid-stack-one-column-mode');
                }
            }else{
                if (gridStack.hasClass('grid-stack-one-column-mode')) {
                    gridStack.removeClass('grid-stack-one-column-mode');
                }
            }
        }
    }
    
    //UxCBMod init
    UxCBMod.fnInit = function(){
        UxCBMod.module = $('.bm-builder > .module');
        if(!UxCBMod.module.length){
            if($('.bm-builder > .bm-row').length){
                UxCBMod.module = $('.bm-builder > .bm-row > .module');
            }
        }
        
        UxCBMod.gridStack = UxCBMod.module.find('.grid-stack');
        UxCBMod.gridactiveTitLink = UxCBMod.module.find('.grid-active-titlelink');
        
        //grid Stack(custom portfolio)
        if(UxCBMod.gridStack.length){
            UxCBMod.gridStack.each(function(){
                var gridStack = $(this),
                    gridStackSpacingH = gridStack.data('spacing-h'),
                    gridStackSpacingV = gridStack.data('spacing-v'),
                    module = gridStack.parents('.module');
                if (UxCBMod.win.width() < 768 && gridStack.hasClass('grid-stack-origin-layout-mobile')) { 
                    var gridStackSpacingH = gridStack.data('spacing-mobile-h');
                    var gridStackSpacingV = gridStack.data('spacing-mobile-v');
                }
                gridStack.css({
                    'marginTop': - gridStackSpacingV * 0.5 + 'px',
                    'marginBottom': - gridStackSpacingV * 0.5 + 'px',
                    'marginLeft': - gridStackSpacingH * 0.5 + 'px',
                    'marginRight': - gridStackSpacingH * 0.5 + 'px'
                });
                
                UxCBMod.fnGridStackInitSize(gridStack);
                
                var isoGridStack = gridStack.isotope({ 
                    itemSelector: '.grid-stack-item',
                    layoutMode: 'packery',
                    stagger: 40,
                    resize: false,
                    getSortData: {
                        number: '[data-gs-order]'
                    },
                    sortBy : 'number'
                });
                
                gridStack.removeClass('hidden');
                UxCBMod.fnGridStackResize(gridStack);
                
                UxCBMod.win.on('resize', sea_debounce(function(){
                    var filters = module.find('.filters');
                    
                    var filterActive = filters.find('li.active');
                    var filterValue = filterActive.find('> a').attr('data-filter');
                    
                    if(filterValue){
                        if(filterValue != '*'){
                            isoGridStack.isotope('layout');
                        }else{
                            UxCBMod.fnGridStackResize(gridStack);
                        }
                    }else{
                        UxCBMod.fnGridStackResize(gridStack);
                    }
                },300));
                
                var grid = gridStack.data('gridstack');
                
                var filterHidden = false;
                if(module.find('.filters').length){
                    var _filters = module.find('.filters [data-filter]');
                    
                    _filters.on('click', function(){
                        var filterValue = $(this).attr('data-filter');
                        var filterCatID = $(this).attr('data-catid');
                        var filterItems = [];
                        var filterCount = Number($(this).find('.filter-num').text());
                        var post__not_in = [];
                        var postCount = 0;
                        
                        $(this).parent().parent().find('li').removeClass('active');
                        $(this).parent().addClass('active');
                        
                        if(filterValue == '*'){
                            filterCatID = 0;
                            filterHidden = gridStack.find('.grid-stack-item:hidden');
                            UxCBMod.fnGridStackResize(gridStack);
                            filterHidden.show();
                        }else{
                            if(filterHidden){
                                filterHidden.hide();
                            }
                            
                            isoGridStack.isotope({ filter: filterValue });
                        }
                        return false;
                    });
                }
            });
        }

    };
    
    //document ready
    UxCBMod.doc.ready(function(){
        if(UxCBModGlobal){
            UxCBModGlobal['masonry-grid'] = UxCBMod;
        }
    });
    
    //win load
    UxCBMod.win.on('load',function(){
        UxCBMod.fnInit();
    });
    
    
})(jQuery);