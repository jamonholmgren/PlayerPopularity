import * as React from "react"
import { inject, observer } from "mobx-react"
// @ts-ignore: until they update @type/react-navigation to include getNavigation.
// prettier-ignore
import { createStackNavigator, getNavigation, NavigationScreenProp, NavigationState } from "react-navigation"
import { NavigationStore } from "../stores/navigation-store"
import { load, save } from "../storage"

interface NavXNavigatorProps {
  navigationStore?: NavigationStore
  children?: any
}

export const createNavXNavigator = (mainStack, navOptions = {}) => {
  const NavXNavigatorComponent = (props: NavXNavigatorProps) => {
    let currentNavProp: NavigationScreenProp<NavigationState>

    const getCurrentNavigation = () => currentNavProp

    // grab our state & dispatch from our navigation store
    const { state, dispatch, actionSubscribers } = props.navigationStore

    // make a quick root navigator
    const RootNavigator = createStackNavigator(
      {
        rootStack: { screen: mainStack },
      },
      {
        headerMode: "none",
        navigationOptions: { gesturesEnabled: false },
        ...navOptions,
      },
    )

    // create a custom navigation implementation
    currentNavProp = getNavigation(
      RootNavigator.router,
      state,
      dispatch,
      actionSubscribers(),
      {},
      getCurrentNavigation,
    )

    // set persistance methods
    const persistenceKey = "navigationState"
    const persistNavigationState = async navState => {
      await save(persistenceKey, JSON.stringify(navState))
    }
    const loadNavigationState = async () => {
      const jsonString = await load(persistenceKey)
      return JSON.parse(jsonString)
    }

    // prettier-ignore
    const persist = __DEV__ ? undefined : { persistNavigationState, loadNavigationState }

    return <RootNavigator {...persist} navigation={currentNavProp} />
  }

  // Workaround for https://github.com/mobxjs/mobx-react/issues/690#issuecomment-508647033
  return inject("navigationStore")(observer(NavXNavigatorComponent))
}
