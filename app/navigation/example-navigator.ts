import { createStackNavigator } from "react-navigation"
import { WelcomeScreen } from "../screens/welcome-screen"
import { SecondExampleScreen } from "../screens/second-example-screen"

export const ExampleNavigator = createStackNavigator(
  {
    firstExample: { screen: WelcomeScreen },
    secondExample: { screen: SecondExampleScreen },
  },
  {
    headerMode: "none",
  },
)
