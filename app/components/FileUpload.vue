<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="{ 'border-4 border-blue-500 bg-blue-50': isDragging, 'border-2 border-gray-300': !isDragging }"
    >
      <div class="text-center">
        <svg
          class="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>

        <h3 class="mt-4 text-2xl font-semibold text-gray-900">
          PDF Manga Reader
        </h3>

        <p class="mt-2 text-sm text-gray-600">
          Drag and drop a PDF file here, or click to select
        </p>

        <div class="mt-6">
          <input
            type="file"
            accept=".pdf,application/pdf"
            class="hidden"
            @change="handleFileSelect"
            ref="fileInput"
          />
          <button
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            @click="fileInput?.click()"
          >
            Select PDF File
          </button>
        </div>

        <p class="mt-4 text-xs text-gray-500">
          Supports single-page and double-page viewing modes
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  fileSelected: [file: File]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type === 'application/pdf') {
    emit('fileSelected', file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false

  const file = event.dataTransfer?.files[0]
  if (file && file.type === 'application/pdf') {
    emit('fileSelected', file)
  }
}
</script>