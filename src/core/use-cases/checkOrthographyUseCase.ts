import { apiClient } from '@/config/apiClient'
import type { ApiResponse } from '@/interfaces/api'
import type { Orthography, OrthographyResponse } from '@/interfaces/orthography'

export const checkOrthographyUseCase = async (prompt: string): Promise<Orthography> => {
  try {
    const {
      data: { data },
    } = await apiClient.post<ApiResponse<OrthographyResponse>>('/orthography/check', { prompt })

    const { accuracy_percentage, corrected_text, errors, solutions } = data

    return {
      ok: true,
      accuracyPercentage: accuracy_percentage,
      solutions,
      errors,
      correctedText: corrected_text,
    }
  } catch {
    return {
      ok: false,
      accuracyPercentage: 0,
      solutions: [],
      errors: [],
      correctedText: '',
    }
  }
}
