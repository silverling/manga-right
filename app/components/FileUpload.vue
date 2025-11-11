<template>
  <div class="flex justify-center items-center bg-gray-100 min-h-screen">
    <div
      class="bg-white shadow-lg p-8 rounded-lg w-full max-w-2xl"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="{ 'border-4 border-blue-500 bg-blue-50': isDragging, 'border-2 border-gray-300': !isDragging }"
    >
      <div class="text-center">
        <img :src="iconSrc" alt="App icon" class="mx-auto rounded-lg w-24 h-24 object-contain" />

        <h3 class="mt-4 font-semibold text-gray-900 text-2xl">PDF Manga Reader</h3>

        <p class="mt-2 text-gray-600 text-sm">Drag and drop a PDF file here, or click to select</p>

        <div class="mt-6">
          <input type="file" accept=".pdf,application/pdf" class="hidden" @change="handleFileSelect" ref="fileInput" />
          <button
            class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white transition-colors cursor-pointer"
            @click="fileInput?.click()"
          >
            Select PDF File
          </button>
        </div>

        <p class="mt-4 text-gray-500 text-xs">Supports single-page and double-page viewing modes</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import iconSrc from "~/assets/img/icon.webp";
const emit = defineEmits<{
  fileSelected: [file: File];
}>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement>();

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && file.type === "application/pdf") {
    emit("fileSelected", file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;

  const file = event.dataTransfer?.files[0];
  if (file && file.type === "application/pdf") {
    emit("fileSelected", file);
  }
};
</script>
