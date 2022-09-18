import { IS_PROD } from '../constants'

export function logger(message?: any, ...optionalParams: any[]): void {
  if (!IS_PROD) {
    console.log(message, ...optionalParams)
  }
}
