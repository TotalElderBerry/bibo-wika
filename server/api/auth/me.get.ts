export default defineEventHandler(async (event) => {
  return {
    parent: await getCurrentParent(event),
  }
})
