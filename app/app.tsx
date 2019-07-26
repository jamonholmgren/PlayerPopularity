// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import React, { useEffect, useState } from "react"
import { AppRegistry } from "react-native"
import { StorybookUIRoot } from "../storybook"
import { contains } from "ramda"
import { setupRootStore } from "./models/setup-root-store"
import { MainStack } from "./navigation/main-stack"
import { NavX } from "./navx"

/**
 * This is the root component of our app.
 */
export const App = (props: {}) => {
  const [rootStore, setRootStore] = useState(undefined)

  // setup root store and rerender
  useEffect(() => {
    setupRootStore().then(rs => {
      setRootStore(rs)
    })
  }, [])

  // what routes are allowed to exit on Android?
  const canExit = (routeName: string) => {
    return contains(routeName, ["firstExample"])
  }

  // render nothing while we wait for rootStore to load (should be quick)
  if (!rootStore) return null

  // we're ready to render the app!
  return <NavX screen={MainStack} rootStore={rootStore} canExit={canExit} />
}

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "PlayerPopularity"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App
AppRegistry.registerComponent(APP_NAME, () => RootComponent)
