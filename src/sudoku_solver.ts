import { findArrayDuplicates } from "./utils"

export default class SudokuSolver {
    private grid: string[][] = []
    private _subgrids: string[][] = []
    private _initialized: boolean
    private _error: string

    private _findSubgridIndex = (
        rowIndex: number,
        columnIndex: number
    ): { subgridIndex: number, itemIndex: number } => {
        const subgridRow = Math.floor(rowIndex / 3)
        const subgridCol = Math.floor(columnIndex / 3)
      
        const subgridIndex = subgridRow * 3 + subgridCol
      
        const itemIndex = (rowIndex % 3) * 3 + (columnIndex % 3)
      
        return { subgridIndex, itemIndex }
    }

    private _validateGrid = (rowIndex: number, columnIndex: number): boolean => {
        const row = this.grid[rowIndex]
        const column = this.grid.map((row) => row[columnIndex])
        
        const rowDuplicate = findArrayDuplicates(row, ['0'])
        const columnDuplicate = findArrayDuplicates(column, ['0'])

        const { subgridIndex } = this._findSubgridIndex(rowIndex, columnIndex)
        const subgridDuplicate = findArrayDuplicates(this._subgrids[subgridIndex], ['0'])

        if (
            rowDuplicate !== undefined ||
            columnDuplicate !== undefined ||
            subgridDuplicate !== undefined
        ) {
            return false
        }
        return true
    }

    private _findNextRowColumn = (startRow: number, startColumn: number): [number, number, boolean] => {
        let finished = false
        let item = this.grid[startRow][startColumn]

        while (item !== '0') {
            if (startColumn < 8) {
                startColumn++
            } else if (startRow < 8) {
                startRow++
                startColumn = 0
            } else {
                finished = true
                break
            }
            
            item = this.grid[startRow][startColumn]
        }

        return [startRow, startColumn, finished]
    }

    private _insertValue = (rowIndex: number, columnIndex: number, value: string) => {
        const {
            subgridIndex,
            itemIndex
        } = this._findSubgridIndex(rowIndex, columnIndex)

        this.grid[rowIndex][columnIndex] = value
        this._subgrids[subgridIndex][itemIndex] = value
    }

    private _solve = (startRow: number, startColumn: number) => {
        const [row, column, finished] = this._findNextRowColumn(startRow, startColumn)

        if (finished) {
            return true
        }
        
        for (let num = 1; num <= 9; num++) {
            this._insertValue(row, column, num.toString())
            const isValid = this._validateGrid(row, column)

            if (isValid && this._solve(row, column)) {
                return true
            }

            this._insertValue(row, column, '0')
        }

        return false
    }

    private _toString() {
        for (let i = 0; i < 9; i++) {
          console.log(this.grid[i].join(" "));
        }
    }

    public setup = (game: string) => {
        const grid: string[][] = []
        const subgrids: string[][] = []
        
        try {
            game.split('\n').forEach((row) => {
                const newRow = row.trim().split(' ')
                if (newRow.length !== 9) throw 'Invalid entry'
    
                grid.push(newRow)
            })
    
            if (grid.length !== 9) throw 'Invalid entry'
    
            for (let i = 0; i < 9; i++) {
                const row = grid[i]
                const column = grid.map((row) => row[i])
                
                const rowDuplicate = findArrayDuplicates(row, ['0'])
                const columnDuplicate = findArrayDuplicates(column, ['0'])
    
                if (rowDuplicate !== undefined || columnDuplicate !== undefined) {
                    throw 'Invalid entry'
                }
    
                if (i % 3 === 0) {
                    // Subgrid validation
                    for (let j = 0; j < 3; j++) {
                        subgrids[i + j] = [
                            ...grid[i].slice(j * 3, (j + 1) * 3),
                            ...grid[i + 1].slice(j * 3, (j + 1) * 3),
                            ...grid[i + 2].slice(j * 3, (j + 1) * 3),
                        ]
    
                        let subgridDuplicates = findArrayDuplicates(subgrids[i+j], ['0'])
                        if (subgridDuplicates !== undefined) throw 'Invalid entry'
                    }
                }
            }
        } catch (error) {
            this._error = error
            console.log(this._error)
        }
    
        this.grid = grid
        this._subgrids = subgrids
        this._initialized = true
    }

    public execute = () => {
        if (!this._initialized) {
            console.log('Solver not initialized!')
            return
        }
        if (this._error !== undefined) {
            console.log(this._error)
            return
        }

        const result = this._solve(0, 0)
        if (result) {
            this._toString()
        } else {
            console.log('No solution was found')
        }
    }
}
