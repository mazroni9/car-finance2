import { supabase } from '../../../../lib/services/supabase'

export default async function FinanceModelsPage() {
  const { data: models, error } = await supabase
    .from('finance_models')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching finance models:', error)
    return <div>Error loading finance models</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Finance Models</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {models?.map((model) => (
              <tr key={model.id}>
                <td className="border px-4 py-2">{model.id}</td>
                <td className="border px-4 py-2">{model.name}</td>
                <td className="border px-4 py-2">
                  {new Date(model.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
