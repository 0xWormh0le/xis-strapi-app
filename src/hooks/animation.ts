import { useSpring } from 'react-spring'

export function useFadeUp() {
  return useSpring({
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    from: { opacity: 0, transform: 'translate3d(0,30px,0)' }
  })
}

export function useFadeIn() {
  return useSpring({ opacity: 1, from: { opacity: 0 } })
}
