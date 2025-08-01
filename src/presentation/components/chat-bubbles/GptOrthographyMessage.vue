<template>
  <div class="col-start-1 col-end-9 p-3 rounded-lg">
    <div class="flex flex-row items-start">
      <div
        class="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0"
      >
        G
      </div>
      <div class="relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
        <h3 class="text-3xl">Puntaje: {{ parsedData.accuracyPercentage }}%</h3>

        <h3 class="mt-5 text-2xl">Texto corregido</h3>
        <p>{{ parsedData.correctedText }}</p>

        <p v-if="parsedData.errors.length === 0">No se encontraron errores, perfecto!</p>

        <template v-else>
          <h3 class="text-2xl">Errores encontrados</h3>
          <ul>
            <li v-for="(error, i) in parsedData.errors" :key="i">
              {{ error.type }}
              <p>{{ error.description }}</p>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Orthography } from '@/interfaces/orthography'
import { computed } from 'vue'

interface Props {
  data: string
}

const props = defineProps<Props>()

const parsedData = computed<Orthography>(() => JSON.parse(props.data))
</script>
