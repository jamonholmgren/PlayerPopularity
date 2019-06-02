import * as React from "react"
import { View, ActivityIndicator, ViewStyle, TextStyle, SafeAreaView } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Text } from "../components/text"
import { Button } from "../components/button"
import { Screen } from "../components/screen"
import { Wallpaper } from "../components/wallpaper"
import { Header } from "../components/header"
import { color, spacing } from "../theme"
import { inject, observer } from "mobx-react"
import { RootStore } from "../models"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[6],
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

const LOADING_STYLE: ViewStyle = {
  paddingVertical: spacing[8],
  paddingHorizontal: spacing[8],
}

export interface WelcomeScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore
}

@inject("rootStore")
@observer
export class WelcomeScreen extends React.Component<WelcomeScreenProps, {}> {
  nextScreen = () => this.props.navigation.navigate("secondExample")

  componentWillMount() {
    const { rootStore } = this.props
    rootStore && rootStore.getAll()
    console.tron.repl("rootStore", rootStore)
  }

  render() {
    return (
      <View testID="WelcomeScreen" style={FULL}>
        <Wallpaper />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
          <Text style={TITLE} preset="header" tx="welcomeScreen.title" />
          <Text style={CONTENT}>
            This app lets you rank your favorite (and least favorite) players in the NBA!
          </Text>
          {this.props.rootStore.status === "loading" && (
            <ActivityIndicator style={LOADING_STYLE} size="large" />
          )}
          {this.props.rootStore.status === "done" && (
            <Text style={CONTENT}>
              Loaded {this.props.rootStore.players.length} players from the API! Tap "Continue" to
              start rating players.
            </Text>
          )}
        </Screen>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              testID="next-screen-button"
              style={CONTINUE}
              textStyle={CONTINUE_TEXT}
              tx="welcomeScreen.continue"
              onPress={this.nextScreen}
              disabled={this.props.rootStore.status !== "done"}
            />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}