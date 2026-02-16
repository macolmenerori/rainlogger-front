import { useEffect } from 'react';
import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';

import i18n from '@/ui/i18n/i18n';

export function Layout({ children }: { children: React.ReactNode }) {
  // Update HTML lang attribute dynamically when language changes
  useEffect(() => {
    const updateLang = () => {
      document.documentElement.lang = i18n.language || 'es';
    };

    // Set initial language
    updateLang();

    // Listen for language changes
    i18n.on('languageChanged', updateLang);

    // Cleanup listener on unmount
    return () => {
      i18n.off('languageChanged', updateLang);
    };
  }, []);

  return (
    <html lang={i18n.language || 'es'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a2332" />
        <meta name="description" content="Log rainfall amounts accurately with Rainlogger." />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/svg+xml" href="/img/favicon.svg" />
        <link rel="icon" type="image/png" sizes="96x96" href="/img/favicon-96x96.png" />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
        <Meta />
        <Links />
        <title>Rainlogger</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
