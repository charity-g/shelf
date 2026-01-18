import { apiRequest } from "./api";

// ============================================
// OCR API
// ============================================

export interface OcrResponse {
  rawText: string;
  error?: string | null;
  structuredData?: {
    name: string;
    type: string;
    skinType: string;
    ingredients: string[];
    timeOfDay: string;
  };
}

export async function performOcr(formData: FormData) {
  const data = await apiRequest("/processing/ocr", {
    method: "POST",
    body: formData,
  });

  if (data.error) {
    throw new Error(data.error);
  }

  return data as OcrResponse;
}
