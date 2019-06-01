import { createStackNavigator } from "react-navigation"
import { WelcomeScreen, SecondExampleScreen } from "../screens"

export const MainNavigator = createStackNavigator(
  {
    firstExample: { screen: WelcomeScreen },
    secondExample: { screen: SecondExampleScreen },
  },
  {
    headerMode: "none",
  },
)
