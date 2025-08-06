export async function* getImage(imageId: string) {
  try {
    const res = await fetch(`${import.meta.env['VITE_BASE_API_URL']}/api/v1/image/${imageId}`, {
      method: 'GET',
    })

    if (!res.ok) {
      throw new Error('Error en la request')
    }

    const reader = res.body?.getReader()

    if (!reader) {
      throw new Error('Error al obtner el reader')
    }

    while (true) {
      const { value, done } = await reader.read()

      if (done) break

      yield value
    }
  } catch (err) {
    console.error(err)

    return null
  }
}
