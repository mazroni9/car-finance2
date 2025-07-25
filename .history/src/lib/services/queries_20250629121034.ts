// src/lib/services/queries.ts

import { supabase } from './supabase'
import type { Database } from '@/types/supabase'

type TableName = keyof Database['public']['Tables']
type Row<T extends TableName> = Database['public']['Tables'][T]['Row']

interface QueryOptions {
  orderBy?: {
    column: string
    ascending?: boolean
  }
  limit?: number
  offset?: number
  filters?: Record<string, unknown>
}

export async function queryTable<T extends TableName>(
  tableName: T,
  options: QueryOptions = {}
): Promise<Row<T>[]> {
  let query = supabase.from(tableName).select('*')

  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }

  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true
    })
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error querying ${tableName}: ${error.message}`)
  }

  return data as Row<T>[]
}
