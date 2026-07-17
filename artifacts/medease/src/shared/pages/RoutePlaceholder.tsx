import { Construction } from 'lucide-react';
import type { ComponentType } from 'react';

import { PageHeader } from '@/shared/layout/PageHeader';
import { Placeholder } from '@/shared/ui/placeholder';

interface RoutePlaceholderProps {
  title: string;
  description?: string;
}

export function RoutePlaceholder({
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={
          description ??
          'This module is registered in the Med-ease routing architecture.'
        }
      />
      <Placeholder
        icon={Construction}
        title="Coming soon"
        description="This page will be implemented in a future release."
      />
    </div>
  );
}

export function createRoutePlaceholderPage(
  title: string,
  description?: string,
): ComponentType {
  return function RoutePlaceholderPage() {
    return <RoutePlaceholder title={title} description={description} />;
  };
}
