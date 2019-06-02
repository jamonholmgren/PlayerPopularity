import { GeneralApiProblem } from "./api-problem"

type PlayerRatings = {
  hgt: number
  stre: number
  spd: number
  jmp: number
  endu: number
  ins: number
  dnk: number
  ft: number
  fg: number
  tp: number
  diq: number
  oiq: number
  drb: number
  pss: number
  reb: number
}

export interface Player {
  tid: number
  name: string
  ratings: PlayerRatings[]
  pos: string
  hgt: number
  weight: number
  born: { year: number; loc: string }
  imgURL: string
  contract: { amount: string; exp: number }
  draft: { round: number; pick: number; tid: number; originalTid: number; year: number }
  college: string
  awards: Award[]
  injury: { type: string; gamesRemaining: number }
}

type Award = {
  season: number
  type: string
}

export type GetPlayersResult = { kind: "ok"; players: Player[] } | GeneralApiProblem
