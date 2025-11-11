export type ViewMode = "single" | "double-ltr" | "double-rtl";
export type ZoomMode = "fit-width" | "fit-height" | "actual" | "custom";

export const useViewerSettings = (totalPages: Ref<number>) => {
  const currentPage = ref<number>(1);
  const firstPageAsCover = ref<boolean>(true); // In general, the first page of file is the cover.
  const viewMode = ref<ViewMode>("double-rtl");
  const zoomMode = ref<ZoomMode>("fit-height");
  const customZoom = ref<number>(1.0);
  const isFullScreen = ref<boolean>(false);

  // Horizontal gap (in pixels) between pages when rendered side-by-side
  const pageGap = ref<number>(0);

  // Toggle first page as cover
  const setFirstPageAsCover = (cover: boolean) => {
    firstPageAsCover.value = cover;
  };

  // Navigation
  const goToPage = (pageNum: number) => {
    currentPage.value = Math.min(Math.max(pageNum, 1), totalPages.value);
  };

  const nextPage = () => {
    if (currentPage.value === 1 && firstPageAsCover.value) {
      goToPage(2);
      return;
    } else if (viewMode.value === "single") {
      goToPage(currentPage.value + 1);
      return;
    } else {
      goToPage(currentPage.value + 2);
    }
  };

  const previousPage = () => {
    if (currentPage.value === 2 && firstPageAsCover.value) {
      goToPage(1);
      return;
    } else if (viewMode.value === "single") {
      goToPage(currentPage.value - 1);
      return;
    } else {
      goToPage(currentPage.value - 2);
    }
  };

  // View mode cycle: single -> double-ltr -> double-rtl -> single
  const cycleViewMode = () => {
    if (viewMode.value === "single") {
      viewMode.value = "double-ltr";
    } else if (viewMode.value === "double-ltr") {
      viewMode.value = "double-rtl";
    } else {
      viewMode.value = "single";
    }
  };

  // Zoom controls
  const setZoomMode = (mode: ZoomMode) => {
    zoomMode.value = mode;
  };

  const zoomIn = () => {
    customZoom.value = Math.min(customZoom.value + 0.25, 5.0);
    zoomMode.value = "custom";
  };

  const zoomOut = () => {
    customZoom.value = Math.max(customZoom.value - 0.25, 0.5);
    zoomMode.value = "custom";
  };

  // Fullscreen
  const toggleFullScreen = async () => {
    if (!import.meta.client) return;

    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      isFullScreen.value = true;
    } else {
      await document.exitFullscreen();
      isFullScreen.value = false;
    }
  };

  // Listen for fullscreen changes
  if (import.meta.client) {
    onMounted(() => {
      document.addEventListener("fullscreenchange", () => {
        isFullScreen.value = !!document.fullscreenElement;
      });
    });
  }

  // Get pages to display based on view mode
  const getPagesToDisplay = (totalPages: number) => {
    if (viewMode.value === "single") {
      return [currentPage.value];
    }

    // Double page modes
    if (firstPageAsCover.value && currentPage.value === 1) {
      return [1];
    } else return [currentPage.value, currentPage.value + 1];
  };

  const reset = () => {
    currentPage.value = 1;
    viewMode.value = "double-rtl";
    zoomMode.value = "fit-height";
    customZoom.value = 1.0;
    isFullScreen.value = false;
    pageGap.value = 8;
  };

  return {
    currentPage: readonly(currentPage),
    viewMode: readonly(viewMode),
    zoomMode: readonly(zoomMode),
    customZoom: readonly(customZoom),
    isFullScreen: readonly(isFullScreen),
    pageGap: readonly(pageGap),
    firstPageAsCover: readonly(firstPageAsCover),
    setPageGap: (gap: number) => (pageGap.value = gap),
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
    reset,
  };
};
