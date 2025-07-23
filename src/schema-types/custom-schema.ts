import { DateTime } from "luxon"
import { z } from "zod"

export const luxonDate = z.custom<DateTime>(
  data => {
    if (typeof data === typeof DateTime) {
      return data
    }
    return DateTime.fromISO(data as string)
  },
  { message: "failed parse data to luxon datetime" },
)
