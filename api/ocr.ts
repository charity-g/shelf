import { apiRequest } from "./api";

// ============================================
// OCR API
// ============================================
export async function performOcr(formData: FormData) {
  const data = await apiRequest("ocr", {
    method: "POST",
    body: formData,
  });
  return data;
}
