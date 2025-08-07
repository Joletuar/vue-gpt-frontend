<template>
  <div class="col-start-6 col-end-13 p-3 rounded-lg">
    <div class="flex items-start justify-start flex-row-reverse">
      <div
        class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
      >
        F
      </div>
      <div class="relative mr-3 bg-black/25 py-2 px-4 shadow rounded-xl">
        <div class="relative">
          <canvas
            ref="canvasRef"
            :class="[
              'rounded-lg max-w-full block',
              props.editable && !isEdited ? 'cursor-crosshair' : 'cursor-default',
            ]"
            alt="Imagen renderizada"
            @mousedown="startSelection"
            @mousemove="updateSelection"
            @mouseup="endSelection"
            @mouseleave="endSelection"
          />
          <div
            v-if="
              (isSelecting || hasSelection) && selectionRect.width > 0 && selectionRect.height > 0
            "
            class="absolute border-2 border-red-500 bg-red-200/30 pointer-events-none"
            :style="selectionStyle"
          />
        </div>
        <div v-if="hasSelection" class="mt-2 flex gap-2">
          <button
            @click="generateEditedImage"
            class="px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            Generar
          </button>
          <button
            @click="resetSelection"
            class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
          >
            Borrar selección
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

interface Props {
  url: string
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
})
const emits = defineEmits<{
  editedImage: [base64: string]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const originalImage = ref<HTMLImageElement | null>(null)
const isSelecting = ref(false)
const hasSelection = ref(false)
const selectionStart = ref({ x: 0, y: 0 })
const selectionEnd = ref({ x: 0, y: 0 })
const isEdited = ref(false)

const selectionRect = computed(() => {
  const start = selectionStart.value
  const end = selectionEnd.value

  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  }
})

const selectionStyle = computed(() => {
  const rect = selectionRect.value
  const canvas = canvasRef.value
  if (!canvas) return {}

  const canvasRect = canvas.getBoundingClientRect()
  const scaleX = canvasRect.width / canvas.width
  const scaleY = canvasRect.height / canvas.height

  return {
    left: `${rect.x * scaleX}px`,
    top: `${rect.y * scaleY}px`,
    width: `${rect.width * scaleX}px`,
    height: `${rect.height * scaleY}px`,
  }
})

const getMousePosition = (event: MouseEvent) => {
  if (!canvasRef.value) return { x: 0, y: 0 }

  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}

const startSelection = (event: MouseEvent) => {
  if (!canvasRef.value || !props.editable || isEdited.value) return

  const pos = getMousePosition(event)
  isSelecting.value = true
  hasSelection.value = false
  selectionStart.value = pos
  selectionEnd.value = pos
}

const updateSelection = (event: MouseEvent) => {
  if (!isSelecting.value || !canvasRef.value || !props.editable || isEdited.value) return

  const pos = getMousePosition(event)
  selectionEnd.value = pos
}

const endSelection = () => {
  if (!isSelecting.value || !props.editable || isEdited.value) return

  isSelecting.value = false
  const rect = selectionRect.value

  if (rect.width > 5 && rect.height > 5) {
    hasSelection.value = true
  }
}

const resetSelection = () => {
  isSelecting.value = false
  hasSelection.value = false
  selectionStart.value = { x: 0, y: 0 }
  selectionEnd.value = { x: 0, y: 0 }
}

const generateEditedImage = () => {
  if (
    !canvasRef.value ||
    !originalImage.value ||
    !hasSelection.value ||
    !props.editable ||
    isEdited.value
  )
    return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Crear un nuevo canvas para la imagen editada
  const editedCanvas = document.createElement('canvas')
  const editedCtx = editedCanvas.getContext('2d')
  if (!editedCtx) return

  editedCanvas.width = canvas.width
  editedCanvas.height = canvas.height

  // Dibujar la imagen original
  editedCtx.drawImage(originalImage.value, 0, 0, canvas.width, canvas.height)

  // Crear una máscara para la selección (área transparente)
  const rect = selectionRect.value
  editedCtx.globalCompositeOperation = 'destination-out'
  editedCtx.fillRect(rect.x, rect.y, rect.width, rect.height)

  // Convertir a base64
  const base64 = editedCanvas.toDataURL('image/png')

  // Marcar como editada para prevenir futuras ediciones
  isEdited.value = true

  // Emitir la imagen editada
  emits('editedImage', base64)

  // Resetear la selección DESPUÉS de generar la imagen
  resetSelection()
}

const loadImageToCanvas = () => {
  if (!canvasRef.value || !props.url) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  const img = new Image()

  img.onload = () => {
    const maxWidth = 700
    const maxHeight = 600

    let { width, height } = img

    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, width, height)

    // Guardar referencia a la imagen original
    originalImage.value = img

    // Resetear selección al cargar nueva imagen
    resetSelection()
  }

  img.onerror = () => {
    console.error('Error loading image:', props.url)
  }

  img.crossOrigin = 'anonymous'
  img.src = props.url
}

onMounted(() => {
  loadImageToCanvas()
})

watch(
  () => props.url,
  () => {
    loadImageToCanvas()
  },
)
</script>
