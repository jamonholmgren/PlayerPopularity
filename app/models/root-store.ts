import { Instance, SnapshotOut, types, getEnv } from "mobx-state-tree"
import { PlayerModel, PlayerSnapshot } from "./player"
import { TeamModel, TeamSnapshot } from "./team"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore", {
    players: types.array(PlayerModel),
    teams: types.array(TeamModel),
    status: types.optional(types.enumeration(["pending", "loading", "done", "error"]), "pending"),
  })
  .actions(self => ({
    setPlayers: (players: PlayerSnapshot[]) => {
      self.players.replace(players as any)
    },
    setTeams: (teams: TeamSnapshot[]) => {
      self.teams.replace(teams as any)
    },
    setDone: () => (self.status = "done"),
  }))
  .actions(self => ({
    getAll: () => {
      self.status = "loading"
      getEnv(self)
        .api.get()
        .then(({ players, teams }) => {
          if (players.length > 0) {
            self.setPlayers(players)
          } else {
            console.tron.log("No players!")
          }
          if (teams.length > 0) {
            self.setTeams(teams)
          } else {
            console.tron.log("No teams!")
          }
          self.setDone()
        }, 3000)
    },
  }))

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>

/**
 * The data of an RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>
