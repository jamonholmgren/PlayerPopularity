import { Instance, SnapshotOut, types, getEnv } from "mobx-state-tree"
import { NavigationStoreModel } from "../navigation/navigation-store"
import { PlayerModel, PlayerSnapshot } from "./player"
import { Api } from "../services/api"

/**
 * An RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore", {
    navigationStore: types.optional(NavigationStoreModel, {}),
    players: types.optional(types.array(PlayerModel), []),
    status: types.optional(types.enumeration(["pending", "loading", "done", "error"]), "pending"),
  })
  .actions(self => ({
    setPlayers: (players: PlayerSnapshot[]) => {
      self.status = "done"
      self.players.replace(players)
    },
  }))
  .actions(self => ({
    getAll: () => {
      self.status = "loading"
      getEnv(self)
        .api.getPlayers()
        .then(({ players }) => {
          if (players.length > 0) {
            console.tron.log(`Found ${[players.length]} players!`)

            self.setPlayers(players)
          } else {
            console.tron.log("No players!")
          }
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
