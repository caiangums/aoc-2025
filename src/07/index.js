import { readFile } from '_utils/file'

const START_CHAR = 'S'
const BEAM_CHAR = '|'
const EMPTY_CHAR = '.'
const SPLIT_CHAR = '^'

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)

  const startIndex = lines[0].indexOf(START_CHAR)

  let nextBeamIndexes = [startIndex]
  const updatedLines = [lines[0]]
  let splittedTimes = 0
  let it = 0

  for (const line of lines.slice(1)) {
    const newLine = line.split('')
    const matches = [...line.matchAll(/\^/g)]

    if (matches.length !== 0) {
      const newNextBeamIndexes = new Set(nextBeamIndexes)
      for (const match of matches) {
        const splitIndex = match.index

        if (nextBeamIndexes.includes(splitIndex)) {
          splittedTimes += 1
          // remove splitter
          newNextBeamIndexes.delete(splitIndex)

          const [prevIndex, nextIndex] = [splitIndex - 1, splitIndex + 1]

          // update beams
          if (prevIndex >= 0 && line.charAt(prevIndex) === EMPTY_CHAR) {
            newNextBeamIndexes.add(prevIndex)
          }

          if (
            nextIndex < line.length &&
            line.charAt(nextIndex) === EMPTY_CHAR
          ) {
            newNextBeamIndexes.add(nextIndex)
          }
        }
      }

      nextBeamIndexes = [...newNextBeamIndexes]
    }

    // draw beams
    for (const beamIndex of nextBeamIndexes) {
      newLine[beamIndex] = BEAM_CHAR
    }

    updatedLines.push(newLine.join(''))
    it += 1
  }

  console.log('> result 1:', splittedTimes)

  const revLines = [...updatedLines].reverse()

  // create weighted starting array
  const updatedRevLines = [
    revLines[0].split('').map((v) => (v === BEAM_CHAR ? 1 : 0)),
  ]

  // reset it
  it = 1
  // iterate "backwards"
  for (const revLine of revLines.slice(1)) {
    const line = revLine.split('')

    const updatedRevLine = []
    let jt = 0
    for (const el of line) {
      let value = 0
      // if is a start/beam, sum existing values
      if ([START_CHAR, BEAM_CHAR].includes(el)) {
        value = updatedRevLines[it - 1][jt]
      }

      // if is a split, sum prev AND next parallel universes
      if (el === SPLIT_CHAR) {
        const [prev, next] = [jt - 1, jt + 1]
        if (prev >= 0) {
          value += updatedRevLines[it - 1][prev]
        }

        if (next < line.length) {
          value += updatedRevLines[it - 1][next]
        }
      }

      updatedRevLine.push(value)
      jt += 1
    }

    updatedRevLines.push(updatedRevLine)
    it += 1
  }

  // the value at "starting location" is the actual number
  // of parallel universes
  const parallelUniverses = updatedRevLines[it - 1][startIndex]

  console.log('> result 2:', parallelUniverses)
}

export default function () {
  console.log('--- Day 07: Laboratories ---')

  const data = readFile('07/input.in')

  return solve(data)
}
