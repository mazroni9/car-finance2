'use client';

export default function ManualRegistrationDetails() {
  const componentDetails = {
    path: '/src/components/admin/manual-registration.tsx',
    states: [
      { name: 'showrooms', type: 'any[]', description: 'قائمة المعارض المتاحة' },
      { name: 'showroomId', type: 'string', description: 'معرف المعرض المحدد' },
      { name: 'type', type: 'string', defaultValue: 'registration' },
      { name: 'amount', type: 'number', defaultValue: '117' },
      { name: 'description', type: 'string' }
    ],
    functions: [
      { 
        name: 'fetchShowrooms', 
        type: 'async', 
        description: 'جلب قائمة المعارض من قاعدة البيانات',
        query: "select('id', 'name').order('name')"
      },
      {
        name: 'handleSubmit',
        type: 'async',
        description: 'معالجة تسجيل المعاملة',
        table: 'showroom_transactions'
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">🔍 Manual Registration Component</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-400">File Path</h2>
        <code className="bg-gray-900 p-2 rounded block text-green-400">
          {componentDetails.path}
        </code>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">States</h2>
        <div className="grid gap-4">
          {componentDetails.states.map((state, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-400 font-mono">{state.name}</span>
                <span className="text-blue-400 font-mono">{state.type}</span>
              </div>
              {state.description && (
                <p className="text-gray-400 text-sm">{state.description}</p>
              )}
              {state.defaultValue && (
                <p className="text-gray-500 text-sm mt-1">
                  Default: <code className="text-green-400">{state.defaultValue}</code>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Functions</h2>
        <div className="grid gap-4">
          {componentDetails.functions.map((func, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 font-mono">{func.name}</span>
                <span className="text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded">
                  {func.type}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{func.description}</p>
              {func.query && (
                <div className="mt-2">
                  <p className="text-gray-500 text-sm">Query:</p>
                  <code className="text-green-400 text-sm block mt-1">{func.query}</code>
                </div>
              )}
              {func.table && (
                <div className="mt-2">
                  <p className="text-gray-500 text-sm">Table:</p>
                  <code className="text-green-400 text-sm block mt-1">{func.table}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 