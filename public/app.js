/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, curly:true, browser:true, indent:2, maxerr:50 */
/*globals jQuery, MinesweeperGame */

(function ($, undefined) {
  "use strict";

  var board = $('#board'),
      size = 8,
      difficulty = 'NORMAL',
      currentGame,
      gameState = {};

  function resizeCells() {
    var cells = board.find('.cell');
    cells.height(cells.width());
  }

  $(window).resize(resizeCells);

  $('#newGameControl').on('click', 'ul li, div>a:first-child', function (event) {
    promptNewGame($.proxy(function () {
      // Select the difficulty in the list
      if (this.tagName.toUpperCase() === 'LI') {
        difficulty = $(this).attr('data-difficulty');
        $(this).siblings().removeClass('active').end().addClass('active');
      }
      startNewGame();
    }, this));
  }).find("li[data-difficulty='" + difficulty + "']").addClass('active');

  $('#sizeSelector').on('change', function () {
    promptNewGame($.proxy(function () {
      size = $(this).val();
      startNewGame();
    }, this), $.proxy(function () {
      $(this).val(size);
    }, this));
  }).val(8);

  // Guh, stoopid mobile webkit...
  $('.btn').attr('onclick', 'void(0);');

  $(function () {
    board.on('gameCreated', function () {
      currentGame.renderFull();
      resizeCells();
      updateUiVisiblity();
      currentGame.inProgress = null;
      $('#gameOver, #gameIncomplete, #gameWin').addClass('hidden');
      board.removeClass('cheating');
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
      event.preventDefault();
      event.stopPropagation();
    }).on('contextmenu', function () {
      return false;
    }); 
  });

  $('#cheat').on('click', function (e) {
    board.toggleClass('cheating');
    e.preventDefault();
  });

  $('#save').on('click', function (e) {
    window.localStorage.setItem('minesweeperState', JSON.stringify(currentGame.toJSON()));
    e.preventDefault();
  });
  $('#load').on('click', function (e) {
    promptNewGame(function () {
      var gameState = JSON.parse(window.localStorage.getItem('minesweeperState'));
      currentGame = new MinesweeperGame(board, gameState);
    });
    e.preventDefault();
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
        validateButton = $('#validate'),
        saveButton = $('#save');

    validateButton.toggleClass('hidden', !currentGame.inProgress || currentGame.isGameOver);
    saveButton.toggleClass('hidden', !currentGame.inProgress || currentGame.isGameOver);
    cheatButton.toggleClass('hidden', currentGame.isGameOver);
  }

  $(startNewGame);
})(jQuery);
