import { useEffect, useState } from 'react';
import { useUserRole } from '@/hooks/use-user-role';

const RoleDebug = () => {
  const { primaryRole, roles, permissions, isLoading, error, refetch } = useUserRole();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const debugEnabled = process.env.NODE_ENV === 'development' || 
      localStorage.getItem('debug_roles') === 'true';
    setShowDebug(debugEnabled);
  }, []);

  if (!showDebug) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-800">Role Debug Info</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      {isLoading ? (
        <p className="text-gray-600">Loading roles...</p>
      ) : error ? (
        <div className="text-red-600">
          <p>Error loading roles:</p>
          <p className="text-sm">{error.message}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="font-medium">Primary Role:</span> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              primaryRole === 'admin' ? 'bg-red-100 text-red-800' :
              primaryRole === 'moderator' ? 'bg-blue-100 text-blue-800' :
              primaryRole === 'mentor' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {primaryRole}
            </span>
          </div>
          
          <div>
            <span className="font-medium">Role IDs:</span> 
            <span className="ml-2 text-sm">{roles.join(', ') || 'None'}</span>
          </div>
          
          <div>
            <span className="font-medium">Permissions:</span>
            <div className="mt-1 max-h-32 overflow-y-auto text-sm">
              {permissions.length > 0 ? (
                permissions.map((perm, index) => (
                  <div key={index} className="py-1 border-b border-gray-100 last:border-0">
                    {perm}
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No permissions</span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => refetch()}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Refresh Roles
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleDebug;