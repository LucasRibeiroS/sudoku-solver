import fs from 'fs'

import SudokuSolver from './sudoku_solver'

const main = () => {
    const args = process.argv.slice(2)
    
    let gamePath: string | undefined

    args.forEach(arg => {
        if (arg.includes('.txt') && gamePath === undefined) gamePath = arg
    })

    if (gamePath === undefined || !fs.existsSync(`games/${gamePath}`)) {
        console.log('No game was found')
        return
    }

    console.log("Solver de Sudoku via força bruta ver 1. 0 - IFMG 2023")
    console.log("Desenvolvido como trabalho prático para a disciplina de Projeto e Analise de Algoritmos")
    console.log("Autores : Lucas & Maria")

    const rawGame = fs.readFileSync(`games/${gamePath}`)
        .toString()
        .replace(/\r\n/g,'\n')

    const sudokuSolver = new SudokuSolver()
    sudokuSolver.setup(rawGame)
    sudokuSolver.execute()
}

main()
