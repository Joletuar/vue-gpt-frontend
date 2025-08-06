import { apiClient } from '@/config/apiClient'
import type { ApiResponse } from '@/interfaces/api'
import type { GenerateImage, GenerateImageResponse } from '@/interfaces/image'

export const generateImageUseCase = async (prompt: string): Promise<GenerateImage> => {
  try {
    const {
      data: {
        data: { imageId },
      },
    } = await apiClient.post<ApiResponse<GenerateImageResponse>>('/image/generate', {
      prompt,
    })

    return {
      ok: true,
      imageId,
    }
  } catch {
    return {
      ok: false,
      imageId: '',
    }
  }
}
