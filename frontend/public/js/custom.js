$(document).ready(function(){
    $('#mobile-menu').click(function(){
      $('.mobile-menu').addClass('active');
      $('header').addClass('active');
      $('.black-layer').addClass('active');
      $('body').addClass('overflow-off');
      $('html').addClass('overflow-off');
    });
    $('.close-btn').click(function(){
      $('.black-layer').removeClass('active');
      $('.mobile-menu').removeClass('active');
      $('header').removeClass('active');
      $('body').removeClass('overflow-off');
      $('html').removeClass('overflow-off');
    });
    $('.black-layer').click(function(){
      $(this).removeClass('active');
      $('.mobile-menu').removeClass('active');
      $('header').removeClass('active');
      $('body').removeClass('overflow-off');
      $('html').removeClass('overflow-off');
    });
});

$(document).ready(function(){
    $('.cart-box').click(function(){
      $('.cart-box-parent').addClass('active');
      $('header').addClass('active');
      $('.black-layer').addClass('active');
      $(this).addClass('active');
      $('body').addClass('overflow-off');
      $('html').addClass('overflow-off');
    });
    $('.cancel-btn').click(function(){
      $('.black-layer').removeClass('active');
      $('.cart-box-parent').removeClass('active');
      $('header').removeClass('active');
      $('.cart-box').removeClass('active');
      $('body').removeClass('overflow-off');
      $('html').removeClass('overflow-off');
    });
    $('.black-layer').click(function(){
      $(this).removeClass('active');
      $('.cart-box-parent').removeClass('active');
      $('header').removeClass('active');
      $('.cart-box').removeClass('active');
      $('body').removeClass('overflow-off');
      $('html').removeClass('overflow-off');
    });
});
$(document).ready(function(){
    $('.like-btn').click(function(){
      $('.wishlist-wrapper-box').addClass('active');
      $('header').addClass('active');
      $('.black-layer').addClass('active');
      $(this).addClass('active');
      $('body').addClass('overflow-off');
      $('html').addClass('overflow-off');
    });
    $('.cancel-btn').click(function(){
      $('.black-layer').removeClass('active');
      $('.wishlist-wrapper-box').removeClass('active');
      $('header').removeClass('active');
      $('.like-btn').removeClass('active');
      $('body').removeClass('overflow-off');
      $('html').removeClass('overflow-off');
    });
    $('.black-layer').click(function(){
      $(this).removeClass('active');
      $('.wishlist-wrapper-box').removeClass('active');
      $('header').removeClass('active');
      $('.like-btn').removeClass('active');
      $('body').removeClass('overflow-off');
      $('html').removeClass('overflow-off');
    });
});

$(document).ready(function(){
  const header = document.querySelector("header");
  const toggleClass = "is-sticky";

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add(toggleClass);
    } else {
      header.classList.remove(toggleClass);
    }
  });
});


