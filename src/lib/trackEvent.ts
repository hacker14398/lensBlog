import { IS_PRODUCTION } from 'src/constants'

export const trackEvent = (event: string, type: string | null = 'click') => {
  if (!event) return
  if (!IS_PRODUCTION) return

  // @ts-ignore
  return window?.umami?.trackEvent(event, type)
}