import { Button } from "antd"
import { Effect } from "effect"
import { type FC, useCallback, useMemo, useState } from "react"

export const EffectTS: FC<{}> = () => {
  const [count, setCount] = useState(0)

  const task = useMemo(() => Effect.sync(() => setCount(count + 1)), [count])

  const increment = useCallback(() => Effect.runSync(task), [task])

  interface User {
    id: number
    name: string
  }
  const getUser = (userId: number): Effect.Effect<User, Error> => {
    const userDatabase: Record<number, User> = {
      1: { id: 1, name: "user1" },
      2: { id: 2, name: "user2" },
    }
    const user = userDatabase[userId]
    if (!user) {
      return Effect.fail(new Error("user not found"))
    }
    return Effect.succeed(user)
  }

  const log = (message: string) => Effect.sync(() => console.log(message))
  console.log(log("hello world"))

  const parse = (input: string) =>
    Effect.try({
      try: () => parseInt(input),
      catch: () => new Error("invalid input"),
    })
  console.log(parse("123"))

  return (
    <div>
      <div>count: {count}</div>
      <Button type="primary" onClick={increment}>
        count ++
      </Button>
    </div>
  )
}
