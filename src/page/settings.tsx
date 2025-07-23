import { UserLoginAtom } from "@atoms/user-atom"
import { Menu } from "antd"
import { useAtomValue } from "jotai"
import { type FC, useEffect, useState } from "react"
import { match, P } from "ts-pattern"
import { Route, Switch, useLocation } from "wouter"

export const Settings: FC<{}> = () => {
  const [activeKey, setActiveKey] = useState(["user-list"])
  const [location, setLocation] = useLocation()
  const userLogin = useAtomValue(UserLoginAtom)

  useEffect(() => {
    match(location)
      .with(P.string.includes("user-list"), () => setActiveKey(["user-list"]))
      .with(P.string.includes("account"), () => setActiveKey(["account"]))
      .with(P.string.includes("manual"), () => setActiveKey(["manual"]))
      .with(P.string.includes("about"), () => setActiveKey(["about"]))
      .with(P.string.includes("activation"), () => setActiveKey(["activation"]))
      .otherwise(() => {
        setActiveKey(["user-list"])
      })
  }, [location])

  const userListDisabled = match(userLogin.UserRole)
    .with("SuperAdmin", () => false)
    .with("Anonymous", () => true)
    .otherwise(() => {
      let disabled = true
      userLogin.Claims.map(s =>
        match(s.Value)
          .with("CreateAccount", "EditAccount", "ResetPassword", "SuspenseAccount", () => {
            disabled = false
          })
          .otherwise(() => {}),
      )
      return disabled
    })

  const accountDisabled = match(userLogin.UserRole)
    .with("SuperAdmin", () => false)
    .with("Anonymous", () => true)
    .otherwise(() => {
      let disabled = true
      userLogin.Claims.map(s =>
        match(s.Value)
          .with("EditCurrentAccount", () => {
            disabled = false
          })
          .otherwise(() => {}),
      )
      return disabled
    })

  const activationDisabled = match(userLogin.UserRole)
    .with("SuperAdmin", () => false)
    .otherwise(() => true)

  const items = [
    {
      key: "user-list",
      label: "用户管理",
      disabled: userListDisabled,
    },
    {
      key: "account",
      label: "账号设置",
      disabled: accountDisabled,
    },
    {
      key: "activation",
      label: "软件激活",
      disabled: activationDisabled,
    },
  ]

  return (
    <div className="flex w-full h-[calc(100vh_-_96px)] overflow-hidden">
      <div className="bg-bg-nav border-r border-border border-solid w-[240px] h-full [&_.ant-menu-item]:!h-[48px]">
        <Menu
          className={
            "settings-menu !bg-bg-nav text-[16px] !border-transparent [&>.ant-menu-item-disabled]:!hidden [&>.ant-menu-item]:text-base"
          }
          items={items}
          mode="inline"
          selectedKeys={activeKey}
          openKeys={activeKey}
          onSelect={item => {
            setActiveKey([item.key])
            setLocation("/" + item.key)
          }}
        />
      </div>
      <div className="w-[calc(100vw_-_240px)] h-full">
        <Switch>
          <Route path="/user-list">
            <div>用户管理</div>
          </Route>
          <Route path="/account">
            <div>账号设置</div>
          </Route>
          <Route path="/activation">
            <div>软件激活</div>
          </Route>
        </Switch>
      </div>
    </div>
  )
}
