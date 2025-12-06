import { readFile } from '_utils/file'

const sumArray = (arr) => arr.reduce((acc, value) => acc + value, 0)

const solve = (data) => {
  const ranges = data.split(',')
  //console.log(ranges);

  let invalidIds = []
  for (const range of ranges) {
    const [start, end] = range.split('-').map((v) => Number(v))

    for (let i = start; i <= end; i += 1) {
      const value = `${i}`

      // only possible to find repeated numbers if value.length is pair
      if (value.length % 2 !== 0) {
        // if odd length, jump to the next minimum value.length (pair)
        i = Math.pow(10, value.length)
        continue
      }

      // check if the value only repeats twice
      const sliceIndex = value.length / 2
      const firstHalf = value.slice(0, sliceIndex)
      const secondHalf = value.slice(sliceIndex)
      if (firstHalf === secondHalf) {
        invalidIds.push(i)
      }
    }
  }

  let result = sumArray(invalidIds)

  console.log('> result 1:', result)

  invalidIds = []
  for (const range of ranges) {
    const [start, end] = range.split('-').map((v) => Number(v))

    for (let i = start; i <= end; i += 1) {
      const value = `${i}`

      for (let j = 1; j < value.length; j += 1) {
        const segments = value.match(new RegExp(`.{1,${j}}`, 'g'))

        // only 1 segment = no repeated values
        if (segments.length === 1) {
          break
        }

        // check if all segments are equal
        const hasDifferentSegmentValues = segments.some(
          (segment) => segment !== segments[0]
        )

        // if all segments are equal
        if (!hasDifferentSegmentValues) {
          // save current value
          invalidIds.push(i)
          // stop searching for this value
          break
        }
      }
    }
  }

  result = sumArray(invalidIds)
  console.log('> result 2:', result)
}

export default function () {
  console.log('--- Day 02: Gift Shop ---')

  const data = readFile('02/input.in')

  return solve(data)
}
