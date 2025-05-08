import Link from 'next/link';
import Image from 'next/image';
import type { Component as ComponentType } from '@/services/component';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ComponentCardProps {
  component: ComponentType;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Link href={`/components/${component.component_id}`} passHref>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer overflow-hidden group">
        <CardHeader className="p-0 relative">
          <div className="aspect-[3/2] w-full overflow-hidden">
            <Image
              src={component.previewImageUrl}
              alt={`Preview of ${component.name}`}
              width={300}
              height={200}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint={`${component.type} ${component.dynasty}`}
              priority={false} // Set to true for above-the-fold images if applicable
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg mb-2 leading-tight">{component.name}</CardTitle>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><strong>Dynasty:</strong> {component.dynasty}</p>
            <p><strong>Type:</strong> {component.type}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
           <Badge variant="secondary">{component.material}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
