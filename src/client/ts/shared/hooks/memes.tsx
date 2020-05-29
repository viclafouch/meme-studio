import { useState, useEffect, useRef, useCallback, RefObject } from 'react'
import AbortController from 'abort-controller'
import Meme from '../models/Meme'
import { getMemes } from '../api'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

interface InfinityMemesInt {
  query: string
  setQuery: (value: string) => void
  isError: boolean
  isLoading: boolean
  memes: Array<Meme>
  hasMore: boolean
  handleScroll: () => Promise<void>
  ref: RefObject<any>
  retry: () => void
}

interface Params {
  page: number
  searchValue: string
  lang: string
}

export function useInfinityMemes({ debounceTime = 800, threshold = 450, isWindow = false } = {}): InfinityMemesInt {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [memes, setMemes] = useState<Array<Meme>>([])
  const [query, setQuery] = useState<string>('')
  const [searchValue] = useDebounce(query, debounceTime)

  const [hasMore, setHasMore] = useState<boolean>(false)
  const currentParams = useRef<Params>({
    page: 1,
    searchValue: '',
    lang: i18n.language
  })
  const unmounted = useRef(false)
  const ref: RefObject<HTMLElement | Window> = useRef(isWindow ? window : null)

  const fetchMemes = useCallback(async (params = {}, controller?: AbortController) => {
    try {
      if (controller && controller.signal.aborted) return
      setIsLoading(true)
      setIsError(false)
      const page = params.page || currentParams.current.page

      const response = await getMemes(
        {
          page,
          search: params.searchValue,
          lang: params.lang || 'en'
        },
        {
          ...(controller ? { signal: controller.signal } : null)
        }
      )
      const newParams = {
        page: page + 1,
        lang: params.lang,
        searchValue: params.searchValue
      }
      setHasMore(newParams.page <= response.pages)
      currentParams.current = newParams
      setMemes(previousMemes => [...previousMemes, ...response.memes])
    } catch (error) {
      if (error.name !== 'AbortError' && !unmounted.current) {
        setIsError(true)
        console.warn(error)
      }
    } finally {
      if (!unmounted.current) {
        setIsLoading(false)
      }
    }
  }, [])

  const handleScroll = useCallback(async () => {
    if (ref.current) {
      let isAtBottom: boolean

      if (ref.current instanceof Window) {
        isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold
      } else {
        isAtBottom = ref.current.offsetHeight + ref.current.scrollTop >= ref.current.scrollHeight - threshold
      }

      if (isAtBottom && !isLoading && hasMore && !isError) {
        await fetchMemes(currentParams.current)
      }
    }
  }, [fetchMemes, isLoading, threshold, hasMore, isError])

  useEffect(() => {
    setMemes([])
    const controller = new AbortController()
    fetchMemes(
      {
        searchValue,
        page: 1,
        lang: i18n.language
      },
      controller
    )
    return () => {
      controller.abort()
    }
  }, [searchValue, fetchMemes, i18n.language])

  useEffect(() => {
    if (memes.length > 0 && hasMore) {
      if (ref.current instanceof Window) {
        if (window.innerHeight === document.body.offsetHeight) {
          fetchMemes({
            ...currentParams.current,
            page: currentParams.current.page
          })
        }
      } else {
        const parentHeight = ref.current.parentElement.offsetHeight
        const childsHeight = Array.from(ref.current.parentNode.children).reduce(
          (previousValue, currentValue: HTMLElement) => previousValue + currentValue.offsetHeight,
          0
        )

        if (childsHeight < parentHeight) {
          fetchMemes({
            ...currentParams.current,
            page: currentParams.current.page
          })
        }
      }
    }
  }, [memes.length, fetchMemes, hasMore])

  useEffect(() => {
    return () => {
      unmounted.current = true
    }
  }, [])

  const retry = useCallback(() => {
    fetchMemes(currentParams.current)
  }, [fetchMemes])

  useEffect(() => {
    if (ref.current instanceof Window) {
      window.addEventListener('scroll', handleScroll, false)
      return (): void => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return { query, setQuery, memes, hasMore, isLoading, isError, handleScroll, ref, retry }
}
