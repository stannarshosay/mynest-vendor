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
    var slDropdown__cart = document.querySelector('.sl-dropdown__cart')
    if (slDropdown__cart !== null) {
        jQuery(document).on('click', '.sl-dropdown__cart', function(e) {
            e.stopPropagation();
        })
    }
    var dropdown_notify = document.querySelector('.sl-dropdown__notify')
    if (dropdown_notify !== null) {
        jQuery(document).on('click', '.sl-dropdown__notify', function(e) {
            e.stopPropagation();
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
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll > 0) {
            $("header").addClass("shadow");
        } else {
            $("header").removeClass("shadow");
        }
    });
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