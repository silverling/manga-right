import type { PDFDocumentProxy } from "pdfjs-dist";

export const usePDFDocument = () => {
  // Store the actual PDF document without reactivity to avoid proxy issues
  let pdfDoc: PDFDocumentProxy | null = null;

  const fileName = ref<string>("");
  const numPages = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Load PDF from file
  const loadPDF = async (file: File) => {
    console.log("Loading PDF:", file.name);
    if (!import.meta.client) return;

    isLoading.value = true;
    error.value = null;
    fileName.value = file.name;

    try {
      // Dynamically import pdfjs-dist only on the client
      const pdfjsLib = await import("pdfjs-dist");

      // Initialize PDF.js worker using local file
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      pdfDoc = pdf;
      numPages.value = pdf.numPages;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load PDF";
      console.error("Error loading PDF:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Get a specific page
  const getPage = async (pageNum: number) => {
    if (!pdfDoc) {
      console.warn("PDF document is not loaded yet.");
      return null;
    }
    if (pageNum < 1 || pageNum > numPages.value) {
      console.warn("Failed to get page: invalid page number", pageNum);
      return null;
    }
    return await pdfDoc.getPage(pageNum);
  };

  // Clear the current document
  const clearDocument = () => {
    if (pdfDoc) {
      pdfDoc.destroy();
    }
    pdfDoc = null;
    fileName.value = "";
    numPages.value = 0;
    error.value = null;
  };

  return {
    fileName: readonly(fileName),
    numPages: readonly(numPages),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadPDF,
    getPage,
    clearDocument,
  };
};
