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
      updateUiVisiblity();
      currentGame.inProgress = null;
      $('#gameOver, #gameIncomplete, #gameWin').addClass('hidden');
    }).on('gameOver', function () {
      currentGame.inProgress = false;
      updateUiVisiblity();
      $('#gameOver').removeClass('hidden');
    }).on('mousedown', '.cell', function (event) {
      if (currentGame.inProgress !== false) {
        var data = $(this).data();
        currentGame.cellClick(data.x, data.y, event.which === 3);
        updateUiVisiblity();
      }
    }).on('contextmenu', function () {
      return false;
    })    
  });

  $('#cheat').on('click', function () {
    board.toggleClass('cheating');
  });
  $('#validate').on('click', function () {
    currentGame.inProgress = false;
    currentGame.isGameOver = true;
    if (currentGame.gameIsCompleted()) {
      $('#gameWin').removeClass('hidden');
    } else {
      $('#gameIncomplete').removeClass('hidden');
    }
    updateUiVisiblity();
  });

  function promptNewGame(continueCallback, cancelCallback) {
    if (currentGame.inProgress) {
      var modal = $('#newGameConformation');

      modal.modal().on('hide', function () {
        $(this).off('.confirmation');
      }).on('click.confirmation', '.btn', function () {
        if ($(this).hasClass('btn-primary')) {
          continueCallback();
        } else {
          cancelCallback && cancelCallback();
        }
        
        modal.modal('hide');
      });
    } else {
      continueCallback();
    }
  }

  function startNewGame(options) {
    options = options || {};
    currentGame = new MinesweeperGame(options.board || board, options.size || size, options.difficulty || difficulty);
  }

  function updateUiVisiblity() {
    var cheatButton = $('#cheat'),
        validateButton = $('#validate');

    validateButton.toggleClass('hidden', !currentGame.inProgress || currentGame.isGameOver);
    cheatButton.toggleClass('hidden', currentGame.isGameOver);
  }

  $(startNewGame);
})(jQuery);
