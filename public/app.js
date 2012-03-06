(function ($, undefined) {
  "use strict";

  var board = $('#board');

  function resizeCells() {
    var tds = board.find('td');
    tds.height(tds.width());
  }

  $(window).resize(resizeCells);
  $(resizeCells);

  board.on('click', 'td', function () {
    $(this).toggleClass('marked');
  });
})(jQuery);
