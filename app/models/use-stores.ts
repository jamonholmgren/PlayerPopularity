import React from "react"
import { MobXProviderContext } from "mobx-react"

export function useStores() {
  return React.useContext(MobXProviderContext)
}

export function useRootStore() {
  return useStores().rootStore
}
