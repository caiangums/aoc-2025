import { readFile } from '_utils/file'

const START = 50
const MOD = 100

const getDirectionAndDistance = (line) => [
  line.charAt(0),
  Number(line.slice(1)),
]

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  let pointer = START
  let stopsAtZero = 0
  for (const line of lines) {
    const [direction, distance] = getDirectionAndDistance(line)

    if (direction === 'L') {
      pointer = (pointer - distance) % MOD
      if (pointer < 0) {
        pointer = pointer + MOD
      }
    } else {
      pointer = (pointer + distance) % MOD
    }

    if (pointer === 0) stopsAtZero += 1
  }

  console.log('> result 1:', stopsAtZero)

  // reset pointer
  pointer = START
  let goOverOrStopsAtZero = 0
  for (const line of lines) {
    const [direction, distance] = getDirectionAndDistance(line)

    let updatedPointer = pointer
    if (direction === 'L') {
      // if pointer starts at 0
      if (pointer === 0) goOverOrStopsAtZero -= 1

      updatedPointer -= distance
      while (updatedPointer < 0) {
        goOverOrStopsAtZero += 1
        updatedPointer += MOD
      }

      // if pointer finishes at 0
      if (updatedPointer === 0) goOverOrStopsAtZero += 1
    } else {
      // direction === 'R'
      updatedPointer += distance
      while (updatedPointer >= MOD) {
        goOverOrStopsAtZero += 1
        updatedPointer -= MOD
      }
    }

    // update pointer
    pointer = updatedPointer
  }

  console.log('> result 2:', goOverOrStopsAtZero)
}

export default function () {
  console.log('--- Day 01: Secret Entrance ---')

  const data = readFile('01/input.in')

  return solve(data)
}
