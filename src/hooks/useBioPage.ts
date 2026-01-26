import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getBioPages,
  createBioPage,
  getPageItems,
  updateBioLink,
  updateBioCard,
  deleteBioLink,
  deleteBioCard,
  reorderPageItems,
  publishBioPage,
  unpublishBioPage,
} from '@/lib/bio'
import type { BioPage, PageItem, BioLink, BioCard, ReorderItem } from '@/types/bio'

interface UseBioPageReturn {
  bioPage: BioPage | null
  items: PageItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  toggleLinkActive: (linkId: string, active: boolean) => Promise<void>
  toggleCardActive: (cardId: string, active: boolean) => Promise<void>
  removeLink: (linkId: string) => Promise<void>
  removeCard: (cardId: string) => Promise<void>
  reorderItems: (oldIndex: number, newIndex: number) => Promise<void>
  addItem: (item: PageItem) => void
  updateItem: (item: PageItem) => void
  togglePublish: () => Promise<void>
}

export function useBioPage(): UseBioPageReturn {
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [bioPage, setBioPage] = useState<BioPage | null>(null)
  const [items, setItems] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || authLoading) return

    setLoading(true)
    setError(null)

    try {
      const pages = await getBioPages()
      let page = pages[0]  // User can only have one

      // Auto-create bio page if none exists
      if (!page) {
        page = await createBioPage()
      }

      setBioPage(page)

      const pageItems = await getPageItems(page.id)
      setItems(pageItems.sort((a, b) => a.position - b.position))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, authLoading])

  useEffect(() => {
    if (!authLoading) {
      fetchData()
    }
  }, [authLoading, fetchData])

  const toggleLinkActive = useCallback(
    async (linkId: string, active: boolean) => {
      if (!bioPage) return
      try {
        await updateBioLink(bioPage.id, linkId, { is_active: active })
        setItems((prev) =>
          prev.map((item) =>
            item.type === 'link' && item.item_id === linkId
              ? { ...item, data: { ...item.data, is_active: active } as BioLink }
              : item
          )
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update link')
        throw err
      }
    },
    [bioPage]
  )

  const toggleCardActive = useCallback(
    async (cardId: string, active: boolean) => {
      if (!bioPage) return
      try {
        await updateBioCard(bioPage.id, cardId, { is_active: active })
        setItems((prev) =>
          prev.map((item) =>
            item.type === 'card' && item.item_id === cardId
              ? { ...item, data: { ...item.data, is_active: active } as BioCard }
              : item
          )
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update card')
        throw err
      }
    },
    [bioPage]
  )

  const removeLink = useCallback(
    async (linkId: string) => {
      if (!bioPage) return
      try {
        await deleteBioLink(bioPage.id, linkId)
        setItems((prev) =>
          prev.filter((item) => !(item.type === 'link' && item.item_id === linkId))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete link')
        throw err
      }
    },
    [bioPage]
  )

  const removeCard = useCallback(
    async (cardId: string) => {
      if (!bioPage) return
      try {
        await deleteBioCard(bioPage.id, cardId)
        setItems((prev) =>
          prev.filter((item) => !(item.type === 'card' && item.item_id === cardId))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete card')
        throw err
      }
    },
    [bioPage]
  )

  const reorderItems = useCallback(
    async (oldIndex: number, newIndex: number) => {
      if (!bioPage || oldIndex === newIndex) return

      // Optimistic update
      const newItems = [...items]
      const [removed] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, removed)

      // Update positions
      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        position: index,
      }))
      setItems(reorderedItems)

      // Persist to server
      try {
        const reorderData: ReorderItem[] = reorderedItems.map((item) => ({
          type: item.type,
          item_id: item.item_id,
          position: item.position,
        }))
        await reorderPageItems(bioPage.id, reorderData)
      } catch (err) {
        // Revert on error
        setError(err instanceof Error ? err.message : 'Failed to reorder items')
        fetchData()
        throw err
      }
    },
    [bioPage, items, fetchData]
  )

  const addItem = useCallback((item: PageItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const updateItem = useCallback((item: PageItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.type === item.type && i.item_id === item.item_id ? item : i
      )
    )
  }, [])

  const togglePublish = useCallback(async () => {
    if (!bioPage) return
    try {
      const updated = bioPage.is_published
        ? await unpublishBioPage(bioPage.id)
        : await publishBioPage(bioPage.id)
      setBioPage(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update publish status')
      throw err
    }
  }, [bioPage])

  return {
    bioPage,
    items,
    loading,
    error,
    refresh: fetchData,
    toggleLinkActive,
    toggleCardActive,
    removeLink,
    removeCard,
    reorderItems,
    addItem,
    updateItem,
    togglePublish,
  }
}
