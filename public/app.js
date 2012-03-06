(function ($, undefined) {
  "use strict";

  var board = $('#board'),
      size = 8,
      difficulty = 'NORMAL',
      currentGame,
      gameState = {}

  function resizeCells() {
    var tds = board.find('td');
    tds.height(tds.width());
  }

  $(window).resize(resizeCells);
  $(resizeCells);

  board.on('click', 'td', function () {
    $(this).toggleClass('marked');
  });

  $('#newGameControl').on('click', 'ul li, div>a:first-child', function (event) {
    promptNewGame((function () {
      // Select the difficulty in the list
      if (this.tagName.toUpperCase() === 'LI') {
        $(this).siblings().removeClass('active').end().addClass('active');
      }
      currentGame = new MinesweeperGame(size, difficulty);
    }).bind(this));
  }).find("li[data-difficulty='" + difficulty + "']").addClass('active');

  $('#sizeSelector').on('change', function () {
    promptNewGame((function () {
      size = $(this).val();
      currentGame = new MinesweeperGame(size, difficulty);
    }).bind(this), (function () {
      $(this).val(size);
    }).bind(this));
  }).val(8);

  function promptNewGame(continueCallback, cancelCallback) {
    if (false) {
      // Prompt for continue, then call callback

    } else {
      continueCallback();
    }
  }
})(jQuery);
