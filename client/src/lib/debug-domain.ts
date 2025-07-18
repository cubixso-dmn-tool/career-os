// Debug helper to check current domain
export const getCurrentDomain = () => {
  const domain = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;
  
  console.log('🔍 Current domain info:');
  console.log('Domain:', domain);
  console.log('Port:', port);
  console.log('Protocol:', protocol);
  console.log('Full URL:', window.location.href);
  console.log('Add this to Firebase authorized domains:', domain);
  
  return domain;
};

// Call this in browser console if needed
(window as any).getCurrentDomain = getCurrentDomain;