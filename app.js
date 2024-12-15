"use strict";

var TABLE_WIDTH = 16;
var BOX_WIDTH = 4;
var BOX_HEIGHT = 4;

class Cell {
  _value;
  possibilities;

  constructor(value) {
    this.value = value || undefined;
  }

  set value(value) {
    this._value = value;
    this.possibilities = [];
  }

  get value() {
    return this._value;
  }
}

function hasPossibility(value) {
  return (cell) => cell.possibilities.indexOf(value) > -1;
}

function hasValue(value) {
  return (cell) => cell.value === value;
}

class MainController {
  code;
  cells;
  $timeout;

  /* @ngInject */
  constructor($timeout) {
    function c(v) {
      return new Cell(v);
    }

    this.$timeout = $timeout;
    this.code = "code is generated when you click the solve button";

    this.cells = [];
    for (let i = 0; i < TABLE_WIDTH; i++) {
      let row = [];
      for (let j = 0; j < TABLE_WIDTH; j++) {
        row.push(c());
      }
      this.cells.push(row);
    }

    this.cells = [
      [13, 5, 0, 0, /**/ 10, 0, 11, 3, /**/ 0, 15, 0, 8, /**/ 0, 0, 0, 0],
      [16, 0, 0, 0, /**/ 0, 0, 0, 9, /**/ 0, 0, 13, 0, /**/ 0, 6, 0, 0],
      [8, 11, 3, 2, /**/ 0, 0, 0, 0, /**/ 0, 5, 0, 0, /**/ 13, 0, 4, 14],
      [0, 0, 6, 10, /**/ 0, 15, 0, 0, /**/ 0, 0, 0, 14, /**/ 0, 2, 0, 0],

      [0, 0, 0, 12, /**/ 6, 0, 1, 0, /**/ 13, 0, 0, 11, /**/ 7, 0, 0, 9],
      [6, 2, 16, 1, /**/ 0, 0, 5, 0, /**/ 0, 0, 0, 9, /**/ 3, 0, 0, 15],
      [3, 0, 0, 0, /**/ 0, 12, 2, 14, /**/ 0, 6, 0, 0, /**/ 0, 0, 16, 0],
      [7, 0, 0, 0, /**/ 11, 3, 0, 8, /**/ 0, 0, 0, 0, /**/ 14, 10, 0, 2],

      [15, 0, 2, 5, /**/ 0, 0, 0, 0, /**/ 9, 0, 7, 13, /**/ 0, 0, 0, 10],
      [0, 4, 0, 0, /**/ 0, 0, 6, 0, /**/ 12, 1, 14, 0, /**/ 0, 0, 0, 13],
      [1, 0, 0, 7, /**/ 16, 0, 0, 0, /**/ 0, 8, 0, 0, /**/ 6, 4, 5, 12],
      [9, 0, 0, 13, /**/ 2, 0, 0, 7, /**/ 0, 11, 0, 4, /**/ 16, 0, 0, 0],

      [0, 0, 1, 0, /**/ 5, 0, 0, 0, /**/ 0, 0, 12, 0, /**/ 11, 8, 0, 0],
      [2, 12, 0, 11, /**/ 0, 0, 14, 0, /**/ 0, 0, 0, 0, /**/ 15, 1, 13, 6],
      [0, 0, 9, 0, /**/ 0, 8, 0, 0, /**/ 6, 0, 0, 0, /**/ 0, 0, 0, 16],
      [0, 0, 0, 0, /**/ 15, 0, 4, 0, /**/ 8, 14, 0, 7, /**/ 0, 0, 9, 5],
    ];

    this.cells = this.cells.map((row) => row.map(c));
  }

  generateCode() {
    function border(index, size, value) {
      return index > 0 && index % size === 0 ? value : "";
    }
    function pad(value, max, fill) {
      let s = (value || "") + "";
      return (max + "").replace(/./g, fill).slice(s.length) + s;
    }
    return (
      "this.cells = [\n" +
      this.cells
        .map((row, rowIndex) => {
          return (
            border(rowIndex, BOX_HEIGHT, "\n") +
            "  [" +
            row
              .map((cell, colIndex) => {
                return `${border(colIndex, BOX_WIDTH, "/**/ ")}${pad(
                  cell.value || "0",
                  TABLE_WIDTH,
                  " "
                )}`;
              })
              .join(", ") +
            "]"
          );
        })
        .join(",\n") +
      "\n];\n\n"
    );
  }

  getStyle(rowIndex, colIndex) {
    function border(side) {
      return `border-${side}: solid black 1px; `;
    }
    return (
      (rowIndex % BOX_HEIGHT === 0 ? border("top") : "") +
      (rowIndex % BOX_HEIGHT === BOX_HEIGHT - 1 ? border("bottom") : "") +
      (colIndex % BOX_WIDTH === 0 ? border("left") : "") +
      (colIndex % BOX_WIDTH === BOX_WIDTH - 1 ? border("right") : "")
    );
  }

  getBox(rowIndex, colIndex) {
    let arr = [];
    rowIndex -= rowIndex % BOX_HEIGHT;
    colIndex -= colIndex % BOX_WIDTH;
    for (let i = 0; i < BOX_HEIGHT; i++) {
      arr = arr.concat(
        this.cells[rowIndex + i].slice(colIndex, colIndex + BOX_WIDTH)
      );
    }
    return arr;
  }

  getRow(rowIndex) {
    return this.cells[rowIndex];
  }

  getCol(colIndex) {
    return this.cells.map((row) => row[colIndex]);
  }

  getAll() {
    return this.cells.reduce((prev, curr) => {
      return prev.concat(curr);
    }, []);
  }

  someUnsolvedCell(f) {
    return this.cells.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        return !cell.value && f(cell, rowIndex, colIndex);
      });
    });
  }

  forEachUnsolvedCell(f) {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell.value) {
          f(cell, rowIndex, colIndex);
        }
      });
    });
  }

  isInRow(rowIndex, value) {
    return this.getRow(rowIndex).filter(hasValue(value)).length > 0;
  }

  isInCol(colIndex, value) {
    return this.getCol(colIndex).filter(hasValue(value)).length > 0;
  }

  isInBox(rowIndex, colIndex, value) {
    return this.getBox(rowIndex, colIndex).filter(hasValue(value)).length > 0;
  }

  otherOptionInRow(rowIndex, value) {
    return this.getRow(rowIndex).filter(hasPossibility(value)).length > 1;
  }

  otherOptionInCol(colIndex, value) {
    return this.getCol(colIndex).filter(hasPossibility(value)).length > 1;
  }

  otherOptionInBox(rowIndex, colIndex, value) {
    return (
      this.getBox(rowIndex, colIndex).filter(hasPossibility(value)).length > 1
    );
  }

  getPossibleValues(rowIndex, colIndex) {
    let arr = [];
    for (let i = 1; i <= TABLE_WIDTH; i++) {
      if (
        !this.isInRow(rowIndex, i) &&
        !this.isInCol(colIndex, i) &&
        !this.isInBox(rowIndex, colIndex, i)
      ) {
        arr.push(i);
      }
    }
    return arr;
  }

  otherOptionInTable(rowIndex, colIndex, value) {
    return (
      this.otherOptionInRow(rowIndex, value) &&
      this.otherOptionInCol(colIndex, value) &&
      this.otherOptionInBox(rowIndex, colIndex, value)
    );
  }

  solveByOnlyPossibility() {
    return this.someUnsolvedCell((cell, rowIndex, colIndex) => {
      if (cell.possibilities.length === 1) {
        cell.value = cell.possibilities[0];
        return true;
      }
    });
  }

  solveByNoOtherOptionInTable() {
    return this.someUnsolvedCell((cell, rowIndex, colIndex) => {
      let values = cell.possibilities.filter((value) => {
        return !this.otherOptionInTable(rowIndex, colIndex, value);
      });
      if (values.length === 1) {
        cell.value = values[0];
        return true;
      }
    });
  }

  solve(generateCode) {
    if (generateCode) {
      this.code = this.generateCode();
    }

    this.forEachUnsolvedCell((cell, rowIndex, colIndex) => {
      cell.possibilities = this.getPossibleValues(rowIndex, colIndex);
    });

    if (this.solveByOnlyPossibility() || this.solveByNoOtherOptionInTable()) {
      this.$timeout(() => this.solve(), 10);
    } else if (this.getAll().filter((cell) => !cell.value).length > 0) {
      this.$timeout(() => alert("stuck!!!"), 0);
    } else {
      this.$timeout(() => alert("done!!!"), 0);
    }
  }
}

angular.module("sodukuApp", []).controller("MainController", MainController);
