import { describe, expect, test } from 'bun:test'
import { byId, emphasis, structures } from '../src/anatomy'

describe('selection emphasis', () => {
  test('keeps every structure normal without a selection', () => {
    expect(structures.every((s) => emphasis(s.id, null) === 'normal')).toBe(true)
  })

  test('keeps the selection solid and ghosts everything else', () => {
    const states = structures.map((s) => emphasis(s.id, 'pancreatic-duct'))
    expect(states.filter((s) => s === 'selected')).toHaveLength(1)
    expect(emphasis('pancreatic-duct', 'pancreatic-duct')).toBe('selected')
    expect(emphasis('pancreatic-head', 'pancreatic-duct')).toBe('ghosted')
  })
})

describe('source ownership', () => {
  test('assigns every source element to one structure, or to the parts that divide it', () => {
    const whole = structures.filter((s) => !s.part).flatMap((s) => s.elements)
    expect(new Set(whole).size).toBe(whole.length)
    for (const s of structures.filter((s) => s.part)) {
      expect(s.elements).toHaveLength(1)
      expect(whole).not.toContain(s.elements[0])
    }
  })

  test('gives every point of a divided element to exactly one part', () => {
    const parts = structures.filter((s) => s.elements[0] === 'FJ1895')
    expect(parts.map((s) => s.id)).toEqual(['pancreatic-head', 'pancreatic-body-and-tail'])
    for (const x of [-40, -9.5, -8.5, 30])
      for (const z of [1010, 1029, 1031, 1070])
        expect(parts.filter((s) => s.part!.keep([x, -120, z]))).toHaveLength(1)
    expect(byId['pancreatic-head'].part!.keep([-2, -120, 1015])).toBe(true)
    expect(byId['pancreatic-body-and-tail'].part!.keep([40, -120, 1060])).toBe(true)
  })
})
