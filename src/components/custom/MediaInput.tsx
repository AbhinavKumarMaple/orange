"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MediaThumb from "./MediaThumb";
import MediaPickerDialog from "@/app/crm/media/MediaPickerDialog";

interface MediaInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  accept?: string;
}

/**
 * Single media input (image or video). Opens the media library picker.
 * Double-click the thumbnail to expand full-size (via MediaThumb lightbox).
 */
export default function MediaInput({ label, value, onChange, accept = "image/*,video/*" }: MediaInputProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="block">{label}</Label>

      {value ? (
        <div className="flex items-center gap-3">
          {/* MediaThumb handles both image/video and double-click lightbox */}
          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 shrink-0">
            <MediaThumb src={value} sizes="64px" />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setPickerOpen(true)}>
              Change
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onChange?.("")}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" size="sm" variant="outline" className="w-fit" onClick={() => setPickerOpen(true)}>
          Choose from library
        </Button>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(url) => onChange?.(url)}
        accept={accept}
      />
    </div>
  );
}
