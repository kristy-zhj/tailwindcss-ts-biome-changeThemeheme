import { UserLoginAtom } from "@atoms/user-atom"
import { D, pipe } from "@mobily/ts-belt"
import { message } from "antd"
import { useAtom } from "jotai"
import { type FC, type ReactNode, useEffect } from "react"
import { match } from "ts-pattern"
import { useLocation, useRoute } from "wouter"

export const AuthRoute: FC<{
  path: string
  children?: ReactNode | ((params: any) => ReactNode)
}> = ({ path, children }) => {
  const [matchRoute, params] = useRoute(path)
  const [userLogin, setUserLogin] = useAtom(UserLoginAtom)
  const [location, setLocation] = useLocation()

  useEffect(() => {
    // userApiClient
    //   .checkLoginState()
    //   .then(() => {
    //     if (userLogin.IsInitPassword) {
    //       setLocation("/change-init-password", { replace: false })
    //     }
    //   })
    //   .catch(err => {
    //     if (err.response?.status === 401) {
    //       setUserLogin(D.makeEmpty())
    //       setLocation("/login?auth-failed", { replace: false })
    //     }
    //   })
  }, [userLogin, location])

  useEffect(() => {
    message.destroy()
  }, [])

  return (
    <>
      {match(matchRoute)
        .with(true, () => {
          return (
            <>
              {match(pipe(userLogin, D.isNotEmpty))
                .with(true, () => (typeof children === "function" ? children(params) : children))
                .otherwise(() => null)}
            </>
          )
        })
        .otherwise(() => {
          return null
        })}
    </>
  )
}
