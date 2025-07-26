// src/lib/services/queries.ts

import supabase from './supabase';

// 🧠 دالة عامة لاستعلام الجداول
export async function queryTable<T>(
  tableName: string,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  } = {}
): Promise<T[]> {
  let query = supabase.from(tableName).select(options.columns || '*');

  if (options.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      query = query.eq(key, value);
    }
  }

  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true
    });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as T[];
}
