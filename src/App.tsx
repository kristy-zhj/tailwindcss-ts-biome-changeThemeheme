import type { ReactElement } from "react"
import { Redirect, Route, Router, Switch } from "wouter"
import { AuthRoute } from "./auth-route/auth-route"
import "./index.css"
import { Header } from "./features/header"
import { Home } from "./page/home"
import { Settings } from "./page/settings"

interface RouteItem {
  title: string
  url: string
  urlChildren?: RouteItem[]
  component: (params: any) => ReactElement
}

function App() {
  const routes: RouteItem[] = [
    {
      title: "首页",
      url: "/",
      component: () => <Home />,
    },
    {
      title: "系统设置",
      url: "/settings/:any*",
      component: () => (
        <Router base="/settings" key="settings">
          <Settings />
        </Router>
      ),
    },
  ]
  return (
    <div className="w-full h-full overflow-hidden">
      <Header />
      <Switch>
        {routes.map((v, k) => {
          return (
            <AuthRoute path={v.url} key={`key-${k + 1}`}>
              {v.component}
            </AuthRoute>
          )
        })}
        <Route>
          <Redirect to={"/"} />
        </Route>
      </Switch>
    </div>
  )
}

export default App
