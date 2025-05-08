import { Badge } from '@/components/ui/badge';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) {
    return <p className="text-sm text-muted-foreground">No tags available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-sm">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
