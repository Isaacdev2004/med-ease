import { useEffect } from 'react';

const APP_NAME = 'Med-ease';

export function useDocumentTitle(pageTitle: string, portalTitle?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = portalTitle
      ? `${pageTitle} | ${portalTitle} | ${APP_NAME}`
      : `${pageTitle} | ${APP_NAME}`;

    return () => {
      document.title = previous;
    };
  }, [pageTitle, portalTitle]);
}
