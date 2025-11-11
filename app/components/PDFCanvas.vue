<template>
  <div class="flex justify-center items-center">
    <canvas ref="canvas" class="max-w-full h-auto"></canvas>
  </div>
</template>

<script setup lang="ts">
import type { PDFPageProxy, RenderTask } from "pdfjs-dist";
import type { ZoomMode } from "@/composables/useViewerSettings";

const props = defineProps<{
  pageNum: number;
  getPage: (pageNum: number) => Promise<PDFPageProxy | null>;
  zoomMode: ZoomMode;
  customZoom: number;
  containerWidth?: number;
  containerHeight?: number;
}>();

const canvas = ref<HTMLCanvasElement>();
let renderTask: RenderTask | null = null;
let watchHandle: ReturnType<typeof watch> | null = null;

const renderPage = async () => {
  if (!canvas.value) {
    console.error("Canvas element is not available");
    return;
  }

  if (renderTask) {
    renderTask.cancel();
    renderTask = null;
    console.trace("Cancelled previous render task");
  }

  const page = await props.getPage(props.pageNum);
  if (!page) {
    console.error("Failed to retrieve PDF page", props.pageNum);
    return;
  }

  const context = canvas.value.getContext("2d");
  if (!context) {
    console.error("Failed to get canvas 2D context");
    return;
  }

  // Get viewport based on zoom mode
  let scale = 1.0;
  const baseViewport = page.getViewport({ scale: 1.0 });

  if (props.zoomMode === "fit-width" && props.containerWidth) {
    scale = props.containerWidth / baseViewport.width;
  } else if (props.zoomMode === "fit-height") {
    const availableHeight = props.containerHeight ?? window.innerHeight * 0.85;
    scale = availableHeight / baseViewport.height;
  } else if (props.zoomMode === "custom") {
    scale = props.customZoom;
  }

  const viewport = page.getViewport({ scale });

  // Set canvas dimensions
  canvas.value.width = viewport.width;
  canvas.value.height = viewport.height;

  // Render PDF page and store the task
  renderTask = page.render({
    canvas: canvas.value,
    canvasContext: context,
    viewport: viewport,
  });
  await renderTask.promise;

  renderTask = null;
};

onMounted(async () => {
  await renderPage();
  watchHandle = watch(() => [props.pageNum, props.zoomMode, props.customZoom, props.containerWidth, props.containerHeight], renderPage);
});

onBeforeUnmount(() => {
  if (watchHandle) {
    watchHandle.stop();
    watchHandle = null;
  }

  // Cancel any ongoing render operation
  if (renderTask) {
    renderTask.cancel();
    renderTask = null;
  }
});
</script>
