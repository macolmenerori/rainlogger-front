import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      import('virtual:pwa-register')
        .then(({ registerSW }) => {
          registerSW({
            onRegistered() {},
            onRegisterError(error) {
              console.error('SW registration error:', error);
            }
          });
        })
        .catch(() => {
          // virtual:pwa-register not available (e.g., in test environment)
        });
    }
  }, []);

  return null;
}
