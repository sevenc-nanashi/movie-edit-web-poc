/* @refresh reload */
import "./index.scss"
import { render } from "solid-js/web"

import App from "./App"
import { HopeProvider } from "@hope-ui/core"

render(
  () => (
    <HopeProvider>
      <App />
    </HopeProvider>
  ),
  document.getElementById("root") as HTMLElement
)
