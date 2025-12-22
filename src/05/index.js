import { readFile } from '_utils/file'

const buildIsFresh = (ingredientsRanges) => (ingredient) =>
  ingredientsRanges.some((range) => {
    const [a, b] = range.split('-').map((v) => Number(v))

    return ingredient >= a && ingredient <= b
  })

const solve = (data) => {
  const [ingredientsRanges, availableIngredients] = data
    .split('\n\n')
    .map((item) => item.split('\n'))

  const isFresh = buildIsFresh(ingredientsRanges)

  const ingredients = availableIngredients.slice(0, -1)

  let result = 0
  for (const ingredient of ingredients) {
    if (isFresh(ingredient)) {
      result += 1
    }
  }

  console.log('> result 1:', result)

  // sort the list to iterate
  const allPossibleFresh = ingredientsRanges
    .map((range) => range.split('-').map((v) => Number(v)))
    .sort((a, b) => {
      if (a[0] === b[0]) {
        return a[1] - b[1]
      }

      return a[0] - b[0]
    })

  let prevAdded = [...allPossibleFresh[0]]
  const absoluteList = [prevAdded]
  for (let i = 1; i < allPossibleFresh.length; i += 1) {
    const toBeAdded = allPossibleFresh[i]
    let shouldAdd = true

    const [ai, bi] = prevAdded
    const [aj, bj] = toBeAdded

    // if doesn't intersect
    if (ai > bj || bi < aj) {
      // just add it
      shouldAdd = true
    } else if (ai === aj && bi === bj) {
      // prevent from adding duplicates
      shouldAdd = false
    } else {
      /* >> it DOES intersect << */

      // start is equal
      if (ai === aj) {
        // prevAdded end is equal or higher (already covered)
        if (bi >= bj) {
          // NOTE: this check was left for completion
          // prevent from adding
          shouldAdd = false
        }

        // BUT if toBeAdded end is higher (new values)
        if (bi < bj) {
          // update prevAdded end
          prevAdded[1] = bj
          // and prevent from adding
          shouldAdd = false
        }
      }

      // prevAdded start is higher than toBeAdded start
      if (ai > aj) {
        // NOTE: this check was left for completion
        // the list is sorted, this is impossible
        throw new Error('Impossible Condition')
      }

      // prevAdded start is lower than toBeAdded start
      if (ai < aj) {
        // prevAdded end is equal or higher (already covered)
        if (bi >= bj) {
          // NOTE: this check was left for completion
          // prevent from adding
          shouldAdd = false
        }

        // BUT if toBeAdded end is higher (new values)
        if (bi < bj) {
          // update prevAdded end
          prevAdded[1] = bj
          // and prevent from adding
          shouldAdd = false
        }
      }
    }

    if (shouldAdd) {
      absoluteList.push(toBeAdded)
      prevAdded = toBeAdded
    }
  }

  result = 0
  // sum all possible values
  for (const range of absoluteList) {
    const [a, b] = range
    result += b - a + 1
  }

  console.log('> result 2:', result)
}

export default function () {
  console.log('--- Day 05: Cafeteria ---')

  const data = readFile('05/input.in')

  return solve(data)
}
