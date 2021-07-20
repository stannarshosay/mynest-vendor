"use strict";
jQuery(document).on('ready', function() {
    var slInputIncrement = document.querySelector('.sl-input-increment')
    if (slInputIncrement !== null) {
        jQuery(document).on('click', '.sl-input-increment', function(e) {
            var $input = $(this).closest('.sl-vlaue-btn').find('.sl-input-number');
            var val = parseInt($input.val(), 10);
            $input.val(val + 1);
        })
        jQuery(document).on('click', '.sl-input-decrement', function(e) {
            var $input = $(this).closest('.sl-vlaue-btn').find('.sl-input-number');
            var val = parseInt($input.val(), 10);
            if (val >= 1) {
                $input.val(val - 1);
            }
        })
    }
    var slCartDelete = document.querySelector('.sl-cart-delete')
    if (slCartDelete !== null) {
        jQuery(document).on('click', '.sl-cart-delete', function(e) {
            $(this).closest('li').remove();
        })
    }

    jQuery(document).on('click', '#collapseUser a', function(e) {
        e.preventDefault();
        var usertext = jQuery(this).find('em').text();
        var circlecolor = jQuery(this).find('span').attr('class');

        jQuery('.sl-userStatus__content > a:first-child > span + em').html(usertext)
        jQuery('.sl-userStatus__content > a:first-child > span em').removeClass().addClass(circlecolor);
        $('#collapseUser').collapse('toggle');
    });
    // DHB USER LOGO END

    //Add shadow to header
    //navbar close for mobile view

    $(document).click(function(event) {
        var clickover = $(event.target);
        var _opened = $("#slMainNavbar").hasClass("show");
        var isToggler = clickover.hasClass("lnr lnr-menu") || clickover.hasClass("navbar-toggler");
        if (_opened && !(isToggler)) {
            $(".navbar-toggler").click();
        }
    });

    //Add shadow to header
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll > 0) {
            $("header").addClass("shadow");
        } else {
            $("header").removeClass("shadow");
        }
    });

    //header functions

    var didScroll;
    var lastScrollTop = 0;
    var delta = 70;

    $(window).scroll(function(event) {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var w = $(window).width();
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(lastScrollTop - st) <= delta)
            return;
        if (st > lastScrollTop) {
            if (w <= 620) {
                $(".sl-main-header__lower").css("overflow", "hidden");
                $(".sl-main-header__lower").css("padding", "0px");
            }
            $(".sl-main-header__lower").css("height", "0px");
            $(".sl-main-header__logo img").css('width', '40px');

        } else {
            if (w <= 620) {
                $(".sl-main-header__lower").css("overflow", "visible");
                $(".sl-main-header__lower").css("padding", "10px 20px");
            }
            $(".sl-main-header__lower").css("height", "49px");
            $(".sl-main-header__logo img").css('width', '70px');
        }
        lastScrollTop = st;
    }
    /* ADD AND REMOVE CLASS END */
    jQuery(document).on('click', '#sl-closeasidebar', function(e) {
        jQuery('#sl-asidebar').toggleClass('sl-asideshow')
        jQuery('body').toggleClass('sl-scrollY-none')
        jQuery(this).find('i').toggleClass('lnr lnr-layers lnr lnr-cross')
    });
    jQuery(document).on('click', '.sl-inbox__user--list li', function() {
        jQuery('.sl-dashboardbox__content').addClass('sl-message-js')
    });
    jQuery(document).on('click', '.sl-messageUser__back', function() {
        jQuery('.sl-dashboardbox__content').removeClass('sl-message-js')
    });
    /* MOBILE MENU*/
    function collapseMenu() {
        if ($(window).width() < 992) {
            jQuery('.sl-main-header .navbar-collapse .sl-navbar-nav li.sl-dropdown a, .sl-main-header .navbar-collapse .sl-navbar-nav li.menu-item-has-mega-menu a').on('click', function() {
                jQuery(this).parent('li').toggleClass('sl-open-menu');
                jQuery(this).next().slideToggle(300);
            });
        }
    }
    collapseMenu();
    /* MOBILE MENU*/
    jQuery(document).on('click', '#sl-appointmentPopupbtn1', function(e) {
        jQuery(this).closest('.modal-content').addClass('sl-appointmentPopup__1 sl-appointmentPopup-footer')
    })
    jQuery(document).on('click', '#sl-appointmentPopupbtn2', function(e) {
        jQuery(this).closest('.modal-content').removeClass('sl-appointmentPopup__1').addClass('sl-appointmentPopup__2')
    })
    jQuery(document).on('click', '#sl-appointmentPopupbtn3', function(e) {
        jQuery(this).closest('.modal-content').removeClass('sl-appointmentPopup__2').addClass('sl-appointmentPopup__3')
    })
    jQuery(document).on('click', '.modal-header .close', function(e) {
            jQuery(this).closest('.modal-content').removeClass('sl-appointmentPopup__1 sl-appointmentPopup__2 sl-appointmentPopup__3 sl-appointmentPopup-footer')
        })
        /* PRELOADER*/
    jQuery(window).on('load', function() {
        jQuery(".preloader-outer").fadeOut();
    });


});