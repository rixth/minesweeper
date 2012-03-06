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
        board = this.board,
        game = this;

    board.attr('class', board.attr('class').replace(/\bsize-\d+\b/, '')).addClass('size-' + this.size);

    r.forEach(function (y) {
      var row = $('<div class="row"></div>').appendTo(board);
      r.forEach(function (x) {
        var cell = $('<div class="cell" data-x="' + x + '" data-y="' + y + '"></div>').appendTo(row);
        game.updateCellUi(x, y);
      });
    });
  };

  Game.prototype.updateCellUi = function (x, y) {
    var cell = $(".cell[data-x='" + x + "'][data-y='" + y + "']").attr('class', 'cell').html(''),
        cellFlag = this.getCell(x, y)

    if (cellFlag === CellFlags.MINE) {
      cell.addClass('mineHere');
    } else if (cellFlag === CellFlags.CLEARED) {
      cell.addClass('cleared').html(this.mineProximities[x + ',' + y]);
    } else if (cellFlag === CellFlags.FLAGGED) {
      cell.addClass('flagged');
    }
  };

  Game.prototype.createGrid = function () {
    var height = this.size,
        width;

    this.grid = [];

    while(height--) {
      this.grid.push([]);
      width = this.size;
      while (width--) {
        _.last(this.grid).push(CellFlags.BLANK);
      }
    }
  };

  Game.prototype.cellClick = function (x, y, isFlagging) {
    if (isFlagging) {
      this.markCellAs(x, y, this.getCell(x, y) === CellFlags.FLAGGED ? CellFlags.BLANK : CellFlags.FLAGGED);
    } else {    
      if (this.bombAt(x, y)) {
        this.board.trigger('gameOver');
      } else {
        var adjacentMines = this.numberOfMinesAroundCell(x, y);
        this.markCellAs(x, y, CellFlags.CLEARED);
        this.mineProximities[x + ',' + y] = adjacentMines;
        // TODO branching to clear adjacent areas
      }
    }
    this.updateCellUi(x, y);
  };



  Game.prototype.validCell = function (x, y) {
    return x >= 0 && y >= 0 && x < this.size - 1 && y < this.size - 1;
  };

  Game.prototype.bombAt = function (x, y) {
    return this.getCell(x, y) === CellFlags.MINE
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

  Game.prototype.markCellAs = function (x, y, mode) {
    if (this.validCell(x, y)) {
      this.grid[y][x] = mode;
    }
  };

  Game.prototype.placeMines = function (count) {
    while(count--) {
      var x = random(0, this.size - 1),
          y = random(0, this.size - 1);

      if (this.getCell(x, y) === CellFlags.MINE) {
        // There's already a mine here, so bump us up one
        count++;
      } else {
        this.markCellAs(x, y, CellFlags.MINE);
      }
    }
  };

  function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }

  return Game;
})();