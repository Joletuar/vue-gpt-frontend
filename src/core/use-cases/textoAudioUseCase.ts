export const texToAudioUseCase = async (prompt: string, voice: string): Promise<Blob | null> => {
  try {
    const res = await fetch(`${import.meta.env['VITE_BASE_API_URL']}/api/v1/text-to-audio`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ prompt, voice }),
    })

    if (!res.ok) {
      throw new Error('Error en la request')
    }

    const audioBlob = await res.blob()

    return audioBlob
  } catch {
    return null
  }
}
