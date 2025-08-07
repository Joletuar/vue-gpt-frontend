import { apiClient } from '@/config/apiClient'
import type { ApiResponse } from '@/interfaces/api'
import type { EditImage, EditImageResponse } from '@/interfaces/image'

export const editImageUseCase = async (
  originalImage: string,
  maskImage: string,
  prompt: string,
): Promise<EditImage> => {
  try {
    const {
      data: {
        data: { imageId },
      },
    } = await apiClient.post<ApiResponse<EditImageResponse>>('/image/edit', {
      originalImage,
      maskImage,
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
