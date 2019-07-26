import { useState, useEffect } from "react"
import { onSnapshot } from "mobx-state-tree"
import { Provider } from "mobx-react"
import { createNavXNavigator } from "./navigation/navx-navigator"
import { NavigationStore, NavigationStoreModel } from "./stores/navigation-store"
import { BackButtonHandler } from "./components/back-button-handler"
import * as storage from "./storage"

const NAVIGATION_STATE_STORAGE_KEY = "NavX-NAVIGATION_STATE_STORAGE_KEY"

// just the parts of Reactotron we need
type BasicReactotron = {
  error: Function
  trackMstNode: (NavigationStore) => void
  [key: string]: unknown
}

export type NavXOptions = {
  storageKey?: string
  reactotron?: BasicReactotron
}

export const createNavX = (mainStack, options: any = {}) => {
  const [navStore, setNavStore] = useState<NavigationStore | undefined>(undefined)
  const storageKey: string = options.storageKey || NAVIGATION_STATE_STORAGE_KEY

  useEffect(() => {
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
      __DEV__ && options.reactotron && options.reactotron.error(e.message, null)
    }
  }, [])

  // if it's not set yet, just return nothing for now
  if (!navStore) return undefined

  // track nav changes & save to storage
  onSnapshot(navStore, snapshot => storage.save(storageKey, snapshot))

  // if Reactotron is available, set it up to track the navStore
  if (__DEV__ && options.reactotron) {
    options.reactotron.trackMstNode(navStore)
  }

  const NavXNavigator = createNavXNavigator(mainStack, options.navOptions)

  return (props: any) => {
    return (
      <Provider rootStore={props.rootStore}>
        <BackButtonHandler canExit={props.canExit}>
          <NavXNavigator navigationStore={navStore}>{props.screen}</NavXNavigator>
        </BackButtonHandler>
      </Provider>
    )
  }
}
