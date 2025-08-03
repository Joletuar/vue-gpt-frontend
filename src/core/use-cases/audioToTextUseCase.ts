import { apiClient } from '@/config/apiClient'
import { type ApiResponse } from '@/interfaces/api'

export const audioToTextUseCase = async (audio: File) => {
  try {
    const formData = new FormData()
    formData.append('audio', audio)

    const {
      data: {
        data: { text },
      },
    } = await apiClient.post<ApiResponse<{ text: string }>>(`/audio-to-text`, formData)

    return {
      ok: true,
      text,
    }
  } catch {
    return {
      ok: false,
      text: '',
    }
  }
}
