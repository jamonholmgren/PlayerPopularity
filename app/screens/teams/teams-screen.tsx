import * as React from "react"
import { FlatList } from "react-native"
import { TeamRow } from "./team-row"
import { observer } from "mobx-react"
import { useRootStore } from "../../navx"

export function PlayersScreenComponent(props) {
  const { teams } = useRootStore()

  return (
    <FlatList
      data={teams}
      keyExtractor={t => t.id}
      renderItem={({ item }) => <TeamRow imgURL={item.imgURL} name={item.name} />}
    />
  )
}

// Workaround for https://github.com/mobxjs/mobx-react/issues/690#issuecomment-508647033
export const PlayersScreen = observer(PlayersScreenComponent)
