import { isValidTransition, VALID_TRANSITIONS } from '../../src/config/stageTransitions.js'

describe('isValidTransition', () => {

  describe('valid transitions', () => {
    it('applied → screening', () => {
      expect(isValidTransition('applied', 'screening')).toBe(true)
    })

    it('applied → rejected', () => {
      expect(isValidTransition('applied', 'rejected')).toBe(true)
    })

    it('screening → interview', () => {
      expect(isValidTransition('screening', 'interview')).toBe(true)
    })

    it('screening → rejected', () => {
      expect(isValidTransition('screening', 'rejected')).toBe(true)
    })

    it('interview → offer', () => {
      expect(isValidTransition('interview', 'offer')).toBe(true)
    })

    it('interview → rejected', () => {
      expect(isValidTransition('interview', 'rejected')).toBe(true)
    })

    it('offer → hired', () => {
      expect(isValidTransition('offer', 'hired')).toBe(true)
    })

    it('offer → rejected', () => {
      expect(isValidTransition('offer', 'rejected')).toBe(true)
    })
  })

  describe('invalid transitions', () => {
    it('cannot skip from applied → interview', () => {
      expect(isValidTransition('applied', 'interview')).toBe(false)
    })

    it('cannot skip from applied → hired', () => {
      expect(isValidTransition('applied', 'hired')).toBe(false)
    })

    it('cannot go backward from screening → applied', () => {
      expect(isValidTransition('screening', 'applied')).toBe(false)
    })

    it('cannot go backward from interview → screening', () => {
      expect(isValidTransition('interview', 'screening')).toBe(false)
    })
  })

  describe('terminal states', () => {
    it('hired has no valid transitions', () => {
      expect(VALID_TRANSITIONS.hired).toHaveLength(0)
    })

    it('rejected has no valid transitions', () => {
      expect(VALID_TRANSITIONS.rejected).toHaveLength(0)
    })

    it('cannot transition out of hired', () => {
      expect(isValidTransition('hired', 'offer')).toBe(false)
    })

    it('cannot transition out of rejected', () => {
      expect(isValidTransition('rejected', 'screening')).toBe(false)
    })

    it('unknown stage returns false', () => {
      expect(isValidTransition('nonexistent', 'screening')).toBe(false)
    })
  })
})