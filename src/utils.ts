import readline from 'readline'

export const getUserInput = (): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise(resolve => rl.question(`Forneca uma palavra:\n`, word => {
        rl.close()
        resolve(word)
    }))
}

export const findArrayDuplicates = <T>(arr: T[], exclude?: T[]): T | undefined=> {
    const set = new Set<T>()
    for (const item of arr) {
        if (
            set.has(item) &&
            (
                exclude !== undefined &&
                !exclude.includes(item)
            )
        ) {
            return item
        }
        set.add(item)
    }
    return undefined
}
