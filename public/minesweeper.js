var MinesweeperGame = (function () {
  "use strict";

  var Difficulties,
      CellFlags,
      Game

  Difficulties = {
    EASY: 0.8,
    NORMAL: 1.0,
    HARD: 1.2,
    EXTREME: 1.5
  };

  CellFlags = {
    BLANK: 0,
    MINE: 1,
    MARKED: 2,
    FLAGGED: 3
  };

  Game = function MinesweeperGame(size, difficulty) {
    this.size = size;
    this.difficulty = difficulty;

    // Calculate the number of mines, based off the notion that an 8x8 grid
    // has 10 mines, the apply the difficulty modifier.
    this.mineCount = Math.round(size / 8 * 10 * Difficulties[difficulty]);

    this.createGrid();
    this.placeMines(this.mineCount);
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
  }

  Game.prototype.getCell = function (x, y) {
    return this.grid[y][x];
  };

  Game.prototype.markCellAs = function (x, y, mode) {
    this.grid[y][x] = mode;
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