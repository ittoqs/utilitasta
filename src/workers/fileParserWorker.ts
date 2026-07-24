import { parseCSV } from '../components/features/csv-logs-viewer';

self.onmessage = async (e: MessageEvent) => {
  const { type, file } = e.data;
  
  if (!file) {
    self.postMessage({ error: 'No file provided' });
    return;
  }
  
  try {
    if (file instanceof File || file instanceof Blob) {
      // Untuk file yang sangat besar, text() mungkin masih memakan waktu, tetapi tidak akan membekukan thread utama
      const text = await file.text();
      
      if (type === 'csv') {
        const parsed = parseCSV(text);
        self.postMessage({ type: 'success', data: parsed });
      } else if (type === 'har' || type === 'json') {
        const parsed = JSON.parse(text);
        self.postMessage({ type: 'success', data: parsed });
      } else {
        self.postMessage({ error: 'Unsupported type' });
      }
    } else {
      self.postMessage({ error: 'Invalid file object' });
    }
  } catch (error: any) {
    self.postMessage({ error: error.message || 'Error processing file' });
  }
};
