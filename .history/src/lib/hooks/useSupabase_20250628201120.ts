import { useEffect, useState } from 'react'
import supabase from '@/lib/services/supabase'

export function useSupabaseQuery<T>(
  table: string,
  query: string = '*'
) {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result, error: queryError } = await supabase
          .from(table)
          .select(query)

        if (queryError) throw queryError
        setData(result || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        console.error(`Error fetching ${table}:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table, query])

  return { data, error, loading }
}

export default supabase 