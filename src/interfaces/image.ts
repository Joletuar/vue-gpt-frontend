export interface GenerateImageResponse {
  imageId: string
}

export interface GenerateImage extends GenerateImageResponse {
  ok: boolean
}

export type EditImageResponse = GenerateImageResponse

export type EditImage = GenerateImage
