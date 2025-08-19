import { apiClient } from '@/config/apiClient'
import type { ApiResponse } from '@/interfaces/api'

export const createThreadUseCase = async () => {
  try {
    const {
      data: { data: threadId },
    } = await apiClient.post<ApiResponse<string>>('/assistant/create-thread')

    return { ok: true, threadId }
  } catch (error) {
    console.log(error)

    return {
      ok: false,
      threadId: '',
    }
  }
}
