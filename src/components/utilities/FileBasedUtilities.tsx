import React, { useState, useRef } from 'react';
import { Upload, Download, Play, Copy, Check, Trash2 } from 'lucide-react';
import { resizeImage } from '../features/resize-image';
import { convertToWebP } from '../features/webp-converter';
import { useAlert } from '../ui/ModalAlertContext';

export const ImageToBase64Component = () => {
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!base64) return;
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!base64) return;
    const blob = new Blob([base64], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'base64.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Gambar ke Base64</h2>
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary p-10 text-center rounded-lg transition-colors cursor-pointer bg-slate-50 dark:bg-neutral-900" onClick={() => document.getElementById('img-to-base64-upload')?.click()}>
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <input id="img-to-base64-upload" type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">Klik untuk memilih gambar</p>
      </div>
      
      {base64 && (
        <div className="space-y-4">
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-neutral-900 text-center">
            <h3 className="text-sm uppercase font-bold text-slate-500 dark:text-slate-400 mb-2">Pratinjau Masukan</h3>
            <img src={base64} alt="Pratinjau masukan" className="mx-auto max-h-64 object-contain rounded border border-slate-200 dark:border-slate-700" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keluaran Base64</label>
              <div className="flex items-center space-x-3">
                <button onClick={() => setBase64('')} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
                <button onClick={handleCopy} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <button onClick={handleDownload} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  <Download size={14} />
                  <span>Unduh</span>
                </button>
              </div>
            </div>
            <textarea readOnly className="w-full h-64 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800/50 focus:ring-2 focus:ring-slate-400 outline-none resize-none font-mono text-sm text-slate-900 dark:text-slate-100" value={base64} />
          </div>
        </div>
      )}
    </div>
  );
};

export const Base64ToImageComponent = () => {
  const [base64, setBase64] = useState('');
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBase64((ev.target?.result as string) || '');
      setError(false);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!base64 || error) return;
    const src = base64.startsWith('data:image') ? base64 : `data:image/png;base64,${base64}`;
    const a = document.createElement('a');
    a.href = src;
    a.download = 'decoded-image.png';
    a.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Base64 ke Gambar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Masukan Base64</label>
            <div className="flex items-center space-x-3">
              <button onClick={() => { setBase64(''); setError(false); }} disabled={!base64} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
                <Trash2 size={14} />
                <span>Hapus</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt" />
              <button onClick={() => fileInputRef.current?.click()} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <Upload size={14} />
                <span>Unggah txt</span>
              </button>
            </div>
          </div>
          <textarea 
            className="w-full h-96 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-slate-400 outline-none resize-none font-mono text-sm text-slate-900 dark:text-slate-100" 
            placeholder="Tempel data:image/png;base64,... di sini"
            value={base64} 
            onChange={e => { setBase64(e.target.value); setError(false); }} 
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keluaran Gambar</label>
            <button onClick={handleDownload} disabled={!base64 || error} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
              <Download size={14} />
              <span>Unduh</span>
            </button>
          </div>
          <div className="h-96 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800/50 flex flex-col items-center justify-center p-4 relative">
            {base64 ? (
              <img 
                src={base64.startsWith('data:image') ? base64 : `data:image/png;base64,${base64}`} 
                alt="Decoded base64" 
                className="max-h-full max-w-full object-contain"
                onError={() => setError(true)}
              />
            ) : (
              <span className="text-slate-400 dark:text-slate-500">Pratinjau akan muncul di sini</span>
            )}
            {error && <span className="text-red-500 absolute bg-white dark:bg-neutral-900 p-2 rounded shadow font-medium">Data gambar tidak valid</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageResizerComponent = () => {
  const { showAlert } = useAlert();
  const [file, setFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [originalRatio, setOriginalRatio] = useState<number | null>(null);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(80);
  const [preview, setPreview] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target?.result as string;
        setInputPreview(dataUrl);
        
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setOriginalRatio(img.width / img.height);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(selected);
      setPreview('');
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (maintainRatio && originalRatio) {
      setHeight(Math.round(newWidth / originalRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (maintainRatio && originalRatio) {
      setWidth(Math.round(newHeight * originalRatio));
    }
  };

  const execute = async () => {
    if (!file || !inputPreview) return;
    try {
      const img = new Image();
      img.onload = async () => {
        try {
          const dataUrl = await resizeImage({
            img,
            width,
            height,
            preserveAspectRatio: maintainRatio,
            format,
            quality: quality > 1 ? quality / 100 : quality
          });
          setPreview(dataUrl);
        } catch (e: any) {
          showAlert("Gagal memproses gambar: " + e.message, "Kesalahan Resizer");
        }
      };
      img.src = inputPreview;
    } catch (e: any) {
      showAlert("Gagal memproses gambar: " + e.message, "Kesalahan Resizer");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pengubah Ukuran Gambar</h2>
      <div className="bg-slate-50 dark:bg-neutral-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-6">
        
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 text-center rounded-lg relative hover:border-primary transition-colors cursor-pointer" onClick={() => document.getElementById('img-resize-upload')?.click()}>
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Unggah Gambar</p>
          <input id="img-resize-upload" type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {inputPreview && (
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-neutral-800 text-center">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Pratinjau Masukan</h3>
            <img src={inputPreview} alt="Input" className="mx-auto max-h-48 object-contain rounded" />
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 items-end text-slate-800 dark:text-slate-200">
          <div>
            <label className="block text-sm font-medium mb-1">Lebar</label>
            <input type="number" value={width} onChange={handleWidthChange} className="border border-slate-300 dark:border-slate-700 p-2 rounded w-24 bg-white dark:bg-neutral-800" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tinggi</label>
            <input type="number" value={height} onChange={handleHeightChange} className="border border-slate-300 dark:border-slate-700 p-2 rounded w-24 bg-white dark:bg-neutral-800" />
          </div>
          <label className="flex items-center gap-2 mb-2 font-medium">
            <input type="checkbox" checked={maintainRatio} onChange={e => setMaintainRatio(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            Pertahankan Rasio
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select value={format} onChange={e => setFormat(e.target.value as any)} className="border border-slate-300 dark:border-slate-700 p-2 rounded bg-white dark:bg-neutral-800">
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kualitas (0-100)</label>
            <input type="number" value={quality} onChange={e => setQuality(Number(e.target.value))} className="border border-slate-300 dark:border-slate-700 p-2 rounded w-24 bg-white dark:bg-neutral-800" />
          </div>
        </div>

        <button onClick={execute} disabled={!file} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)] w-full sm:w-auto">
          <Play size={18} /> <span>Ubah Ukuran Gambar</span>
        </button>
      </div>

      {preview && (
        <div className="mt-6 text-center space-y-4">
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-neutral-900">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Pratinjau Keluaran</h3>
            <img src={preview} alt="Resized preview" className="mx-auto border border-slate-200 dark:border-slate-700 max-h-96 object-contain rounded" />
          </div>
          <a href={preview} download={`resized.${format}`} className="inline-flex px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md items-center gap-2 transition-colors">
            <Download size={18} /> <span>Unduh Keluaran</span>
          </a>
        </div>
      )}
    </div>
  );
};

export const WebpConverterComponent = () => {
  const { showAlert } = useAlert();
  const [file, setFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState('');
  const [quality, setQuality] = useState(80);
  const [output, setOutput] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = ev => setInputPreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
      setOutput('');
    }
  };

  const convert = async () => {
    if (!file) return;
    try {
      const result = await convertToWebP(file, { quality });
      const blob = new Blob([result.webpData], { type: 'image/webp' });
      setOutput(URL.createObjectURL(blob));
    } catch (e: any) {
      showAlert("Gagal mengonversi ke WebP: " + e.message, "Kesalahan Konversi");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Konverter WebP</h2>
      <div className="bg-slate-50 dark:bg-neutral-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-6">
        
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 text-center rounded-lg relative hover:border-primary transition-colors cursor-pointer" onClick={() => document.getElementById('webp-upload')?.click()}>
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Unggah Gambar</p>
          <input id="webp-upload" type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {inputPreview && (
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-neutral-800 text-center">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Pratinjau Masukan</h3>
            <img src={inputPreview} alt="Input" className="mx-auto max-h-48 object-contain rounded" />
          </div>
        )}

        <div className="text-slate-800 dark:text-slate-200">
          <label className="block text-sm font-medium mb-2">Kualitas: {quality}</label>
          <input type="range" min="1" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full max-w-sm accent-primary dark:accent-primary" />
        </div>
        
        <button onClick={convert} disabled={!file} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)] w-full sm:w-auto">
          <Play size={18} /> <span>Konversi ke WebP</span>
        </button>
      </div>

      {output && (
        <div className="mt-6 text-center space-y-4">
          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-neutral-900">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Pratinjau WebP</h3>
            <img src={output} alt="WebP preview" className="mx-auto border border-slate-200 dark:border-slate-700 max-h-96 object-contain rounded" />
          </div>
          <a href={output} download="converted.webp" className="inline-flex px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md items-center gap-2 transition-colors">
            <Download size={18} /> <span>Unduh WebP</span>
          </a>
        </div>
      )}
    </div>
  );
};
