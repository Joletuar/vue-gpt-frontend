export const discusserStreamUseCase = async (prompt: string, abortSignal: AbortSignal) => {
  try {
    const res = await fetch(`${import.meta.env['VITE_BASE_API_URL']}/api/v1/discusser/stream`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: abortSignal,
    })

    if (!res.ok) throw new Error('Error en la respuesta')

    const reader = res.body?.getReader()

    if (!reader) throw new Error('No se pudo crear el reader')

    return reader
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }

    return null
  }
}
