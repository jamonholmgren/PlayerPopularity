import { types } from "mobx-state-tree"

export const PlayerModel = types.model().props({
  id: types.identifier,
  name: types.maybe(types.string),
  jerseyNumber: types.maybe(types.string),
  image: types.maybe(types.string),
})

export type Player = typeof PlayerModel.Type
export type PlayerSnapshot = typeof PlayerModel.SnapshotType
