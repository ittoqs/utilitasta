import React, { useState, useEffect, useRef } from 'react';
import { type ParsedCSV } from '../features/csv-logs-viewer';
import { Upload, Loader2, Trash2, Play } from 'lucide-react';
import ParserWorker from '../../workers/fileParserWorker?worker';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useAlert } from '../ui/ModalAlertContext';

export const CsvFileViewerComponent = () => {
  const { showAlert } = useAlert();
  const [data, setData] = useState<ParsedCSV | null>(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    workerRef.current = new ParserWorker();
    workerRef.current.onmessage = (e) => {
      const { type, data: parsedData, error } = e.data;
      if (error) {
        showAlert("Gagal mengurai file CSV: " + error, "Kesalahan Urai");
        setLoading(false);
        return;
      }
      if (type === 'success') {
        setData(parsedData);
        setLoading(false);
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    workerRef.current?.postMessage({ type: 'csv', file });
  };

  const rowVirtualizer = useVirtualizer({
    count: data ? data.rows.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45, // tinggi baris default
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0
    ? rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0)
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold mb-0 text-slate-900 dark:text-white">Penampil File CSV / TSV / Log</h2>
        {data && (
          <div className="flex items-center space-x-3">
            <button onClick={() => setData(null)} className="text-sm flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <Trash2 size={16} />
              <span>Bersihkan</span>
            </button>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-neutral-800 px-3 py-1 rounded-full">{data.rows.length.toLocaleString()} baris</span>
          </div>
        )}
      </div>
      <div className="bg-slate-50 dark:bg-neutral-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Memproses file...</span>
            </div>
          </div>
        )}
        <label className="flex flex-col items-center justify-center cursor-pointer p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-lg transition-colors">
          <Upload className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Klik untuk mengunggah file CSV, TSV atau Log</span>
          <span className="text-xs text-slate-500 mt-1">File diproses secara lokal</span>
          <input type="file" accept=".csv,.tsv,.log,.txt" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {data && !loading && (
        <div ref={parentRef} className="overflow-auto max-h-[600px] border border-slate-200 dark:border-slate-800 rounded-md shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-100 dark:bg-neutral-800 sticky top-0 text-slate-900 dark:text-slate-200 shadow-sm z-10">
              <tr>
                {data.headers.map(h => <th key={h} className="p-3 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 text-slate-800 dark:text-slate-300">
              {paddingTop > 0 && (
                <tr><td colSpan={data.headers.length} style={{ height: `${paddingTop}px` }} /></tr>
              )}
              {virtualItems.map((virtualRow) => {
                const row = data.rows[virtualRow.index];
                return (
                  <tr 
                    key={virtualRow.index} 
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    {data.headers.map(h => <td key={h} className="p-3 border-b border-slate-200 dark:border-slate-800 max-w-xs truncate">{row[h]}</td>)}
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr><td colSpan={data.headers.length} style={{ height: `${paddingBottom}px` }} /></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const HarFileViewerComponent = () => {
  const { showAlert } = useAlert();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    workerRef.current = new ParserWorker();
    workerRef.current.onmessage = (e) => {
      const { type, data: parsedData, error } = e.data;
      if (error) {
        showAlert("Gagal mengurai file HAR: " + error, "Kesalahan Urai");
        setLoading(false);
        return;
      }
      if (type === 'success') {
        setEntries(parsedData.log?.entries || []);
        setLoading(false);
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    workerRef.current?.postMessage({ type: 'har', file });
  };

  const rowVirtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45, // tinggi baris default
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0
    ? rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0)
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold mb-0 text-slate-900 dark:text-white">Penampil File HAR</h2>
        {entries.length > 0 && (
          <div className="flex items-center space-x-3">
            <button onClick={() => setEntries([])} className="text-sm flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <Trash2 size={16} />
              <span>Bersihkan</span>
            </button>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-neutral-800 px-3 py-1 rounded-full">{entries.length.toLocaleString()} permintaan</span>
          </div>
        )}
      </div>
      <div className="bg-slate-50 dark:bg-neutral-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Memproses file HAR...</span>
            </div>
          </div>
        )}
        <label className="flex flex-col items-center justify-center cursor-pointer p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-lg transition-colors">
          <Upload className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Klik untuk mengunggah file HAR</span>
          <span className="text-xs text-slate-500 mt-1">Diproses secara aman di browser Anda</span>
          <input type="file" accept=".har" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {entries.length > 0 && !loading && (
        <div ref={parentRef} className="overflow-auto max-h-[600px] border border-slate-200 dark:border-slate-800 rounded-md shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-100 dark:bg-neutral-800 sticky top-0 text-slate-900 dark:text-slate-200 shadow-sm z-10">
              <tr>
                <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-24">Metode</th>
                <th className="p-3 border-b border-slate-200 dark:border-slate-700">URL</th>
                <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-24">Status</th>
                <th className="p-3 border-b border-slate-200 dark:border-slate-700 w-24">Waktu</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 text-slate-800 dark:text-slate-300">
              {paddingTop > 0 && (
                <tr><td colSpan={4} style={{ height: `${paddingTop}px` }} /></tr>
              )}
              {virtualItems.map((virtualRow) => {
                const entry = entries[virtualRow.index];
                return (
                  <tr 
                    key={virtualRow.index} 
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="p-3 border-b border-slate-200 dark:border-slate-800 font-mono font-bold text-blue-600 dark:text-blue-400">{entry.request?.method}</td>
                    <td className="p-3 border-b border-slate-200 dark:border-slate-800 truncate max-w-md" title={entry.request?.url}>{entry.request?.url}</td>
                    <td className="p-3 border-b border-slate-200 dark:border-slate-800">{entry.response?.status}</td>
                    <td className="p-3 border-b border-slate-200 dark:border-slate-800">{Math.round(entry.time || 0)}ms</td>
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr><td colSpan={4} style={{ height: `${paddingBottom}px` }} /></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const InternetSpeedTestComponent = () => {
  const { showAlert } = useAlert();
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setTesting(false);
  };

  const testSpeed = async () => {
    setTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setLatency(null);
    setJitter(null);
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // 1. Latensi & Jitter
      const pings = [];
      for (let i = 0; i < 5; i++) {
        const startPing = performance.now();
        await fetch('https://speed.cloudflare.com/__down?bytes=0', { method: 'GET', cache: 'no-store', signal });
        pings.push(performance.now() - startPing);
      }
      
      const avgLatency = pings.reduce((a, b) => a + b, 0) / pings.length;
      setLatency(avgLatency);
      
      const avgJitter = pings.reduce((acc, curr) => acc + Math.abs(curr - avgLatency), 0) / pings.length;
      setJitter(avgJitter);

      // 2. Kecepatan Unduh
      const dlSize = 10 * 1024 * 1024; // 10 MB untuk akurasi yang lebih baik
      const downloadStart = performance.now();
      const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${dlSize}`, { cache: 'no-store', signal });
      await response.arrayBuffer(); // baca payload
      const downloadEnd = performance.now();
      const downloadDuration = (downloadEnd - downloadStart) / 1000;
      
      const dlSizeBits = dlSize * 8;
      const dlSpeed = (dlSizeBits / downloadDuration) / 1000000;
      setDownloadSpeed(Math.max(0.1, dlSpeed));

      // 3. Kecepatan Unggah
      const payloadSize = 2 * 1024 * 1024; // 2 MB
      const payload = new Uint8Array(payloadSize);
      for (let i = 0; i < payloadSize; i++) payload[i] = Math.random() * 255;
      
      const uploadStart = performance.now();
      await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body: payload,
        cache: 'no-store',
        signal,
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      const uploadEnd = performance.now();
      const uploadDuration = (uploadEnd - uploadStart) / 1000;
      const uploadSizeBits = payloadSize * 8;
      const ulSpeed = (uploadSizeBits / uploadDuration) / 1000000;
      
      setUploadSpeed(Math.max(0.1, ulSpeed));

    } catch (e: any) {
      if (e.name === 'AbortError') {
        showAlert("Pengujian kecepatan dihentikan oleh pengguna.", "Dibatalkan");
      } else {
        showAlert("Gagal melakukan pengujian kecepatan. Silakan periksa koneksi Anda.", "Kesalahan Pengujian");
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-center">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Uji Kecepatan Internet</h2>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={testSpeed} 
          disabled={testing} 
          className="flex items-center justify-center space-x-2 px-8 py-4 text-xl bg-transparent border-2 border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-full font-bold shadow-lg transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]"
        >
          {testing ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} />}
          <span>{testing ? 'Menguji...' : 'Mulai Uji'}</span>
        </button>
        {testing && (
          <button 
            onClick={stopTest} 
            className="px-8 py-4 text-xl bg-red-600 hover:bg-red-700 text-white dark:text-white rounded-full font-bold shadow-lg transition-colors"
          >
            Hentikan
          </button>
        )}
      </div>
      
      {(downloadSpeed !== null || uploadSpeed !== null || latency !== null || jitter !== null) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="p-6 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Unduh</span>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {downloadSpeed !== null ? downloadSpeed.toFixed(2) : '-'} <span className="text-base font-normal">Mbps</span>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Unggah</span>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {uploadSpeed !== null ? uploadSpeed.toFixed(2) : '-'} <span className="text-base font-normal">Mbps</span>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Latensi</span>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {latency !== null ? Math.round(latency) : '-'} <span className="text-base font-normal">ms</span>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Jitter</span>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {jitter !== null ? Math.round(jitter) : '-'} <span className="text-base font-normal">ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FileIntegrityCheckerComponent = () => {
  const [hash, setHash] = useState('');
  
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setHash(hashHex);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pemeriksa Integritas File</h2>
      <p className="text-slate-500 dark:text-slate-400">Hitung hash SHA-256 dari file apa pun secara lokal.</p>
      <div className="bg-slate-50 dark:bg-neutral-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 text-center">
        <label className="flex flex-col items-center justify-center cursor-pointer p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary rounded-lg transition-colors">
          <Upload className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Klik untuk mengunggah file yang akan di-hash</span>
          <input type="file" onChange={handleFile} className="hidden" />
        </label>
      </div>
      {hash && (
        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-neutral-800 shadow-sm text-center relative group">
          <button 
            onClick={() => setHash('')}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-white dark:bg-neutral-800 p-2 rounded shadow-sm border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Bersihkan"
          >
            <Trash2 size={16} />
          </button>
          <h3 className="text-sm uppercase font-bold text-slate-500 dark:text-slate-400">Checksum SHA-256</h3>
          <p className="font-mono mt-2 break-all text-slate-900 dark:text-slate-100">{hash}</p>
        </div>
      )}
    </div>
  );
};
