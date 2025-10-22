'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { produce } from 'immer';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestedTags: string[];
  onClearSuggestions: () => void;
}

export function TagInput({ value = [], onChange, suggestedTags, onClearSuggestions }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };
  
  const addSuggestedTag = (tag: string) => {
    if (!value.includes(tag)) {
        onChange(produce(value, draft => {
            draft.push(tag);
        }));
    }
    onClearSuggestions();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-input p-2">
        {value.map(tag => (
          <Badge key={tag} variant="secondary">
            {tag}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-1 border-0 shadow-none focus-visible:ring-0"
        />
      </div>
      {suggestedTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground my-auto">Suggestions:</p>
          {suggestedTags.map(tag => (
            <Button
              key={tag}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSuggestedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
