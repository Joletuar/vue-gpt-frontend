export async function* assistantChat(question: string, threadId: string) {
  try {
    const res = await fetch(
      `${import.meta.env['VITE_BASE_API_URL']}/api/v1/assistant/user-question`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ threadId, question }),
      },
    )

    if (!res.ok) {
      throw new Error('Error al realizar la request')
    }

    const reader = res.body?.getReader()

    if (!reader) throw new Error('No se pudo obtener el reader')

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()

      if (done || !value) {
        reader.releaseLock()

        return null
      }

      yield decoder.decode(value)
    }
  } catch (err) {
    console.error(err)

    return null
  }
}
