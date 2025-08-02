import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import DashboardLayout from '../layouts/DashboardLayout.vue'
import DiscusserPage from '../pages/discusser/DiscusserPage.vue'
import ProsConsStreamPage from '../pages/pros-cons-stream/ProsConsStreamPage.vue'
import TranslatePage from '../pages/translate/TranslatePage.vue'
import TextToAudioPage from '../pages/text-to-audio/TextToAudioPage.vue'
import ImageGenerationPage from '../pages/image-generation/ImageGenerationPage.vue'
import ImageTunningPage from '../pages/image-generation/ImageTunningPage.vue'
import AudioToTextPage from '../pages/audio-to-text/AudioToTextPage.vue'
import AssistantPage from '../pages/assistant/AssistantPage.vue'
import OrthographyPage from '../pages/orthography/OrthographyPage.vue'

export const menuRoutes = [
  {
    to: '/orthography',
    icon: 'fa-solid fa-spell-check',
    title: 'Ortografía',
    description: 'Corregir ortografía',
    component: OrthographyPage,
  },
  {
    to: '/discusser',
    icon: 'fa-solid fa-code-compare',
    title: 'Pros & Cons',
    description: 'Comparar pros y contras',
    component: DiscusserPage,
  },
  {
    to: '/pros-cons-stream',
    icon: 'fa-solid fa-water',
    title: 'Como stream',
    description: 'Con stream de mensajes',
    component: ProsConsStreamPage,
  },
  {
    to: '/translate',
    icon: 'fa-solid fa-language',
    title: 'Traducir',
    description: 'Textos a otros idiomas',
    component: TranslatePage,
  },
  {
    to: '/text-to-audio',
    icon: 'fa-solid fa-podcast',
    title: 'Texto a audio',
    description: 'Convertir texto a audio',
    component: TextToAudioPage,
  },
  {
    to: '/image-generation',
    icon: 'fa-solid fa-image',
    title: 'Imágenes',
    description: 'Generar imágenes',
    component: ImageGenerationPage,
  },
  {
    to: '/image-tunning',
    icon: 'fa-solid fa-wand-magic',
    title: 'Editar imagen',
    description: 'Generación continua',
    component: ImageTunningPage,
  },
  {
    to: '/audio-to-text',
    icon: 'fa-solid fa-comment-dots',
    title: 'Audio a texto',
    description: 'Convertir audio a texto',
    component: AudioToTextPage,
  },
  {
    to: '/assistant',
    icon: 'fa-solid fa-user',
    title: 'Asistente',
    description: 'Información del asistente',
    component: AssistantPage,
  },
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      ...menuRoutes.map((route) => ({
        path: route.to.substring(1), // Remueve el "/" inicial
        component: route.component,
      })),
      {
        path: '',
        redirect: menuRoutes[0].to,
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
