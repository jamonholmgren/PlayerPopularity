import { createStackNavigator } from "react-navigation"
import { MainNavigator } from "./main-navigator"

export const RootNavigator = createStackNavigator(
  {
    exampleStack: { screen: MainNavigator },
  },
  {
    headerMode: "true",
    navigationOptions: { gesturesEnabled: false },
  },
)
