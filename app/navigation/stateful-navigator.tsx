import * as React from "react"
import { inject, observer } from "mobx-react"
// @ts-ignore: until they update @type/react-navigation to include getNavigation
import { getNavigation, NavigationScreenProp, NavigationState } from "react-navigation"
import { RootNavigator } from "./root-navigator"
import { NavigationStore } from "./navigation-store"
import { load, save } from "../utils/storage"

interface StatefulNavigatorProps {
  navigationStore?: NavigationStore
}

class StatefulNavigatorComponent extends React.Component<StatefulNavigatorProps, {}> {
  currentNavProp: NavigationScreenProp<NavigationState>

  getCurrentNavigation = () => this.currentNavProp

  render() {
    // grab our state & dispatch from our navigation store
    const { state, dispatch, actionSubscribers } = this.props.navigationStore

    // create a custom navigation implementation
    this.currentNavProp = getNavigation(
      RootNavigator.router,
      state,
      dispatch,
      actionSubscribers(),
      {},
      this.getCurrentNavigation,
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

    return <RootNavigator {...persist} navigation={this.currentNavProp} />
  }
}

// Workaround for https://github.com/mobxjs/mobx-react/issues/690#issuecomment-508647033
export const StatefulNavigator = inject("navigationStore")(observer(StatefulNavigatorComponent))
