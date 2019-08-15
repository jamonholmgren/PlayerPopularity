import { Reactotron } from "../services/reactotron"
import { Api } from "../services/api"

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  reactotron: Reactotron // only available in dev
  api: Api // our API
}

/**
 * Setup the environment that all the models will be sharing.
 *
 * The environment includes other functions that will be picked from some
 * of the models that get created later. This is how we loosly couple things
 * like events between models.
 */
export async function createEnvironment() {
  const env = new Environment()

  // create each service
  env.reactotron = new Reactotron()
  env.api = new Api()

  // allow each service to setup
  await Promise.all([env.reactotron.setup(), env.api.setup()])

  return env
}
