// Production Debug Script for CareerCompass Admin Dashboard Issue
// Run this in the browser console on your production site after logging in

console.log('🔍 Starting CareerCompass Production Debug...');

// Enable role debugging in localStorage
localStorage.setItem('debug_roles', 'true');
console.log('✅ Role debugging enabled');

// Check current user authentication
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await response.json();
    console.log('👤 Current user:', data);
    return data;
  } catch (error) {
    console.error('❌ Auth check failed:', error);
    return null;
  }
}

// Check user roles
async function checkRoles() {
  try {
    const response = await fetch('/api/rbac/my-info', { credentials: 'include' });
    const data = await response.json();
    console.log('🎭 User roles data:', data);
    
    // Determine primary role
    const roleIds = data.roles || [];
    let primaryRole = 'student';
    
    if (roleIds.includes(1)) primaryRole = 'admin';
    else if (roleIds.includes(2)) primaryRole = 'moderator';
    else if (roleIds.includes(3)) primaryRole = 'mentor';
    
    console.log('👑 Primary role should be:', primaryRole);
    
    return data;
  } catch (error) {
    console.error('❌ Role check failed:', error);
    return null;
  }
}

// Check local storage and session storage
function checkStorage() {
  console.log('💾 LocalStorage keys:', Object.keys(localStorage));
  console.log('🔑 Access token exists:', !!localStorage.getItem('access_token'));
  console.log('🔄 Refresh token exists:', !!localStorage.getItem('refresh_token'));
  
  // Check React Query cache
  const queryCache = window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__?.queryClient?.getQueryCache?.();
  if (queryCache) {
    console.log('🗄️ React Query cache queries:', queryCache.getAll().map(q => q.queryKey));
  }
}

// Main debug function
async function debugProduction() {
  console.log('🚀 Starting production debug...');
  
  checkStorage();
  const user = await checkAuth();
  const roles = await checkRoles();
  
  if (user && roles) {
    console.log('✅ Debug complete. Check the role debug panel in the bottom right corner.');
    console.log('💡 If the role debug panel shows incorrect data, there might be a caching issue.');
    console.log('🔧 To fix: Try clearing localStorage and logging in again.');
  } else {
    console.log('❌ Debug failed. User might not be properly authenticated.');
  }
  
  // Force reload of the page to show debug panel
  console.log('🔄 Reloading page to show debug panel...');
  setTimeout(() => window.location.reload(), 2000);
}

// Run the debug
debugProduction();