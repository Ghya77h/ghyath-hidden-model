
export interface ImagePart {
  data: string;
  mimeType: string;
}

export interface EditedImageResult {
  newImage: ImagePart;
  responseText?: string;
}
