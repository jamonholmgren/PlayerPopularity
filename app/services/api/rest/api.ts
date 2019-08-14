import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { Player, Team, APIResult } from "./api.types"

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
  async get(): Promise<APIResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(``)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    const heightString = (h: number): string => {
      const feet = Math.floor(h / 12)
      const inches = h % 12
      return `${feet}-${inches}`
    }
    const transformPlayer = (p): Player => ({
      ...p,
      tid: `${p.tid}`,
      imageURL: p.imgURL.trim(),
      height: heightString(p.hgt),
      contract: { amount: parseInt(p.contract.amount, 10), exp: p.exp || 0 },
    })
    const hasName = (p: Player) => Boolean(p.name)
    const hasTeam = (p: Player) => parseInt(p.tid, 10) >= 0
    const transformTeam = (t): Team => ({
      ...t,
      tid: `${t.tid}`,
    })

    try {
      console.tron.log("API response", response.data)
      const { players, teams } = response.data
      const resultPlayers: Player[] = players
        .filter(hasName)
        .filter(hasTeam)
        .map(transformPlayer)
      const resultTeams: Team[] = teams.map(transformTeam)
      return { kind: "ok", players: resultPlayers, teams: resultTeams }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
