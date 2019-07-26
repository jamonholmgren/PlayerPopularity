// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import React, { useEffect, useState } from "react"
import { AppRegistry } from "react-native"
import { StorybookUIRoot } from "../storybook"
import { contains } from "ramda"
import { setupRootStore } from "./models/setup-root-store"
import { DEFAULT_NAVIGATION_CONFIG } from "./navx/navigation/navigation-config"
import { MainStack } from "./navigation/main-stack"
import { NavX } from "./navx"

/**
 * This is the root component of our app.
 */
export const App = (props: {}) => {
  const [rootStore, setRootStore] = useState(undefined)

  /**
   * When the component is mounted. This happens asynchronously and simply
   * re-renders when we're good to go.
   */
  useEffect(() => {
    setupRootStore().then(rs => {
      setRootStore(rs)
    })
  }, [])

  /**
   * Are we allowed to exit the app?  This is called when the back button
   * is pressed on android.
   *
   * @param routeName The currently active route name.
   */
  const canExit = (routeName: string) => {
    return contains(routeName, DEFAULT_NAVIGATION_CONFIG.exitRoutes)
  }

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  //
  // This step should be completely covered over by the splash screen though.
  //
  // You're welcome to swap in your own component to render if your boot up
  // sequence is too slow though.
  if (!rootStore) return null

  // otherwise, we're ready to render the app
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
