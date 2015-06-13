/// <reference path="../reference.ts" />
'use strict';

var TABLE_WIDTH: number = 16;
var BOX_WIDTH: number = 4;
var BOX_HEIGHT: number = 4;

class Cell {
  _value: number;
  possibilities: Array<number>;

  constructor(value?: number) {
    this.value = value;
  }

  set value(value: number) {
    this._value = value;
    this.possibilities = [];
  }

  get value() {
    return this._value;
  }
}

function hasPossibility(value: number): (cell: Cell) => boolean {
  return (cell: Cell): boolean => cell.possibilities.indexOf(value) > -1;
}

function hasValue(value: number): (cell: Cell) => boolean {
  return (cell: Cell): boolean => cell.value === value;
}

class MainController {
  code: string;
  cells: Array<Array<Cell>>;
  $timeout: ng.ITimeoutService;

  /* @ngInject */
  constructor($timeout: ng.ITimeoutService) {
    function c(v?: number): Cell {
      return new Cell(v);
    }

    this.$timeout = $timeout;
    this.code = 'code is generated when you click the solve button';

    this.cells = [];
    for (let i = 0; i < TABLE_WIDTH; i++) {
      let row: Array<Cell> = [];
      for (let j = 0; j < TABLE_WIDTH; j++) {
        row.push(c());
      }
      this.cells.push(row);
    }

    // this.cells = [
    //   [c( ), c(8), c(1), /**/ c( ), c(5), c( ), /**/ c( ), c(6), c( )],
    //   [c( ), c(3), c( ), /**/ c( ), c( ), c(1), /**/ c(5), c(4), c( )],
    //   [c( ), c( ), c( ), /**/ c( ), c(2), c( ), /**/ c( ), c( ), c( )],

    //   [c( ), c( ), c( ), /**/ c(5), c(9), c( ), /**/ c( ), c( ), c(6)],
    //   [c(9), c(4), c( ), /**/ c( ), c( ), c( ), /**/ c( ), c(8), c(3)],
    //   [c(2), c( ), c( ), /**/ c( ), c(1), c(3), /**/ c( ), c( ), c(4)],

    //   [c( ), c( ), c( ), /**/ c( ), c(6), c( ), /**/ c( ), c( ), c( )],
    //   [c( ), c( ), c(9), /**/ c(1), c( ), c( ), /**/ c( ), c(7), c( )],
    //   [c( ), c(5), c( ), /**/ c( ), c(3), c( ), /**/ c(8), c(9), c( )]
    // ];

    this.cells = [
      [c(13), c( 5), c(  ), c(  ), /**/ c(10), c(  ), c(11), c( 3), /**/ c(  ), c(15), c(  ), c( 8), /**/ c(  ), c(  ), c(  ), c(  )],
      [c(16), c(  ), c(  ), c(  ), /**/ c(  ), c(  ), c(  ), c( 9), /**/ c(  ), c(  ), c(13), c(  ), /**/ c(  ), c( 6), c(  ), c(  )],
      [c( 8), c(11), c( 3), c( 2), /**/ c(  ), c(  ), c(  ), c(  ), /**/ c(  ), c( 5), c(  ), c(  ), /**/ c(13), c(  ), c( 4), c(14)],
      [c(  ), c(  ), c( 6), c(10), /**/ c(  ), c(15), c(  ), c(  ), /**/ c(  ), c(  ), c(  ), c(14), /**/ c(  ), c( 2), c(  ), c(  )],

      [c(  ), c(  ), c(  ), c(12), /**/ c( 6), c(  ), c( 1), c(  ), /**/ c(13), c(  ), c(  ), c(11), /**/ c( 7), c(  ), c(  ), c( 9)],
      [c( 6), c( 2), c(16), c( 1), /**/ c(  ), c(  ), c( 5), c(  ), /**/ c(  ), c(  ), c(  ), c( 9), /**/ c( 3), c(  ), c(  ), c(15)],
      [c( 3), c(  ), c(  ), c(  ), /**/ c(  ), c(12), c( 2), c(14), /**/ c(  ), c( 6), c(  ), c(  ), /**/ c(  ), c(  ), c(16), c(  )],
      [c( 7), c(  ), c(  ), c(  ), /**/ c(11), c( 3), c(  ), c( 8), /**/ c(  ), c(  ), c(  ), c(  ), /**/ c(14), c(10), c(  ), c( 2)],

      [c(15), c(  ), c( 2), c( 5), /**/ c(  ), c(  ), c(  ), c(  ), /**/ c( 9), c(  ), c( 7), c(13), /**/ c(  ), c(  ), c(  ), c(10)],
      [c(  ), c( 4), c(  ), c(  ), /**/ c(  ), c(  ), c( 6), c(  ), /**/ c(12), c( 1), c(14), c(  ), /**/ c(  ), c(  ), c(  ), c(13)],
      [c( 1), c(  ), c(  ), c( 7), /**/ c(16), c(  ), c(  ), c(  ), /**/ c(  ), c( 8), c(  ), c(  ), /**/ c( 6), c( 4), c( 5), c(12)],
      [c( 9), c(  ), c(  ), c(13), /**/ c( 2), c(  ), c(  ), c( 7), /**/ c(  ), c(11), c(  ), c( 4), /**/ c(16), c(  ), c(  ), c(  )],

      [c(  ), c(  ), c( 1), c(  ), /**/ c( 5), c(  ), c(  ), c(  ), /**/ c(  ), c(  ), c(12), c(  ), /**/ c(11), c( 8), c(  ), c(  )],
      [c( 2), c(12), c(  ), c(11), /**/ c(  ), c(  ), c(14), c(  ), /**/ c(  ), c(  ), c(  ), c(  ), /**/ c(15), c( 1), c(13), c( 6)],
      [c(  ), c(  ), c( 9), c(  ), /**/ c(  ), c( 8), c(  ), c(  ), /**/ c( 6), c(  ), c(  ), c(  ), /**/ c(  ), c(  ), c(  ), c(16)],
      [c(  ), c(  ), c(  ), c(  ), /**/ c(15), c(  ), c( 4), c(  ), /**/ c( 8), c(14), c(  ), c( 7), /**/ c(  ), c(  ), c( 9), c( 5)]
    ];
  }

  generateCode(): string {
    function border(index: number, size: number, value: string) {
      return index > 0 && index % size === 0 ? value : '';
    }
    function pad(value: number, max: number, fill: string): string {
      let s: string = (value || '') + '';
      return (max + '').replace(/./g, fill).slice(s.length) + s;
    }
    return 'this.cells = [\n' + this.cells.map((row: Array<Cell>, rowIndex: number): string => {
      return border(rowIndex, BOX_HEIGHT, '\n') +
             '  [' + row.map((cell: Cell, colIndex: number): string => {
        return `${border(colIndex, BOX_WIDTH, '/**/ ')}c(${pad(cell.value, TABLE_WIDTH, ' ')})`;
      }).join(', ') + ']';
    }).join(',\n') + '\n];\n\n';
  }

  getStyle(rowIndex: number, colIndex: number): string {
    function border(side: string): string {
      return `border-${side}: solid black 1px; `;
    }
    return (rowIndex % BOX_HEIGHT === 0 ? border('top') : '') +
           (rowIndex % BOX_HEIGHT === BOX_HEIGHT - 1 ? border('bottom') : '') +
           (colIndex % BOX_WIDTH === 0 ? border('left') : '') +
           (colIndex % BOX_WIDTH === BOX_WIDTH - 1 ? border('right') : '');
  }

  getBox(rowIndex: number, colIndex: number): Array<Cell> {
    let arr: Array<Cell> = [];
    rowIndex -= rowIndex % BOX_HEIGHT;
    colIndex -= colIndex % BOX_WIDTH;
    for (let i = 0; i < BOX_HEIGHT; i++) {
      arr = arr.concat(this.cells[rowIndex + i].slice(colIndex, colIndex + BOX_WIDTH));
    }
    return arr;
  }

  getRow(rowIndex): Array<Cell> {
    return this.cells[rowIndex];
  }

  getCol(colIndex): Array<Cell> {
    return this.cells.map((row: Array<Cell>): Cell => row[colIndex]);
  }

  getAll(): Array<Cell> {
    return this.cells.reduce((prev: Array<Cell>, curr: Array<Cell>): Array<Cell> => {
      return prev.concat(curr);
    }, []);
  }

  someUnsolvedCell(f: (cell: Cell, rowIndex: number, colIndex: number) => boolean): boolean {
    return this.cells.some((row: Array<Cell>, rowIndex: number): boolean => {
      return row.some((cell: Cell, colIndex: number): boolean => {
        return !cell.value && f(cell, rowIndex, colIndex);
      });
    });
  }

  forEachUnsolvedCell(f: (cell: Cell, rowIndex: number, colIndex: number) => void): void {
    this.cells.forEach((row: Array<Cell>, rowIndex: number): void => {
      row.forEach((cell: Cell, colIndex: number): void => {
        if (!cell.value) {
          f(cell, rowIndex, colIndex);
        }
      });
    });
  }

  isInRow(rowIndex: number, value: number): boolean {
    return this.getRow(rowIndex).filter(hasValue(value)).length > 0;
  }

  isInCol(colIndex: number, value: number): boolean {
    return this.getCol(colIndex).filter(hasValue(value)).length > 0;
  }

  isInBox(rowIndex: number, colIndex: number, value: number): boolean {
    return this.getBox(rowIndex, colIndex).filter(hasValue(value)).length > 0;
  }

  otherOptionInRow(rowIndex: number, value: number): boolean {
    return this.getRow(rowIndex).filter(hasPossibility(value)).length > 1;
  }

  otherOptionInCol(colIndex: number, value: number): boolean {
    return this.getCol(colIndex).filter(hasPossibility(value)).length > 1;
  }

  otherOptionInBox(rowIndex: number, colIndex: number, value: number): boolean {
    return this.getBox(rowIndex, colIndex).filter(hasPossibility(value)).length > 1;
  }

  getPossibleValues(rowIndex: number, colIndex: number): Array<number> {
    let arr: Array<number> = [];
    for (let i = 1; i <= TABLE_WIDTH; i++) {
      if (!this.isInRow(rowIndex, i) &&
          !this.isInCol(colIndex, i) &&
          !this.isInBox(rowIndex, colIndex, i)) {
        arr.push(i);
      }
    }
    return arr;
  }

  otherOptionInTable(rowIndex: number, colIndex: number, value: number): boolean {
    return this.otherOptionInRow(rowIndex, value) &&
           this.otherOptionInCol(colIndex, value) &&
           this.otherOptionInBox(rowIndex, colIndex, value);
  }

  solveByOnlyPossibility(): boolean {
    return this.someUnsolvedCell((cell: Cell, rowIndex: number, colIndex: number): boolean => {
      if (cell.possibilities.length === 1) {
        cell.value = cell.possibilities[0];
        return true;
      }
    });
  }

  solveByNoOtherOptionInTable(): boolean {
    return this.someUnsolvedCell((cell: Cell, rowIndex: number, colIndex: number): boolean => {
      let values: Array<number> = cell.possibilities.filter((value: number): boolean => {
        return !this.otherOptionInTable(rowIndex, colIndex, value);
      });
      if (values.length === 1) {
        cell.value = values[0];
        return true;
      }
    });
  }

  solve(generateCode?: boolean): void {
    if (generateCode) {
      this.code = this.generateCode();
    }

    this.forEachUnsolvedCell((cell: Cell, rowIndex: number, colIndex: number): void => {
      cell.possibilities = this.getPossibleValues(rowIndex, colIndex);
    });

    if (this.solveByOnlyPossibility() || this.solveByNoOtherOptionInTable()) {
      this.$timeout(() => this.solve(), 10);
    } else if (this.getAll().filter((cell: Cell): boolean => !cell.value).length > 0) {
      this.$timeout(() => alert('stuck!!!'), 0);
    } else {
      this.$timeout(() => alert('done!!!'), 0);
    }
  }
}

angular
  .module('sodukuAppInternal')
  .controller('MainController', MainController);
