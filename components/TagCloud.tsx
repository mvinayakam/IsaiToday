"use client";

import { Badge } from "@/components/ui/badge";

interface TagCloudItem {
  id: string;
  name: string;
  count: number;
}

interface TagCloudProps {
  tags: TagCloudItem[];
  onTagClick?: (tagName: string) => void;
}

export default function TagCloud({ tags, onTagClick }: TagCloudProps) {
  if (tags.length === 0) {
    return null;
  }

  const maxCount = Math.max(...tags.map(t => t.count), 1);
  const minCount = Math.min(...tags.map(t => t.count), 1);
  const range = maxCount - minCount || 1;

  const getTagSize = (count: number) => {
    const normalized = (count - minCount) / range;
    
    if (normalized > 0.7) return "text-3xl";
    if (normalized > 0.5) return "text-2xl";
    if (normalized > 0.3) return "text-xl";
    if (normalized > 0.1) return "text-lg";
    return "text-base";
  };

  const getTagOpacity = (count: number) => {
    const normalized = (count - minCount) / range;
    return 0.5 + (normalized * 0.5);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 py-8">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagClick?.(tag.name)}
            className="transition-all hover:scale-110 active:scale-95"
            style={{ opacity: getTagOpacity(tag.count) }}
            data-testid={`tag-cloud-${tag.name}`}
          >
            <Badge
              variant="secondary"
              className={`${getTagSize(tag.count)} px-3 py-2 cursor-pointer hover-elevate font-medium`}
            >
              #{tag.name}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
