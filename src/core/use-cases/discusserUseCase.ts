import { apiClient } from '@/config/apiClient'
import type { ApiResponse } from '@/interfaces/api'
import type { Discusser, DiscusserResponse } from '@/interfaces/discusser'

export const discusserUseCase = async (prompt: string): Promise<Discusser> => {
  try {
    const {
      data: { data },
    } = await apiClient.post<ApiResponse<DiscusserResponse>>('/discusser', { prompt })

    return {
      ok: true,
      message: data.message,
    }
  } catch {
    return {
      ok: false,
      message: '',
    }
  }
}
