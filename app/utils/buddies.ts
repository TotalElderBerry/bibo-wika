export type BuddyName = 'tikoy' | 'kalab' | 'haribon' | 'pawi' | 'maya' | 'sari'

export interface Buddy {
  id: BuddyName
  label: string
  /** Shown under the name in the picker, in the child's own words. */
  species: string
}

/** Phase 0 roster: six of the twelve Hayop buddies. Spec section 04. */
export const BUDDIES: Buddy[] = [
  { id: 'tikoy', label: 'Tikoy', species: 'Tarsier' },
  { id: 'kalab', label: 'Kalab', species: 'Kalabaw' },
  { id: 'haribon', label: 'Haribon', species: 'Agila' },
  { id: 'pawi', label: 'Pawi', species: 'Pawikan' },
  { id: 'maya', label: 'Maya', species: 'Ibon' },
  { id: 'sari', label: 'Sari', species: 'Sarimanok' },
]

export function buddyLabel(id: BuddyName): string {
  return BUDDIES.find((b) => b.id === id)?.label ?? 'Tikoy'
}
