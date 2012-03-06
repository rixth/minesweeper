var MinesweeperGame = (function () {
  "use strict";

  var Difficulties,
      CellFlags,
      Game;

  Difficulties = {
    EASY: 0.8,
    NORMAL: 1.0,
    HARD: 1.2,
    EXTREME: 1.5
  };

  CellFlags = {
    BLANK: 0,
    MINE: 1,
    CLEARED: 2,
    FLAGGED: 3
  };

  Game = function MinesweeperGame(board, size, difficulty) {
    this.board = board;
    this.size = size;
    this.difficulty = difficulty;
    this.mineProximities = {};
    this.flaggedCells = [];
    this.isGameOver = false;
    this.inProgress = false;

    // Calculate the number of mines, based off the notion that an 8x8 grid
    // has 10 mines, the apply the difficulty modifier.
    this.mineCount = Math.round(size / 8 * 10 * Difficulties[difficulty]);

    _.defer((function () {
      this.createGrid();
      this.placeMines(this.mineCount);
      this.board.trigger('gameCreated');
    }).bind(this));
  };

  Game.prototype.renderFull = function () {
    var r = _.range(this.size),
        board = this.board.empty(),
        game = this;

    board.attr('class', board.attr('class').replace(/\bsize-\d+\b/, '')).addClass('size-' + this.size);

    r.forEach(function (y) {
      var row = $('<div class="cell-row"></div>').appendTo(board);
      r.forEach(function (x) {
        var cell = $('<div class="cell" data-x="' + x + '" data-y="' + y + '"></div>').appendTo(row);
        game.updateCellUi(x, y);
      });
    });
  };

  Game.prototype.updateCellUi = function (x, y) {
    var cell = $(".cell[data-x='" + x + "'][data-y='" + y + "']").attr('class', 'cell').html(''),
        cellState = this.getCell(x, y);

    if (cellState.mined) {
      cell.addClass('mineHere');
    } else if (cellState.cleared) {
      cell.addClass('cleared').html(this.mineProximities[x + ',' + y]);
    }
    
    cell.toggleClass('flagged', cellState.flagged);
  };

  Game.prototype.createGrid = function () {
    var height = this.size,
        width;

    this.grid = [];

    while(height--) {
      this.grid.push([]);
      width = this.size;
      while (width--) {
        _.last(this.grid).push({
          cleared: false,
          mined: false,
          flagged: false
        });
      }
    }
  };

  Game.prototype.gameIsCompleted = function () {
    return !_(this.grid).any(function (row) {
      return _(row).any(function (cellState) {
        return !cellState.cleared && !cellState.mined;
      })
    });
  };

  Game.prototype.cellClick = function (x, y, isFlagging) {
    var cellState = this.getCell(x, y),
        wasCleared = (cellState || {}).cleared,
        i;

    if (cellState === null || cellState.cleared) {
      return;
    }

    this.inProgress = true;

    if (isFlagging) {
      cellState.flagged = !cellState.flagged;
    } else {    
      if (this.bombAt(x, y)) {
        this.isGameOver = true;
        this.board.trigger('gameOver');
        this.board.addClass('cheating');
      } else {
        this.mineProximities[x + ',' + y] = this.numberOfMinesAroundCell(x, y);
        cellState.cleared = true;

        // There are no mines here, so branch around but be careful not to loop
        if (!wasCleared && this.mineProximities[x + ',' + y] === 0) {
          this.clearAreaFrom(x, y);
        }
      }
    }
    this.updateCellUi(x, y);
  };

  Game.prototype.clearAreaFrom = function (x, y) {
    // Top left
    this.cellClick(x - 1, y - 1);
    // Top
    this.cellClick(x, y - 1);
    // Top right
    this.cellClick(x + 1, y - 1);
    // Right
    this.cellClick(x + 1, y);
    // Bottom right
    this.cellClick(x + 1, y + 1);
    // Bottom
    this.cellClick(x, y + 1);
    // Bottom left
    this.cellClick(x - 1, y + 1);
    // Left
    this.cellClick(x - 1, y);
  };

  Game.prototype.validCell = function (x, y) {
    return x >= 0 && y >= 0 && x <= this.size - 1 && y <= this.size - 1;
  };

  Game.prototype.bombAt = function (x, y) {
    return (this.getCell(x, y) || {}).mined;
  };

  Game.prototype.getCell = function (x, y) {
    return this.validCell(x, y) ? this.grid[y][x] : null;
  };

  Game.prototype.numberOfMinesAroundCell = function (x, y) {
    var mineCount = 0;

    // Top left
    if (this.bombAt(x - 1, y - 1)) { mineCount++; }
    // Top
    if (this.bombAt(x, y - 1)) { mineCount++; }
    // Top right
    if (this.bombAt(x + 1, y - 1)) { mineCount++; }
    // Right
    if (this.bombAt(x + 1, y)) { mineCount++; }
    // Bottom right
    if (this.bombAt(x + 1, y + 1)) { mineCount++; }
    // Bottom
    if (this.bombAt(x, y + 1)) { mineCount++; }
    // Bottom left
    if (this.bombAt(x - 1, y + 1)) { mineCount++; }
    // Left
    if (this.bombAt(x - 1, y)) { mineCount++; }

    return mineCount;
  };

  Game.prototype.placeMines = function (count) {
    while(count--) {
      var x = random(0, this.size - 1),
          y = random(0, this.size - 1);

      if (this.getCell(x, y).mined) {
        // There's already a mine here, so bump us up one
        count++;
      } else {
        this.getCell(x, y).mined = true;
      }
    }
  };

  function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }

  return Game;
})();