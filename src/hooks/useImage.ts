import { useEffect, useState } from 'react'

export const useHasImageLoaded = ({ src, onLoad, onError }: any) => {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const image = new window.Image()
    image.src = src

    image.onload = (event) => {
      setHasLoaded(true)
      onLoad && onLoad(event)
    }

    image.onerror = (event) => {
      setHasLoaded(false)
      onError && onError(event)
    }
  }, [src, onLoad, onError])

  return hasLoaded
}
