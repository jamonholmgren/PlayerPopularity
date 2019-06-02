import { API_URL } from "react-native-dotenv"

/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url:
    API_URL ||
    "https://raw.githubusercontent.com/alexnoob/BasketBall-GM-Rosters/master/2018-19.NBA.Roster.json",
  timeout: 10000,
}