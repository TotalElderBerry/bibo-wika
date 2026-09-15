export default defineEventHandler(async (event) => {
  await destroyParentSession(event)
  return { ok: true }
})
