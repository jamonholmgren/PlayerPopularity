import { types } from "mobx-state-tree"
import { PlayerModel } from "."

export const TeamModel = types.model({
  id: types.identifier,
  city: types.string,
  name: types.string,
  image: types.maybe(types.string),
  players: types.maybe(types.array(PlayerModel)),
})

export type Team = typeof TeamModel.Type

export type TeamSnapshot = typeof TeamModel.SnapshotType
