import { readFile } from '_utils/file'

const getDistanceBetween = (pos1, pos2) => {
  const [x1, y1, z1] = pos1
  const [x2, y2, z2] = pos2

  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  )
}

const evaluateDistances = (positions) => {
  const distances = new Map()

  for (const pos1 of positions) {
    const pos1Str = pos1.join(',')

    for (const pos2 of positions) {
      const pos2Str = pos2.join(',')
      if (
        pos1Str !== pos2Str &&
        !(
          distances.has(`${pos2Str};${pos1Str}`) ||
          distances.has(`${pos1Str};${pos2Str}`)
        )
      ) {
        const distance = getDistanceBetween(pos1, pos2)
        distances.set(`${pos1Str};${pos2Str}`, distance)
      }
    }
  }

  return distances
}

const connectCircuitsUntilLimit = (distances, LIMIT = 1000) => {
  // created circuits
  const circuits = []
  for (let i = 0; i < LIMIT; i += 1) {
    const [boxes, distance] = distances[i]
    const [box1, box2] = boxes.split(';')

    const existingBox1Index = circuits.findIndex((el) => el.includes(box1))
    const existingBox2Index = circuits.findIndex((el) => el.includes(box2))

    // both new boxes = totally new circuit
    if (existingBox1Index < 0 && existingBox2Index < 0) {
      circuits.push([box1, box2])
      continue
    }

    // both boxes are already present somewhere
    if (existingBox1Index >= 0 && existingBox2Index >= 0) {
      // and both are already at same circuit
      if (existingBox1Index === existingBox2Index) {
        continue
      }

      // they are at different circuits, need merge
      const circuitBox1 = circuits[existingBox1Index]
      const circuitBox2 = circuits[existingBox2Index]

      for (const el of circuits[existingBox2Index]) {
        if (!circuitBox1.includes(el)) {
          circuitBox1.push(el)
        }
      }

      // clear the now empty circuit
      circuits[existingBox2Index] = []
      // since the connection is already stablished, the loop
      // of execution can continue without creating it
      continue
    }

    // AT LEAST ONE IS PRESENT
    if (existingBox1Index >= 0) {
      circuits[existingBox1Index].push(box2)
    }

    if (existingBox2Index >= 0) {
      circuits[existingBox2Index].push(box1)
    }
  }

  return circuits
}

const connectCircuitsUntilAllConnected = ({
  circuits: _circuits,
  distances,
}) => {
  // circuits
  let circuits = [..._circuits]
  let lastConnected = []
  for (let i = 0; circuits.length !== 1; i += 1) {
    const [boxes, distance] = distances[i]
    const [box1, box2] = boxes.split(';')
    lastConnected = [box1, box2]

    const existingBox1Index = circuits.findIndex((el) => el.includes(box1))
    const existingBox2Index = circuits.findIndex((el) => el.includes(box2))

    // both new boxes = totally new circuit
    if (existingBox1Index < 0 && existingBox2Index < 0) {
      circuits.push([box1, box2])
      continue
    }

    // both boxes are already present somewhere
    if (existingBox1Index >= 0 && existingBox2Index >= 0) {
      // and both are already at same circuit
      if (existingBox1Index === existingBox2Index) {
        continue
      }

      // they are at different circuits, need merge
      const circuitBox1 = circuits[existingBox1Index]
      const circuitBox2 = circuits[existingBox2Index]

      for (const el of circuits[existingBox2Index]) {
        if (!circuitBox1.includes(el)) {
          circuitBox1.push(el)
        }
      }

      // clear the now empty circuit
      circuits[existingBox2Index] = []
      circuits = circuits.filter((circuit) => circuit.length !== 0)
      // since the connection is already stablished, the loop
      // of execution can continue without creating it
      continue
    }

    // AT LEAST ONE IS PRESENT
    if (existingBox1Index >= 0) {
      circuits[existingBox1Index].push(box2)
    }

    if (existingBox2Index >= 0) {
      circuits[existingBox2Index].push(box1)
    }
  }

  return [circuits, lastConnected]
}

const solve = (data) => {
  const positions = data
    .split('\n')
    .slice(0, -1)
    .map((v) => v.split(',').map((n) => Number(n)))

  const distances = evaluateDistances(positions)

  // sort by smallest distances
  const distancesSorted = [...distances].sort((a, b) => a[1] - b[1])

  const circuits = connectCircuitsUntilLimit(distancesSorted)

  const sortedCircuits = [...circuits].sort((a, b) => b.length - a.length)

  let result = 1
  for (const largestCircuit of sortedCircuits.slice(0, 3)) {
    result = result * largestCircuit.length
  }

  console.log('> result 1:', result)

  const preCircuits = positions.map((el) => [el.join(',')])

  const [allCircuits, lastConnected] = connectCircuitsUntilAllConnected({
    circuits: preCircuits,
    distances: distancesSorted,
  })

  if (allCircuits.length !== 1) {
    console.log('ERROR!')
  }

  const [x1, x2] = lastConnected.map((el) => Number(el.split(',')[0]))

  result = x1 * x2

  console.log('> result 2:', result)
}

export default function () {
  console.log('--- Day 08: Playground ---')

  const data = readFile('08/input.in')

  return solve(data)
}
