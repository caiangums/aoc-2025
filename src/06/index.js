import { readFile } from '_utils/file'

const solve = (data) => {
  const lines = data.split('\n').slice(0, -1)
  const numbers = lines
    .slice(0, -1)
    .map((line) =>
      line
        .split(/\s+/g)
        .reduce(
          (acc, value) =>
            value.trim().length === 0 ? acc : [...acc, Number(value.trim())],
          []
        )
    )

  const operations = lines
    .slice(-1)[0]
    .split(/\s+/g)
    .reduce(
      (acc, operator) =>
        operator.trim().length === 0 ? acc : [...acc, operator.trim()],
      []
    )

  let results = operations.map((op) => (op === '*' ? 1 : 0))

  for (const numbersLine of numbers) {
    for (let i = 0; i < results.length; i += 1) {
      results[i] =
        operations[i] === '*'
          ? results[i] * numbersLine[i]
          : results[i] + numbersLine[i]
    }
  }

  let result = results.reduce((acc, curr) => acc + curr, 0)

  console.log('> result 1:', result)

  results = operations.map((op) => (op === '*' ? 1 : 0))

  let currentOperationIndex = 0
  for (let i = 0; i < lines[0].length; i += 1) {
    let value = ''
    // iterate vertically
    for (const line of lines.slice(0, -1)) {
      const curr = line[i]
      if (curr !== ' ') {
        value += curr
      }
    }

    // new operation next
    if (value.length === 0) {
      currentOperationIndex += 1
      continue
    }

    const operation = operations[currentOperationIndex]

    results[currentOperationIndex] =
      operations[currentOperationIndex] === '*'
        ? results[currentOperationIndex] * Number(value)
        : results[currentOperationIndex] + Number(value)
  }

  result = results.reduce((acc, curr) => acc + curr, 0)
  console.log('> result 2:', result)
}

export default function () {
  console.log('--- Day 06: Trash Compactor ---')

  const data = readFile('06/input.in')

  return solve(data)
}
