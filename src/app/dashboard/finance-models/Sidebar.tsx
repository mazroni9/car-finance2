import Link from 'next/link'

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/admin/dashboard/finance-models" className="text-blue-600 hover:text-blue-800">
              Finance Models
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/admin/dashboard/finance-reports" className="text-blue-600 hover:text-blue-800">
              Reports
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
