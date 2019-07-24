import * as React from "react"
import {
  FlatList,
  TextStyle,
  View,
  ViewStyle,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Screen } from "../components/screen"
import { Text } from "../components/text"
import { Wallpaper } from "../components/wallpaper"
import { Header } from "../components/header"
import { color, spacing } from "../theme"
import { inject, observer } from "mobx-react"
import { RootStore } from "../models"
import { Button } from "../components/button/button"
import { Player } from "../models/player"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE: TextStyle = {
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}
const PLAYER: ViewStyle = {
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 16,
  paddingRight: 16,
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
}
const PLAYER_INFO: ViewStyle = {
  flex: 1,
  flexDirection: "column",
}
const PLAYER_NAME: TextStyle = {
  fontSize: 20,
  flex: 1,
}
const PLAYER_BIO: TextStyle = {
  fontSize: 14,
  flex: 1,
}
const AVATAR = {
  width: 40,
  height: 40,
}
const AVATAR_PIC = {
  ...AVATAR,
  marginRight: 16,
}
const RATING_VIEW: TextStyle = {
  height: 40,
  fontSize: 30,
}

export interface PlayersScreenProps extends NavigationScreenProps<{}> {
  rootStore: RootStore
}

const RatingView = () => {
  return <Text style={RATING_VIEW}>⭐️️ ⭐️ ⭐️ ⭐️ ⭐️</Text>
}

type PlayersScreenState = { currentPlayer: Player | void }

class PlayersScreenComponent extends React.Component<PlayersScreenProps, {}> {
  state: PlayersScreenState = {
    currentPlayer: undefined,
  }

  goBack = () => this.props.navigation.goBack(null)

  openPlayerRating = (currentPlayer: Player) => {
    console.tron.log("openPlayerRating", currentPlayer)
    this.setState({ currentPlayer })
  }
  setPlayerRating = (currentPlayer: Player | void) => {
    console.tron.log("setPlayerRating", currentPlayer)
    this.setState({ currentPlayer })
  }

  render() {
    const { players } = this.props.rootStore
    return (
      <View testID="PlayersScreen" style={FULL}>
        <Wallpaper />
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
          <Header
            headerTx="secondExampleScreen.howTo"
            leftIcon="back"
            onLeftPress={this.goBack}
            style={HEADER}
            titleStyle={HEADER_TITLE}
          />
          <Text style={TITLE} preset="header" tx="secondExampleScreen.title" />
          <FlatList
            data={players}
            extraData={this.state}
            renderItem={({ item }) => {
              const p = item as Player
              return (
                <Button
                  preset={"link"}
                  style={PLAYER}
                  onPress={() => {
                    this.setState({ currentPlayer: p })
                  }}
                >
                  <Image source={{ uri: p.imgURL }} style={AVATAR_PIC} />
                  <View style={PLAYER_INFO}>
                    {p !== this.state.currentPlayer ? (
                      <>
                        <Text text={p.name} style={PLAYER_NAME} />
                        <Text
                          text={`${p.pos} • ${p.height} • ${p.weight}lbs • ${p.tid.name}`}
                          style={PLAYER_BIO}
                        />
                      </>
                    ) : (
                      <RatingView />
                    )}
                  </View>
                </Button>
              )
            }}
            keyExtractor={p => p.imgURL}
          />
        </Screen>
      </View>
    )
  }
}

// Workaround for https://github.com/mobxjs/mobx-react/issues/690#issuecomment-508647033
export const PlayersScreen = inject("rootStore")(observer(PlayersScreenComponent))
