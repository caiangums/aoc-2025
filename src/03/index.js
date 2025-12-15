import { readFile } from '_utils/file'

const buildGetFunction = (bank) => (index) => Number(bank.charAt(index))

const solve = async (data) => {
  const banks = data.split('\n').slice(0, -1)

  let joltage = []

  for (const bank of banks) {
    const getPos = buildGetFunction(bank)

    let first = getPos(0)
    let second = getPos(1)

    let pos = [0, 1]

    for (let i = 1; i < bank.length; i += 1) {
      const actual = getPos(i)

      // if greater that first digit and not last element
      if (actual > first && i < bank.length - 1) {
        // update first digit
        first = actual
        // update second digit
        second = getPos(i + 1)
        // account for next iteration
        pos = [i, i + 1]
        continue
      }

      // if greater than second digit
      if (actual > second) {
        pos = [pos[0], i]
        second = actual
      }
    }

    joltage.push(Number(`${first}${second}`))
  }

  let result = joltage.reduce((acc, curr) => acc + curr, 0)

  console.log('> result 1:', result)

  // reset result and joltage
  result = 0
  joltage = []

  for (const bank of banks) {
    const getPos = buildGetFunction(bank)

    // get the last 12 values
    let number = bank.split('').slice(-12)

    // get the last 12 values index
    let pos = Array.from({ length: 12 }, (v, idx) => bank.length - 1 - idx).reverse()

    let count = 0
    // backwards limit index
    let backLimitIdx = 0
    while (count < 12) {
      const startPos = pos[count]

      // save the actual value, preventing from unnecessary changing during checks
      let actual = getPos(startPos)
      // iterate backwards
      for (let i = startPos; i > backLimitIdx; i--) {
        const prev = getPos(i-1)
        
        if (prev >= actual) {
          // update actual value
          pos[count] = i-1
          actual = prev
        }
      }

      // update value based on updated position
      const updatedValue = getPos(pos[count])
      number[count] = updatedValue
      
      // update backwards limit idx
      backLimitIdx = pos[count] + 1
      count += 1
    }

    joltage.push(Number(number.join('')))
  }

  result = joltage.reduce((acc, curr) => acc + curr, 0)

  console.log('> result 2:', result)
}

export default function () {
  console.log('--- Day 03: Lobby ---')

  const data = readFile('03/input.in')

  return solve(data)
}
