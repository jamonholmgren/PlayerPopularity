import React, { useState, useEffect } from "react"
import { onSnapshot, Instance } from "mobx-state-tree"
import { Provider } from "mobx-react"
import { createNavXNavigator } from "./navigation/navx-navigator"
import { createNavigationStoreModel } from "./stores/navigation-store"
import { RootStoreModel } from "./stores/root-store"
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
  rootStore?: any
  navStore?: any
  stores?: any
  storageKey?: string
  reactotron?: BasicReactotron
  navOptions?: any
  canExit?: (route: string) => boolean
  env?: any
}

export type RootStore = Instance<typeof RootStoreModel>

export const NavX = (props: NavXProps) => {
  // root store model extended with additional props
  const extraStores = props.stores || {}

  const [rootStore, setRootStore] = useState(props.rootStore)
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

  useEffect(
    () => {
      const NavigationStoreModel = createNavigationStoreModel(RootNavigator)

      const RootStoreModelX = RootStoreModel.props({
        navigationStore: NavigationStoreModel,
      }).props(extraStores)

      // prepare the environment that will be associated with the NavigationStore.
      // default store -- empty state
      const navigationStore = NavigationStoreModel.create({}, props.env || {})
      const initialRootStore = RootStoreModelX.create(
        {
          navigationStore,
          ...extraStores,
        },
        props.env || {},
      )
      setRootStore(initialRootStore)

      // load data from storage (if no rootStore provided via props)
      if (!props.rootStore) {
        storage.load(storageKey).then(data => {
          try {
            setRootStore(RootStoreModelX.create(data, {}))
          } catch (e) {
            // fallback to default state
            setRootStore(initialRootStore)

            // but please inform us what happened, if we have Reactotron enabled
            __DEV__ && props.reactotron && props.reactotron.error(e.message, null)
          }
        })
      }
    },
    [props.rootStore, props.navStore],
  )

  // if it's not set yet, just return nothing for now
  if (!rootStore) return null

  // track nav changes & save to storage
  onSnapshot(rootStore, snapshot => storage.save(storageKey, snapshot))

  // if Reactotron is available, set it up to track the rootStore
  if (__DEV__ && props.reactotron) {
    props.reactotron.trackMstNode(rootStore)
  }

  const NavXNavigator = createNavXNavigator(RootNavigator)

  return (
    // access with `useRootStore` and `useNavigationStore` hooks
    <Provider rootStore={rootStore}>
      <BackButtonHandler canExit={props.canExit}>
        <NavXNavigator>{props.screen}</NavXNavigator>
      </BackButtonHandler>
    </Provider>
  )
}
