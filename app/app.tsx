// Welcome to the main entry point of the app.
//
// In this file, we'll be kicking off our app or storybook.

import "./i18n"
import React, { useState } from "react"
import { AppRegistry } from "react-native"
import { StorybookUIRoot } from "../storybook"
import { NavX } from "react-navx"
import { MainStack } from "./navigation/main-stack"
import { AppStoreModel } from "./models/app-store"
import { createEnvironment } from "./models/env"

// This needs to match what's found in your app_delegate.m and MainActivity.java.
const APP_NAME = "PlayerPopularity"

// Kick off Reactotron and API services
const env = createEnvironment()

// This is the root component of our app.
export function App(props) {
  const [appStore] = useState(AppStoreModel.create({}, env))

  const canExit = (routeName: string) => {
    // routes you can exit the app from on Android back button
    const EXIT_ROUTES = ["firstExample"]
    // @ts-ignore
    return EXIT_ROUTES.includes(routeName)
  }
  return (
    <NavX
      storeModels={{ appStore: AppStoreModel }}
      stores={{ appStore }}
      screen={MainStack}
      canExit={canExit}
      env={env}
      storageKey={APP_NAME + "version number here"}
    />
  )
}

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

const RootComponent = SHOW_STORYBOOK && __DEV__ ? StorybookUIRoot : App
AppRegistry.registerComponent(APP_NAME, () => RootComponent)
