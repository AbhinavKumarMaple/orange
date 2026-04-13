"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MediaThumb from "@/components/custom/MediaThumb";
import MediaPickerDialog from "@/app/crm/media/MediaPickerDialog";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function GalleryInput({ images, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function remove(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="block">Gallery Media</Label>

      <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => setPickerOpen(true)}>
        + Add from library
      </Button>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
              <MediaThumb src={src} />
              <button
                type="button"
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={() => remove(i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple
        onSelect={() => {}}
        onMultiSelect={(urls) => onChange([...images, ...urls])}
      />
    </div>
  );
}
