import React, { useState, useRef } from 'react';
import { calculateContrast, getContrastDescription, normalizeHexInput } from '../features/wcag-color-contrast';
import { pxToRem, remToPx } from '../features/css-units-converter';
import { Play, Upload, Copy, Check, Download, Trash2 } from 'lucide-react';

export const WcagColorContrastComponent = () => {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#FFFFFF');
  
  const result = calculateContrast({ foregroundHex: fg, backgroundHex: bg });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pemeriksa Kontras Warna WCAG</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Warna Depan (Foreground)</label>
            <div className="flex gap-2">
              <input type="color" value={normalizeHexInput(fg) || '#000000'} onChange={e => setFg(e.target.value)} className="h-10 w-16 cursor-pointer border-0 p-0 rounded" />
              <input type="text" value={fg} onChange={e => setFg(e.target.value)} className="flex-1 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Warna Latar (Background)</label>
            <div className="flex gap-2">
              <input type="color" value={normalizeHexInput(bg) || '#FFFFFF'} onChange={e => setBg(e.target.value)} className="h-10 w-16 cursor-pointer border-0 p-0 rounded" />
              <input type="text" value={bg} onChange={e => setBg(e.target.value)} className="flex-1 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
          </div>
        </div>
        <div 
          className="rounded-lg p-6 flex flex-col justify-center items-center border border-slate-200 dark:border-slate-800 shadow-sm"
          style={{ backgroundColor: normalizeHexInput(bg) || '#fff', color: normalizeHexInput(fg) || '#000' }}
        >
          <span className="text-2xl font-bold">Teks Contoh</span>
          <span className="text-sm mt-2">Apakah ini terlihat mudah dibaca?</span>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800 text-center">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rasio</h3>
            <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{result.ratio.toFixed(2)}:1</p>
            <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{getContrastDescription(result.ratio)}</p>
          </div>
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800 text-center">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WCAG AA</h3>
            <p className="text-lg mt-2 font-medium text-slate-800 dark:text-slate-200">Normal: {result.aa.normal ? '✅ Lulus' : '❌ Gagal'}</p>
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200">Besar: {result.aa.large ? '✅ Lulus' : '❌ Gagal'}</p>
          </div>
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800 text-center">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WCAG AAA</h3>
            <p className="text-lg mt-2 font-medium text-slate-800 dark:text-slate-200">Normal: {result.aaa.normal ? '✅ Lulus' : '❌ Gagal'}</p>
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200">Besar: {result.aaa.large ? '✅ Lulus' : '❌ Gagal'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const CssUnitsConverterComponent = () => {
  const [value, setValue] = useState(16);
  const [from, setFrom] = useState<'px' | 'rem' | 'em'>('px');
  const [to, setTo] = useState<'px' | 'rem' | 'em'>('rem');
  const [base, setBase] = useState(16);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    try {
      let res = value;
      if (from === 'px' && (to === 'rem' || to === 'em')) {
        res = pxToRem(value, base);
      } else if ((from === 'rem' || from === 'em') && to === 'px') {
        res = remToPx(value, base);
      }
      setOutput(`${res}${to}`);
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    }
  };

  const handleCopy = () => {
    if (!output || output.startsWith('Error')) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Konversi Satuan CSS</h2>
      <div className="flex flex-wrap gap-4 items-end bg-slate-50 dark:bg-neutral-900 p-6 rounded-md border border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nilai</label>
          <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className="w-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-400 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Dari</label>
          <select value={from} onChange={e => setFrom(e.target.value as any)} className="w-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-400 outline-none">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ke</label>
          <select value={to} onChange={e => setTo(e.target.value as any)} className="w-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-400 outline-none">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ukuran Dasar (px)</label>
          <input type="number" value={base} onChange={e => setBase(Number(e.target.value))} className="w-24 p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-400 outline-none" />
        </div>
        <button onClick={convert} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all font-medium disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]">Konversi</button>
      </div>

      {output && (
        <div className="p-6 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center flex flex-col items-center justify-center relative group mt-6">
          <span className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{output}</span>
          {!output.startsWith('Error') && (
            <button 
              onClick={handleCopy}
              className="mt-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center space-x-1"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="text-sm font-medium">{copied ? 'Tersalin!' : 'Salin ke Papan Klip'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const SvgViewerComponent = () => {
  const [svg, setSvg] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSvg((ev.target?.result as string) || '');
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopy = () => {
    if (!svg) return;
    navigator.clipboard.writeText(svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vector.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Penampil SVG</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kode SVG</label>
            <div className="flex items-center space-x-3">
              <button onClick={() => setSvg('')} disabled={!svg} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
                <Trash2 size={14} />
                <span>Hapus</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".svg,.txt" />
              <button onClick={() => fileInputRef.current?.click()} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <Upload size={14} />
                <span>Unggah SVG</span>
              </button>
            </div>
          </div>
          <textarea 
            className="w-full h-96 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 font-mono text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" 
            placeholder="Tempel kode mentah <svg>...</svg> di sini"
            value={svg} 
            onChange={e => setSvg(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pratinjau</label>
            <div className="flex items-center space-x-3">
              <button onClick={handleCopy} disabled={!svg} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors disabled:opacity-50">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
              <button onClick={handleDownload} disabled={!svg} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors disabled:opacity-50">
                <Download size={14} />
                <span>Unduh</span>
              </button>
            </div>
          </div>
          <div className="w-full h-96 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800 flex items-center justify-center p-4 overflow-auto overflow-hidden">
            {svg ? (
              <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full h-full flex justify-center items-center object-contain" />
            ) : (
              <span className="text-slate-400 dark:text-slate-500">Pratinjau akan muncul di sini</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
