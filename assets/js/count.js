$(document).ready(function () {
  let counterShown = false;

  $(window).on('scroll', function () {
    if (!counterShown && isScrolledIntoView($('.count'))) {
      $('.count').each(function () {
        var $this = $(this);
        $({ Counter: 0 }).animate(
          { Counter: $this.text().replace(/\D/g, '') },
          {
            duration: 2000,
            easing: 'swing',
            step: function () {
              $this.text(Math.ceil(this.Counter));
            },
          }
        );
      });

      counterShown = true;
    }
  });

  function isScrolledIntoView($elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $elem.offset().top;

    return elemTop <= docViewBottom;
  }
});
