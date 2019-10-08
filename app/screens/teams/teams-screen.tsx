import * as React from "react"
import { FlatList } from "react-native"
import { TeamRow } from "./team-row"
import { useStore, observer } from "react-navx"
import { AppStore } from "../../models/app-store"

function PlayersScreenComponent(props) {
  const { teams } = useStore("AppStore") as AppStore

  return (
    <FlatList
      data={teams}
      keyExtractor={t => t.name}
      renderItem={({ item }) => <TeamRow imgURL={item.imgURL} name={item.name} />}
    />
  )
}

// Workaround for https://github.com/mobxjs/mobx-react/issues/690#issuecomment-508647033
export const PlayersScreen = observer(PlayersScreenComponent)
