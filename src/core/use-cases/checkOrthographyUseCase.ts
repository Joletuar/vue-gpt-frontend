import { apiClient } from '@/config/apiClient'
import type { ApiResponse } from '@/interfaces/api'
import type { Orthography, OrthographyResponse } from '@/interfaces/orthography'

export const checkOrthographyUseCase = async (prompt: string): Promise<Orthography> => {
  try {
    const {
      data: { data },
    } = await apiClient.post<ApiResponse<OrthographyResponse>>('/orthography/check', { prompt })

    return {
      ...data,
      ok: true,
    }
  } catch {
    return {
      ok: false,
      accuracy_percentage: 0,
      solutions: [],
      errors: [],
      corrected_text: '',
    }
  }
}
