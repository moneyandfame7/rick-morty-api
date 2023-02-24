export interface AuthorizationConfig {
  getJwtAccessSecret: () => string
  getJwtRefreshSecret: () => string
  getJwtAccessCookie: () => string
  getJwtRefreshCookie: () => string

  getGoogleClientId: () => string
  getGoogleClientSecret: () => string
  getGoogleCallbackUrl: () => string

  getGithubClientId: () => string
  getGithubClientSecret: () => string
  getGithubCallbackUrl: () => string

  getDiscordClientId: () => string
  getDiscordClientSecret: () => string
  getDiscordCallbackUrl: () => string

  getSpotifyClientId: () => string
  getSpotifyClientSecret: () => string
  getSpotifyCallbackUrl: () => string
}
