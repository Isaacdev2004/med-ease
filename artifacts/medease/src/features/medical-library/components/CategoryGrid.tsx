import { Link } from 'wouter';

import type { MedicationCategoryInfo } from '@/services/medical-library/medical-library.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface CategoryGridProps {
  categories: MedicationCategoryInfo[];
  portalBase: string;
}

export function CategoryGrid({ categories, portalBase }: CategoryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.filter((c) => c.count > 0).map((category) => (
        <Link key={category.id} href={`${portalBase}/medical-library?category=${category.id}`}>
          <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <Badge variant="secondary">{category.count}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
