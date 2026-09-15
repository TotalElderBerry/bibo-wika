import type { Topic } from './types'
import { hayop } from './hayop'
import { pagkain } from './pagkain'
import { kulay } from './kulay'
import { bilang } from './bilang'
import { pamilya } from './pamilya'
import { pagbati } from './pagbati'

/**
 * The curriculum, in teaching order.
 *
 * This array is the registry the whole app reads through - the pack endpoint,
 * Salita Sabayan, and the seed script all import `topics` from here and nothing
 * else. Adding a topic is two lines: author `content/<slug>.ts`, add it below.
 *
 * The order is the order a child meets them, and it is deliberate:
 *
 *   1. hayop     animals - concrete, already known, every word is a picture
 *   2. pagkain   food - equally concrete, and the first four-way splits
 *   3. kulay     colours - abstract, but the swatch IS the picture
 *   4. bilang    numbers - abstract, and the clearest family resemblance
 *   5. pamilya   family - eight human figures, harder to tell apart
 *   6. pagbati   greetings - phrases rather than words, longest clips
 *
 * `ord` in Postgres is this index, so reordering here reorders the hub after
 * the next `pnpm db:seed`.
 */
export const topics: Topic[] = [hayop, pagkain, kulay, bilang, pamilya, pagbati]

export { hayop, pagkain, kulay, bilang, pamilya, pagbati }
