import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { NavigationStoreModel } from "../navigation/navigation-store"
import { PlayerModel, PlayerSnapshot } from "./player"

/**
 * An RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
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
      setTimeout(() => {
        self.setPlayers([
          {
            id: "123",
            name: "Jamon Holmgren",
            jerseyNumber: "51",
            image: "",
          },
        ])
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
