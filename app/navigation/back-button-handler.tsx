import * as React from "react"
import { BackHandler } from "react-native"
import { inject, observer } from "mobx-react"
import { NavigationActions } from "react-navigation"
import { NavigationStore } from "../navigation/navigation-store"

interface BackButtonHandlerProps {
  navigationStore?: NavigationStore
  /**
   * Are we allowed to exit?
   */
  canExit(routeName: string): Boolean
}

class BackButtonHandlerComponent extends React.Component<BackButtonHandlerProps, {}> {
  /**
   * Subscribe when we come to life.
   */
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
  }

  /**
   * Unsubscribe when we're done.
   */
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }

  /**
   * Fires when the back button is pressed on android.
   */
  onBackPress = () => {
    // grab the current route
    const routeName = this.props.navigationStore.findCurrentRoute().routeName

    // are we allowed to exit?
    if (this.props.canExit(routeName)) {
      // let the system know we've not handled this event
      return false
    } else {
      // we can't exit, so let's turn this into a back action
      this.props.navigationStore.dispatch(NavigationActions.back())
      // let the system know we've handled this event
      return true
    }
  }

  /**
   * Renders the children or nothing if they weren't passed.
   */
  render() {
    return this.props.children
  }
}

// Workaround for https://github.com/mobxjs/mobx-react/issues/690#issuecomment-508647033
export const BackButtonHandler = inject("navigationStore")(observer(BackButtonHandlerComponent))
