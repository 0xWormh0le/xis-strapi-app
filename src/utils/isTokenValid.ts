import jwtDecode from 'jwt-decode'

/**
 * Checks if a token has not expired
 * @param token
 */
export function isTokenValid(token: string | null) {
  if (!token) {
    return false
  }
  try {
    const decodedJwt: any = jwtDecode(token)
    return decodedJwt.exp >= Date.now() / 1000
  } catch (e) {
    return false
  }
}
