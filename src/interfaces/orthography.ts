export interface OrthographyResponse {
  errors: Error[]
  corrected_text: string
  solutions: Solution[]
  accuracy_percentage: number
}

interface Error {
  type: string
  description: string
}

interface Solution {
  error: string
  correction: string
}

export interface Orthography extends OrthographyResponse {
  ok: boolean
}
