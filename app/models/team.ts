import { types } from "mobx-state-tree"

export const TeamModel = types.model({
  tid: types.identifier,
  cid: types.number,
  did: types.number,
  region: types.string,
  name: types.string,
  abbrev: types.string,
  pop: types.number,
  strategy: types.enumeration("strategy", ["rebuilding", "contending", "Jordancrying", "lol"]),
  stadiumCapacity: types.number,
  imgURL: types.string,
})

export type Team = typeof TeamModel.Type

export type TeamSnapshot = typeof TeamModel.SnapshotType
