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
  retry: () => void
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

  const fetchMemes = useCallback(async (params = {}, controller?: AbortController) => {
    try {
      setIsLoading(true)
      setIsError(false)
      const page = params.page || currentPage.current
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
        console.warn(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleScroll = useCallback(async () => {
    if (ref.current) {
      const isAtBottom = ref.current.offsetHeight + ref.current.scrollTop >= ref.current.scrollHeight - threshold
      if (isAtBottom && !isLoading && hasMore && !isError) {
        await fetchMemes({
          page: currentPage.current,
          searchValue,
          lang: i18n.language
        })
      }
    }
  }, [fetchMemes, isLoading, threshold, hasMore, searchValue, i18n.language, isError])

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

  const retry = useCallback(() => {
    fetchMemes({
      searchValue,
      page: currentPage.current,
      lang: i18n.language
    })
  }, [searchValue, i18n.language, fetchMemes])

  return { query, setQuery, memes, hasMore, isLoading, isError, handleScroll, ref, retry }
}
