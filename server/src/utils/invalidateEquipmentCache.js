
import redis from "../config/redis.js";

export async function invalidateEquipmentCache() {
  let cursor = "0";

  try {
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        "cache:equipments:*",
        "COUNT",
        100
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    // A cache failure should not undo a successful database write.
    console.error("Equipment cache invalidation failed:", error.message);
  }
}
