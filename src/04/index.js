import { readFile } from '_utils/file'

const getAdjascentCoord = ([x, y]) => [
  [x - 1, y - 1],
  [x - 1, y],
  [x - 1, y + 1],
  [x, y - 1],
  // [x, y], // actual coord
  [x, y + 1],
  [x + 1, y - 1],
  [x + 1, y],
  [x + 1, y + 1],
]

const PAPER_ROLL = '@'
const PAPER_ROLLS_LIMIT = 4

// builds the "value getter" with current grid
const getAdjascentPositions = (grid) => {
  const ROW = { min: 0, max: grid[0].length - 1 }
  const COL = { min: 0, max: grid.length - 1 }

  // returns a function to get the values around a coord
  return ([x, y]) => {
    const validCoord = getAdjascentCoord([x, y]).reduce((acc, curr) => {
      const [i, j] = curr
      if (i < ROW.min || i > ROW.max || j < COL.min || j > COL.max) {
        return acc
      }

      return [...acc, curr]
    }, [])

    // return values from the grid
    return validCoord.map(([i, j]) => grid[i][j])
  }
}

const stringOccurrencesCounter = (str, char) => {
  const matches = str.match(new RegExp(char, 'g')) || []

  return matches.length
}

const removeRollsOfPaper = (grid) => {
  let result = 0

  const updated = []
  const getValuesAtPosition = getAdjascentPositions(grid)
  for (let i = 0; i < grid.length; i += 1) {
    const updatedGrid = []
    for (let j = 0; j < grid[i].length; j += 1) {
      const positionValue = grid[i][j]
      const values = getValuesAtPosition([i, j])
      if (
        positionValue === PAPER_ROLL &&
        stringOccurrencesCounter(values.join(''), PAPER_ROLL) <
          PAPER_ROLLS_LIMIT
      ) {
        updatedGrid.push('.')
        result += 1
      } else {
        updatedGrid.push(positionValue)
      }
    }
    updated.push(updatedGrid)
  }

  return { updatedGrid: updated, removedRolls: result }
}

const solve = async (data) => {
  const grid = data
    .split('\n')
    .slice(0, -1)
    .map((line) => line.split(''))

  let result = 0

  const { updatedGrid: firstRunGrid, removedRolls: firstRunRemovedRolls } =
    removeRollsOfPaper(grid)

  result = firstRunRemovedRolls

  console.log('> result 1:', result)

  // use the first iteration
  let prevResult = 0
  let newGrid = firstRunGrid
  while (result !== prevResult) {
    const { updatedGrid, removedRolls } = removeRollsOfPaper(newGrid)

    // update values after rolls removed
    newGrid = updatedGrid
    prevResult = result
    result += removedRolls
  }

  console.log('> result 2:', result)
}

export default function () {
  console.log('--- Day 04: Printing Department ---')

  const data = readFile('04/input.in')

  return solve(data)
}
