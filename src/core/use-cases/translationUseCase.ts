import { apiClient } from '@/config/apiClient'
import type { ApiResponse } from '@/interfaces/api'
import type { TranslationResponse, Translation } from '@/interfaces/translation'

export const translationUseCase = async (prompt: string, lang: string): Promise<Translation> => {
  try {
    const {
      data: {
        data: { text },
      },
    } = await apiClient.post<ApiResponse<TranslationResponse>>('/translation', {
      prompt,
      lang,
    })

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
