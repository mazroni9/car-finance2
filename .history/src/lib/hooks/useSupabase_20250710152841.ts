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
        // فحص أن result هو مصفوفة من النوع المطلوب
        if (Array.isArray(result)) {
          setData(result as T[])
        } else {
          setData([])
        }
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