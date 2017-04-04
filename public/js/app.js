$(document).ready(function () {
    
    $('#tags').tagsInput({
        'height': '60px',
        'width': '280px'
    });
    
    var mywindow = $(document);
    //var mywindow = $('.content');
    var mypos = mywindow.scrollTop(),
        up = false,
        newscroll;
    
    var topNav = $('#mainNav');
    
    mywindow.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
        newscroll = mywindow.scrollTop();
        if (newscroll > mypos && !up) {
            
            topNav.addClass('scroll-down');
            
            up = !up;
            
        } else if (newscroll < mypos && up) {
            
            up = !up;
            
        } else if (newscroll === 0) {
            
            topNav.removeClass('scroll-down');
            
        }
        mypos = newscroll;
    });
    
});

