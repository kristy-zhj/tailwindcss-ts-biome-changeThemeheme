import { z } from "zod"

export const ClaimsEnum = z.enum([
  "FilterStudy",
  "ImportData",
  "ExportData",
  "DeleteData",
  "Lock",
  "EditCurrentAccount",
  "CreateAccount",
  "EditAccount",
  "ResetPassword",
  "SuspenseAccount",
  "CreateAnalysis",
  "TakeScreenshot",
  "ViewReport",
  "DownloadReport",
])

export type ClaimsEnumType = z.infer<typeof ClaimsEnum>

export const ClaimsSchema = z.array(
  z.object({
    Type: ClaimsEnum,
    Value: ClaimsEnum,
  }),
)

export type Claims = z.infer<typeof ClaimsSchema>

export const UserLoginSchema = z.object({
  UserId: z.string().uuid(),
  UserName: z.string(),
  UserRole: z.string(),
  Claims: ClaimsSchema,
  IsInitPassword: z.boolean(),
})

export type UserLogin = z.infer<typeof UserLoginSchema>
