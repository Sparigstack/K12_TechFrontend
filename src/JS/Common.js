import $ from 'jquery';
$(function () {
    "use strict";

    $(".nav-toggle-icon").on("click", function () {
        $(".wrapper").toggleClass("toggled");
    });

    $(".mobile-toggle-icon").on("click", function () {
        $(".wrapper").addClass("toggled");
    });

    $('.metismenu li a').on('click', function (e) {
        var changeImage = $(this).attr('changeimg');
        $(this).parent().addClass('mm-active');
        $(this).parent().find(".ChangeImage").attr('src', changeImage);
    });
    $(".metismenu li a").mouseover(function (e) {
        if (!$(this).parent().hasClass('mm-active')) {
            var changeImage = e.currentTarget.attributes[1].value;
            $(this).find(".ChangeImage").attr('src', changeImage);
        }
    });
    $(".metismenu li a").mouseout(function (e) {
        if (!$(this).parent().hasClass('mm-active')) {
            var changeImage = e.currentTarget.attributes[2].value;
            $(this).find(".ChangeImage").attr('src', changeImage);
        }
    });

    $(".search-toggle-icon").on("click", function () {
        $(".top-header .navbar form").addClass("full-searchbar");
    });
    $(".search-close-icon").on("click", function () {
        $(".top-header .navbar form").removeClass("full-searchbar");
    });

    $(document).ready(function () {
        var WindowWidth = $(window).width();
        const $button = document.querySelector('#sidebar-toggle');
        const $wrapper = document.querySelector('.wrapper');
        $('.metismenu li a').each(function (e) {
            if ($(this).attr('href') == window.location.pathname) {
                var changeImage = $(this).attr('changeimg');
                $(this).parent().addClass('mm-active');
                $(this).parent().find(".ChangeImage").attr('src', changeImage);
            }
        });
        $button.addEventListener('click', (e) => {
            e.preventDefault();
            $wrapper.classList.toggle('toggled');
            if (WindowWidth >= 1025) {
                $("#LeftMenuLogo").attr('src', '');
                $("#LeftMenuLogo").attr('src', '/images/SideMenu/SmallLogoIcon.svg');
                $("#LeftMenuLogo").attr('SmallScreen', 'Yes');
            }
        });

        $("#LeftMenuLogo").on('click', function (e) {
            e.preventDefault();
            $wrapper.classList.toggle('toggled');
            if ($("#LeftMenuLogo").attr('SmallScreen') == 'Yes') {
                $("#LeftMenuLogo").attr('src', '');
                $("#LeftMenuLogo").attr('src', '/images/SideMenu/SmallLogoIcon.svg');
                $("#LeftMenuLogo").attr('SmallScreen', 'No');
            } else {
                $("#LeftMenuLogo").attr('src', '');
                $("#LeftMenuLogo").attr('src', '/images/SideMenu/logo-icon.svg');
                $("#LeftMenuLogo").attr('SmallScreen', 'Yes');
            }
        });
        $("#sidebar-toggle").on('click', function (e) {
            if ($("#LeftMenuLogo").attr('SmallScreen') == 'Yes') {
                $("#LeftMenuLogo").attr('src', '');
                $("#LeftMenuLogo").attr('src', '/images/SideMenu/SmallLogoIcon.svg');
                $("#LeftMenuLogo").attr('SmallScreen', 'No');
            } else {
                $("#LeftMenuLogo").attr('src', '');
                $("#LeftMenuLogo").attr('src', '/images/SideMenu/logo-icon.svg');
                $("#LeftMenuLogo").attr('SmallScreen', 'Yes');
            }
        });

    })

});


