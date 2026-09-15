import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/** Spec section 05, as Postgres. Adding Bicolano = adding one enum value. */
export const langEnum = pgEnum('lang', ['tl', 'ceb', 'ilo', 'hil'])
export const bandEnum = pgEnum('band', ['usbong', 'puno'])
export const audioStatusEnum = pgEnum('audio_status', ['pending', 'recorded', 'approved'])

export const topics = pgTable('topics', {
  slug: text('slug').primaryKey(),
  en: text('en').notNull(),
  art: text('art').notNull(),
  /** Per-language display titles, keyed by lang code. */
  title: jsonb('title').$type<Record<string, string>>().notNull(),
  ord: smallint('ord').notNull().default(0),
})

export const concepts = pgTable(
  'concepts',
  {
    id: text('id').primaryKey(), // 'animal.dog'
    topic: text('topic')
      .notNull()
      .references(() => topics.slug, { onDelete: 'cascade' }),
    bands: bandEnum('bands').array().notNull(),
    en: text('en').notNull(),
    art: text('art').notNull(),
    ord: smallint('ord').notNull().default(0),
  },
  (t) => [index('concepts_topic_idx').on(t.topic)],
)

/**
 * One row per concept per language. This table is the whole product: the
 * four-column translation view in the CMS edits it, the release gate reads
 * `status` off it, and a language pack is a projection of it.
 */
export const forms = pgTable(
  'forms',
  {
    conceptId: text('concept_id')
      .notNull()
      .references(() => concepts.id, { onDelete: 'cascade' }),
    lang: langEnum('lang').notNull(),
    text: text('text').notNull(),
    respell: text('respell').notNull(),
    ipa: text('ipa'),
    /** Regional alternates. Always accepted as correct. Spec section 03. */
    variants: jsonb('variants').$type<string[]>().notNull().default([]),
    /** R2 object key. Audio is never a blob in Postgres. */
    audioKey: text('audio_key'),
    status: audioStatusEnum('status').notNull().default('pending'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.conceptId, t.lang] }),
    index('forms_status_idx').on(t.lang, t.status),
  ],
)

/**
 * Child profiles. Local-first: a profile exists on the device and syncs only
 * if a parent has created an account. No birthdate - a band is enough.
 * Spec section 11.
 */
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  parentId: text('parent_id').references(() => parentAccounts.id, { onDelete: 'set null' }),
  displayName: text('display_name').notNull(),
  band: bandEnum('band').notNull().default('usbong'),
  /** { base, skin, hair, outfit, accessory } */
  avatar: jsonb('avatar').$type<Record<string, string>>().notNull(),
  activeLang: langEnum('active_lang').notNull().default('tl'),
  xp: integer('xp').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('profiles_parent_idx').on(t.parentId)])

/**
 * Leitner box state, per concept PER LANGUAGE. A child who learns `dog` in
 * Cebuano still meets it fresh in Ilocano.
 */
export const progress = pgTable(
  'progress',
  {
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    conceptId: text('concept_id').notNull(),
    lang: langEnum('lang').notNull(),
    box: smallint('box').notNull().default(1), // 1..5
    dueAt: timestamp('due_at', { withTimezone: true }).notNull().defaultNow(),
    seen: integer('seen').notNull().default(0),
    lapses: integer('lapses').notNull().default(0),
    medianMs: integer('median_ms'),
  },
  (t) => [
    primaryKey({ columns: [t.profileId, t.conceptId, t.lang] }),
    index('progress_due_idx').on(t.profileId, t.dueAt),
  ],
)

/**
 * Parent accounts. Children still do not log in; this is for adult-owned
 * dashboards, sync setup, and future profile management.
 */
export const parentAccounts = pgTable(
  'parent_accounts',
  {
    id: text('id').primaryKey(),
    displayName: text('display_name').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('parent_accounts_email_idx').on(t.email)],
)

export const parentSessions = pgTable(
  'parent_sessions',
  {
    id: text('id').primaryKey(),
    parentId: text('parent_id')
      .notNull()
      .references(() => parentAccounts.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('parent_sessions_parent_idx').on(t.parentId)],
)
