import { createStackNavigator } from "react-navigation"
import { MainNavigator } from "./main-navigator"

export const RootNavigator = createStackNavigator(
  {
    exampleStack: { screen: MainNavigator },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
)
