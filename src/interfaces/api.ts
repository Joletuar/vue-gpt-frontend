export interface ApiResponse<T> {
  data: T

  meta: MetaApiResponse
}

export interface ApiErrorResponse {
  statusCode: number
  error:
    | {
        message: string
        details: unknown
      }
    | {
        message: string
        details: unknown
      }[]

  meta: MetaApiResponse
}

export interface MetaApiResponse {
  [key: string]: unknown
  requestId: string
  timestamp: string
}
