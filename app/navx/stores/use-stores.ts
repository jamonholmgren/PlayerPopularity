import React from "react"
import { MobXProviderContext } from "mobx-react"
import { RootStore } from "../../models/root-store"

// To access any store in React
export function useStores() {
  return React.useContext(MobXProviderContext)
}

export function useRootStore(): RootStore {
  return useStores().rootStore
}
