const fs = require('fs');
const path = require('path');

const updateFiles = [
  'src/app/admin/dashboard/financial_entries/page.tsx',
  'src/app/admin/dashboard/financial_statements/page.tsx',
  'src/app/admin/dashboard/installment_plans/page.tsx',
  'src/app/admin/dashboard/installment_rules/page.tsx',
  'src/app/admin/dashboard/repayment_schedules/page.tsx',
  'src/app/admin/dashboard/settings/page.tsx',
  'src/app/admin/dashboard/simulation_runs/page.tsx',
  'src/app/admin/dashboard/transactions/page.tsx',
  'src/app/admin/dashboard/users/page.tsx',
  'src/app/admin/dashboard/wallets/page.tsx'
];

const template = `import { supabase } from '@/lib/services/supabase'

export default async function PAGE_NAME() {
  const { data, error } = await supabase
    .from('TABLE_NAME')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching data:', error)
    return <div>Error loading data</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">TABLE_NAME</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}`

updateFiles.forEach(filePath => {
  const pageName = path.basename(path.dirname(filePath))
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Page'
  
  const tableName = path.basename(path.dirname(filePath))
  
  const content = template
    .replace('PAGE_NAME', pageName)
    .replace(/TABLE_NAME/g, tableName)
  
  fs.writeFileSync(filePath, content)
}); 