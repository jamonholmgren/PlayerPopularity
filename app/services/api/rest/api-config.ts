import { API_URL } from "react-native-dotenv"

if (!API_URL) throw new Error("No API_URL set -- check your .env file?")

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
  url: API_URL,
  timeout: 10000,
}
