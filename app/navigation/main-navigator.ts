import { createStackNavigator } from "react-navigation"
import { WelcomeScreen, PlayersScreen } from "../screens"

export const MainNavigator = createStackNavigator(
  {
    firstExample: { screen: WelcomeScreen },
    secondExample: { screen: PlayersScreen },
  },
  {
    headerMode: "none",
  },
)
