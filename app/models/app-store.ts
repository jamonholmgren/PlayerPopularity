import { Instance, SnapshotOut, types, getEnv } from "mobx-state-tree"
import { PlayerModel, PlayerSnapshot } from "./player/player"
import { TeamModel, TeamSnapshot } from "./team/team"

/**
 * Main AppStore model.
 */
export const AppStoreModel = types
  .model("AppStore", {
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
 * The AppStore instance.
 */
export type AppStore = Instance<typeof AppStoreModel>

/**
 * The data of an AppStore.
 */
export type AppStoreSnapshot = SnapshotOut<typeof AppStoreModel>
