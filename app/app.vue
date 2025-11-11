<template>
  <div class="h-full">
    <FileUpload v-if="!selectedFile" @file-selected="handleFileSelected" />
    <PDFViewer v-else :file="selectedFile" @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
const selectedFile = ref<File | null>(null);

const handleFileSelected = (file: File) => {
  selectedFile.value = file;
};

const handleClose = () => {
  selectedFile.value = null;
};
</script>
