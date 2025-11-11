<template>
  <div class="flex justify-between items-baseline bg-gray-800 shadow-lg px-4 py-2 border-gray-700 border-b text-white text-sm shrink-0">
    <div class="flex items-baseline space-x-4">
      <h2 class="max-w-md font-semibold truncate">{{ stripExt(fileName) }}</h2>
      <button @click="$emit('close')" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors">Close</button>
    </div>

    <!-- Control Bar -->
    <div class="flex flex-wrap justify-between items-center gap-8 text-xs">
      <!-- Navigation Controls -->
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('previousPage')"
          :disabled="currentPage <= 1"
          class="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 px-4 py-2 rounded disabled:text-gray-600 transition-colors disabled:cursor-not-allowed"
          title="Go to previous page"
        >
          Previous
        </button>

        <input
          type="number"
          :value="currentPage"
          @change="handlePageInput"
          :min="1"
          :max="totalPages"
          class="bg-gray-700 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-16 text-start"
          title="Current page number"
        />

        <button
          @click="$emit('nextPage')"
          :disabled="currentPage >= totalPages"
          class="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 px-4 py-2 rounded disabled:text-gray-600 transition-colors disabled:cursor-not-allowed"
          title="Go to next page"
        >
          Next
        </button>
      </div>

      <!-- View Mode Controls -->
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('cycleViewMode')"
          class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
          :title="`Current: ${viewModeLabel}. Click to cycle.`"
        >
          {{ viewModeLabel }}
        </button>
      </div>

      <!-- Zoom Controls -->
      <div class="flex items-center space-x-2">
        <!-- Page Gap Selector -->
        <div class="flex items-center space-x-2 mr-4">
          <label class="text-gray-300">Gap</label>
          <select
            :value="props.pageGap ?? 8"
            @change="handlePageGapChange"
            class="bg-gray-700 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Select page gap size"
          >
            <option value="0">Seamless</option>
            <option value="4">Small</option>
            <option value="8">Medium</option>
            <option value="16">Large</option>
          </select>
        </div>

        <button @click="$emit('zoomOut')" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-colors" title="Zoom out">-</button>
        <select
          :value="zoomMode"
          @change="handleZoomModeChange"
          class="bg-gray-700 px-3 py-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Select zoom mode"
        >
          <option value="fit-width">Fit Width</option>
          <option value="fit-height">Fit Height</option>
          <option value="actual">Actual Size</option>
          <option value="custom">Custom</option>
        </select>

        <button @click="$emit('zoomIn')" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded transition-colors" title="Zoom in">+</button>

        <button
          @click="$emit('toggleFullScreen')"
          class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
          :title="isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        >
          {{ isFullScreen ? "⛶" : "⛶" }}
        </button>
      </div>

      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          :checked="firstPageAsCover"
          @change="handleFirstPageAsCoverChange"
          class="bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-4 h-4"
          title="Use first page as cover"
        />
        <label class="text-gray-300">First Page as Cover</label>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <span class="text-gray-300"> Page {{ currentPage }} of {{ totalPages }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ViewMode, ZoomMode } from "~/composables/useViewerSettings";

const stripExt = (filename: string): string => {
  return filename.replace(/\.pdf+$/, "");
};

const props = defineProps<{
  fileName: string;
  firstPageAsCover: boolean;
  currentPage: number;
  totalPages: number;
  viewMode: ViewMode;
  zoomMode: ZoomMode;
  isFullScreen: boolean;
  pageGap?: number;
}>();

const emit = defineEmits<{
  close: [];
  setFirstPageAsCover: [cover: boolean];
  previousPage: [];
  nextPage: [];
  goToPage: [page: number];
  cycleViewMode: [];
  zoomIn: [];
  zoomOut: [];
  setZoomMode: [mode: ZoomMode];
  toggleFullScreen: [];
  setPageGap: [gap: number];
}>();

const viewModeLabel = computed(() => {
  switch (props.viewMode) {
    case "single":
      return "📄 Single";
    case "double-ltr":
      return "📖 Double LTR";
    case "double-rtl":
      return "📕 Double RTL";
    default:
      return "Unknown";
  }
});

const handleFirstPageAsCoverChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("setFirstPageAsCover", target.checked);
};

const handlePageInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const pageNum = parseInt(target.value, 10);
  if (!isNaN(pageNum)) {
    emit("goToPage", pageNum);
  }
};

const handleZoomModeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("setZoomMode", target.value as ZoomMode);
};

const handlePageGapChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const gap = parseInt(target.value, 10);
  if (!isNaN(gap)) {
    emit("setPageGap", gap);
  }
};
</script>
