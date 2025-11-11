<template>
  <div class="flex flex-col bg-gray-900 h-full">
    <!-- Controls -->
    <ViewerControls
      v-show="!isFullScreen"
      :file-name="fileName"
      :first-page-as-cover="firstPageAsCover"
      :current-page="currentPage"
      :total-pages="numPages"
      :view-mode="viewMode"
      :zoom-mode="zoomMode"
      :is-full-screen="isFullScreen"
      :page-gap="pageGap"
      @set-page-gap="handleSetPageGap"
      @close="handleClose"
      @set-first-page-as-cover="setFirstPageAsCover"
      @previous-page="previousPage()"
      @next-page="nextPage()"
      @go-to-page="(page) => goToPage(page)"
      @cycle-view-mode="cycleViewMode"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @set-zoom-mode="setZoomMode"
      @toggle-full-screen="toggleFullScreen"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <div class="text-white text-xl">Loading PDF...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center h-screen">
      <div class="text-red-500 text-xl">Error: {{ error }}</div>
    </div>

    <!-- PDF Pages -->
    <div
      v-else
      ref="viewerContainer"
      :class="[
        'flex-1 flex justify-center items-center p-4 pb-0 w-full min-h-0 overflow-auto',
        { 'flex-row-reverse': viewMode === 'double-rtl' },
        { 'cursor-none': isFullScreen && isIdle },
      ]"
    >
      <!-- Exit fullscreen button (visible only in fullscreen) -->
      <div v-if="isFullScreen" class="top-4 right-4 z-50 fixed flex flex-col items-end space-y-2">
        <button
          @click="toggleFullScreen()"
          aria-label="Exit full screen"
          class="bg-gray-800 hover:bg-gray-700 shadow px-3 py-2 rounded text-white transition-opacity duration-300"
          :class="{ 'opacity-0 pointer-events-none': isIdle, 'opacity-100': !isIdle }"
        >
          Exit Fullscreen
        </button>
        <button
          @click="zoomIn()"
          aria-label="Zoom in"
          class="flex justify-center items-center bg-gray-800 hover:bg-gray-700 shadow rounded w-10 h-10 text-white transition-opacity duration-300"
          :class="{ 'opacity-0 pointer-events-none': isIdle, 'opacity-100': !isIdle }"
        >
          +
        </button>
        <button
          @click="zoomOut()"
          aria-label="Zoom out"
          class="flex justify-center items-center bg-gray-800 hover:bg-gray-700 shadow rounded w-10 h-10 text-white transition-opacity duration-300"
          :class="{ 'opacity-0 pointer-events-none': isIdle, 'opacity-100': !isIdle }"
        >
          -
        </button>
      </div>

      <div v-for="pageNum in pagesToDisplay" :key="pageNum" :style="{ marginLeft: halfGap + 'px', marginRight: halfGap + 'px' }">
        <PDFCanvas
          :page-num="pageNum"
          :get-page="getPage"
          :zoom-mode="zoomMode"
          :custom-zoom="customZoom"
          :container-width="containerWidth"
          :container-height="containerHeight"
        />
        <div
          class="mt-2 text-gray-400 text-sm text-center transition-opacity duration-300"
          :class="{ 'opacity-0': isFullScreen && isIdle, 'opacity-100': !(isFullScreen && isIdle) }"
        >
          {{ pageNum }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  file: File;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Use composables
const { fileName, numPages, isLoading, error, loadPDF, getPage, clearDocument } = usePDFDocument();

const {
  currentPage,
  viewMode,
  zoomMode,
  customZoom,
  isFullScreen,
  firstPageAsCover,
  setFirstPageAsCover,
  goToPage,
  nextPage,
  previousPage,
  cycleViewMode,
  setZoomMode,
  zoomIn,
  zoomOut,
  toggleFullScreen,
  getPagesToDisplay,
  pageGap,
  setPageGap,
  reset,
} = useViewerSettings(numPages);

const viewerContainer = ref<HTMLElement>();
const containerWidth = ref<number>(800);
const containerHeight = ref<number>(600);

// Idle state for fullscreen UI (hide controls after inactivity)
const isIdle = ref(false);
let idleTimer: number | undefined;
const IDLE_TIMEOUT = 2500; // ms

const resetIdleTimer = () => {
  isIdle.value = false;
  if (idleTimer) {
    window.clearTimeout(idleTimer);
  }
  if (isFullScreen.value) {
    idleTimer = window.setTimeout(() => {
      isIdle.value = true;
    }, IDLE_TIMEOUT);
  }
};

const activityHandler = () => resetIdleTimer();

// Calculate container width for fit-width zoom
const updateContainerWidth = () => {
  if (!viewerContainer.value) return;

  const width = viewerContainer.value.clientWidth - 64;
  const height = viewerContainer.value.clientHeight - 64;

  if (viewMode.value !== "single") {
    containerWidth.value = Math.max(0, width / 2);
  } else {
    containerWidth.value = Math.max(0, width);
  }

  containerHeight.value = Math.max(0, height);
};

// Get pages to display
const pagesToDisplay = computed(() => {
  return getPagesToDisplay(numPages.value);
});

// Handle close
const handleClose = () => {
  clearDocument();
  reset();
  emit("close");
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
    previousPage();
  } else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
    nextPage();
  }
};

// Load PDF on mount
onMounted(async () => {
  await loadPDF(props.file);
  updateContainerWidth();

  window.addEventListener("resize", updateContainerWidth);
  window.addEventListener("keydown", handleKeydown);
  // activity listeners for idle detection - only mousemove shows UI
  window.addEventListener("mousemove", activityHandler);
  resetIdleTimer();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateContainerWidth);
  window.removeEventListener("keydown", handleKeydown);
  clearDocument();
  window.removeEventListener("mousemove", activityHandler);
  // other input types intentionally not wired to activityHandler so
  // keyboard navigation and programmatic page changes do NOT show the UI
  if (idleTimer) {
    window.clearTimeout(idleTimer);
  }
});

// Watch for view mode changes
watch(viewMode, () => {
  updateContainerWidth();
});

// Reset idle timer when fullscreen changes
watch(isFullScreen, (newVal) => {
  if (newVal) {
    resetIdleTimer();
  } else {
    isIdle.value = false;
    if (idleTimer) {
      window.clearTimeout(idleTimer);
    }
  }
});

const halfGap = computed(() => Math.round((pageGap?.value ?? 8) / 2));

// Handle external setPageGap from ViewerControls
const handleSetPageGap = (gap: number) => {
  setPageGap(gap);
  // Recompute container width in case layout changes
  updateContainerWidth();
};
</script>
