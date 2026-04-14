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
}

export interface MediaVersion {
  url: string;
  size: number;
  replacedAt: string;
}
