import { useState, useEffect, useRef, useCallback, RefObject } from 'react'
import AbortController from 'abort-controller'
import Meme from '../models/Meme'
import { getMemes } from '../api'
import { wait } from '@shared/utils'
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
}

export function useInfinityMemes({ debounceTime = 800, threshold = 450 } = {}): InfinityMemesInt {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [memes, setMemes] = useState<Array<Meme>>([])
  const [query, setQuery] = useState<string>('')
  const [searchValue] = useDebounce(query, debounceTime)

  const [hasMore, setHasMore] = useState<boolean>(false)
  const currentPage = useRef(1)
  const ref: RefObject<HTMLElement> = useRef(null)

  useEffect(() => {
    setMemes([])
    setIsLoading(true)
  }, [query])

  const fetchMemes = useCallback(async (params = {}, controller?: AbortController) => {
    try {
      setIsLoading(true)
      const page = params.page || currentPage.current
      await wait(200)
      const response = await getMemes(
        {
          page,
          search: params.searchValue || '',
          lang: params.lang || 'en'
        },
        {
          ...(controller ? { signal: controller.signal } : null)
        }
      )
      currentPage.current = page + 1
      setHasMore(currentPage.current <= response.pages)
      setMemes(previousMemes => [...previousMemes, ...response.memes])
    } catch (error) {
      if (error.name !== 'AbortError') {
        setIsError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleScroll = useCallback(async () => {
    if (ref.current) {
      const isAtBottom = ref.current.offsetHeight + ref.current.scrollTop >= ref.current.scrollHeight - threshold
      if (isAtBottom && !isLoading && hasMore) {
        try {
          setIsLoading(true)
          await fetchMemes({
            page: currentPage.current,
            searchValue,
            lang: i18n.language
          })
        } catch (error) {
          console.warn(error)
        } finally {
          setIsLoading(false)
        }
      }
    }
  }, [fetchMemes, isLoading, threshold, hasMore, searchValue, i18n.language])

  useEffect(() => {
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

  return { query, setQuery, memes, hasMore, isLoading, isError, handleScroll, ref }
}
