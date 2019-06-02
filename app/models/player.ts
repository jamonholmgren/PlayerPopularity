import { types } from "mobx-state-tree"

export const PlayerRatingModel = types.model({
  hgt: types.number,
  stre: types.number,
  spd: types.number,
  jmp: types.number,
  endu: types.number,
  ins: types.number,
  dnk: types.number,
  ft: types.number,
  fg: types.number,
  tp: types.number,
  diq: types.number,
  oiq: types.number,
  drb: types.number,
  pss: types.number,
  reb: types.number,
})

export const PlayerModel = types.model({
  tid: types.identifier,
  name: types.string,
  ratings: types.array(PlayerRatingModel),
  pos: types.string,
  hgt: types.number,
  weight: types.number,
  born: types.model({ year: types.number, loc: types.string }),
  imgURL: types.string,
  contract: types.model({ amount: types.number, exp: types.number }),
  draft: types.model({
    round: types.number,
    pick: types.number,
    tid: types.number,
    originalTid: types.maybe(types.number),
    year: types.number,
  }),
  college: types.string,
  awards: types.array(
    types.model({
      season: types.number,
      type: types.string,
    }),
  ),
  injury: types.maybe(types.model({ type: types.string, gamesRemaining: types.number })),
})

export type Player = typeof PlayerModel.Type
export type PlayerSnapshot = typeof PlayerModel.SnapshotType
