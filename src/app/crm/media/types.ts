export interface MediaFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  /** DB asset id — present when tracked in media_assets */
  id?: string;
  width?: number | null;
  height?: number | null;
  versions?: MediaVersion[];
  /** Poster image URL for video assets. NULL/undefined for images or
   *  videos that haven't been backfilled yet. */
  thumbnailUrl?: string | null;
}

export interface MediaVersion {
  url: string;
  size: number;
  replacedAt: string;
}
