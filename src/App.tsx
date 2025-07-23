import type { ReactElement } from "react"
import { Redirect, Route, Router, Switch } from "wouter"
import { AuthRoute } from "./auth-route/auth-route"
import { Header } from "./features/header"
import "./index.css"
import { Home } from "./pages/home"
import { PreviewReport } from "./pages/report"
import { Settings } from "./pages/settings"

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
      title: "查看报告",
      url: "/report",
      component: () => <PreviewReport />,
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
