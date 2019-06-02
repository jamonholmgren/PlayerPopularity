import { Instance, SnapshotOut, types, getEnv } from "mobx-state-tree"
import { NavigationStoreModel } from "../navigation/navigation-store"
import { PlayerModel, PlayerSnapshot } from "./player"

const transformPlayer = p => ({
  ...p,
  tid: `${p.tid}`,
  contract: { amount: parseInt(p.contract.amount, 10), exp: p.exp || 0 },
})

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore", {
    navigationStore: types.optional(NavigationStoreModel, {}),
    players: types.optional(types.array(PlayerModel), []),
    status: types.optional(types.enumeration(["pending", "loading", "done", "error"]), "pending"),
  })
  .actions(self => ({
    setPlayers: (players: PlayerSnapshot[]) => {
      console.tron.log(`Found ${[players.length]} players!`)
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
            self.setPlayers(players.filter(p => Boolean(p.name)).map(transformPlayer))
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
