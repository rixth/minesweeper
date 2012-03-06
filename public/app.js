(function ($, undefined) {
  // "use strict";

  var board = $('#board'),
      size = 8,
      difficulty = 'NORMAL',
      // currentGame,
      gameState = {};

  function resizeCells() {
    var cells = board.find('.cell');
    cells.height(cells.width());
  }

  $(window).resize(resizeCells);
  $(resizeCells);

  $('#newGameControl').on('click', 'ul li, div>a:first-child', function (event) {
    promptNewGame((function () {
      // Select the difficulty in the list
      if (this.tagName.toUpperCase() === 'LI') {
        difficulty = $(this).attr('data-difficulty');
        $(this).siblings().removeClass('active').end().addClass('active');
      }
      startNewGame();
    }).bind(this));
  }).find("li[data-difficulty='" + difficulty + "']").addClass('active');

  $('#sizeSelector').on('change', function () {
    promptNewGame((function () {
      size = $(this).val();
      startNewGame();
    }).bind(this), (function () {
      $(this).val(size);
    }).bind(this));
  }).val(8);


  $(function () {
    board.on('gameCreated', function () {
      currentGame.renderFull();
      resizeCells();
      updateButtonVisiblity();
    }).on('gameOver', function () {
      alert('GAME OVER');
      updateButtonVisiblity();
    }).on('mousedown', '.cell', function (event) {
      var data = $(this).data();
      currentGame.cellClick(data.x, data.y, event.which === 3);
      updateButtonVisiblity();
    }).on('contextmenu', function () {
      return false;
    })    
  });

  $('#cheat').on('click', function () {
    board.toggleClass('cheating');
  });

  function promptNewGame(continueCallback, cancelCallback) {
    if (false) {
      // Prompt for continue, then call callback

    } else {
      continueCallback();
    }
  }

  function startNewGame(options) {
    options = options || {};
    currentGame = new MinesweeperGame(options.board || board, options.size || size, options.difficulty || difficulty);
  }

  function updateButtonVisiblity() {
    var cheatButton = $('#cheat'),
        validateButton = $('#validate');

    validateButton.toggleClass('hidden', !currentGame.inProgress || currentGame.isGameOver);
    cheatButton.toggleClass('hidden', currentGame.isGameOver);
  }

  $(startNewGame);
})(jQuery);
