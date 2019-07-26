import React, { useState, useEffect } from "react"
import { onSnapshot } from "mobx-state-tree"
import { Provider } from "mobx-react"
import { createNavXNavigator } from "./navigation/navx-navigator"
// import { NavigationStore, NavigationStoreModel } from "./stores/navigation-store"
import { createNavigationStoreModel } from "./stores/navigation-store"
import { BackButtonHandler } from "./components/back-button-handler"
import * as storage from "./storage"
import { createStackNavigator } from "react-navigation"

const NAVIGATION_STATE_STORAGE_KEY = "NavX-NAVIGATION_STATE_STORAGE_KEY"

// just the parts of Reactotron we need
type BasicReactotron = {
  error: Function
  trackMstNode: (any) => void
  [key: string]: unknown
}

export type NavXProps = {
  screen: any
  rootStore: any
  storageKey?: string
  reactotron?: BasicReactotron
  navOptions?: any
  canExit?: (route: string) => boolean
}

export const NavX = (props: NavXProps) => {
  const [navStore, setNavStore] = useState(undefined)
  const storageKey: string = props.storageKey || NAVIGATION_STATE_STORAGE_KEY

  // make a quick root navigator
  const RootNavigator = createStackNavigator(
    {
      rootStack: { screen: props.screen },
    },
    {
      headerMode: "none",
      navigationOptions: { gesturesEnabled: false },
      ...props.navOptions,
    },
  )

  useEffect(() => {
    const NavigationStoreModel = createNavigationStoreModel(RootNavigator)

    // prepare the environment that will be associated with the NavigationStore.
    try {
      // load data from storage
      storage.load(storageKey).then(data => {
        setNavStore(NavigationStoreModel.create(data || {}, {}))
      })
    } catch (e) {
      // fallback to empty state
      setNavStore(NavigationStoreModel.create({}, {}))

      // but please inform us what happened, if we have Reactotron enabled
      __DEV__ && props.reactotron && props.reactotron.error(e.message, null)
    }
  }, [])

  // if it's not set yet, just return nothing for now
  if (!navStore) return null

  // track nav changes & save to storage
  onSnapshot(navStore, snapshot => storage.save(storageKey, snapshot))

  // if Reactotron is available, set it up to track the navStore
  if (__DEV__ && props.reactotron) {
    props.reactotron.trackMstNode(navStore)
  }

  const NavXNavigator = createNavXNavigator(RootNavigator)

  return (
    // access with `useRootStore` and `useNavigationStore` hooks
    <Provider rootStore={props.rootStore} navigationStore={navStore}>
      <BackButtonHandler canExit={props.canExit}>
        <NavXNavigator>{props.screen}</NavXNavigator>
      </BackButtonHandler>
    </Provider>
  )
}
