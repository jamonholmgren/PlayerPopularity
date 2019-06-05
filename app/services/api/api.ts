import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { PlayerSnapshot } from "../../models"
import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of users.
   */
  async get(): Promise<Types.APIResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(``)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    const transformPlayer = (p): Types.Player => ({
      ...p,
      tid: `${p.tid}`,
      imageURL: p.imgURL.trim(),
      contract: { amount: parseInt(p.contract.amount, 10), exp: p.exp || 0 },
    })
    const hasName = p => Boolean(p.name)
    const transformTeam = (t): Types.Team => ({
      ...t,
      tid: `${t.tid}`,
    })

    try {
      console.tron.log("API response", response.data)
      const { players, teams } = response.data
      const resultPlayers: Types.Player[] = players.filter(hasName).map(transformPlayer)
      const resultTeams: Types.Team[] = teams.map(transformTeam)
      return { kind: "ok", players: resultPlayers, teams: resultTeams }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
