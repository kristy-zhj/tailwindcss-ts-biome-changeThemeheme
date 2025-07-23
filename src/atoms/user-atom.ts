import { D } from "@mobily/ts-belt"
import { atomWithStorage } from "jotai/utils"
import type { UserLogin } from "@/schema-types/user-schemas"

export const UserLoginAtom = atomWithStorage<UserLogin>("login", {
  UserId: "222222",
  UserName: "admin",
  UserRole: "admin",
  Claims: [],
  IsInitPassword: true,
})
