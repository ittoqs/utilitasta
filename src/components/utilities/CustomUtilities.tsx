import React, { useState, useRef } from 'react';
import { generateHash } from '../features/hash-generator';
import { PasswordBuilder } from '../features/password-generator';
import { generateLoremIpsum } from '../features/lorem-ipsum-generator';
import { convertCSSToInline } from '../features/css-to-inline';
import { Play, Copy, Check, RefreshCw, Upload, Download, Trash2 } from 'lucide-react';

export const HashGeneratorComponent = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!input) return;
    const result: Record<string, string> = {};
    try {
      result['sha256'] = generateHash('sha256', input, 'hex');
      result['sha512'] = generateHash('sha512', input, 'hex');
    } catch(e) {}
    setHashes(result);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const val = (ev.target?.result as string) || '';
      setInput(val);
      if (!val) setHashes({});
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopy = (hash: string, algo: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(algo);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pembuat Hash</h2>
      <p className="text-slate-500 dark:text-slate-400">Hasilkan hash aman menggunakan berbagai algoritma.</p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Teks Input</label>
          <div className="flex items-center space-x-3">
            <button onClick={() => { setInput(''); setHashes({}); }} disabled={!input} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
              <Trash2 size={14} />
              <span>Hapus</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.json,.csv,.xml" />
            <button onClick={() => fileInputRef.current?.click()} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <Upload size={14} />
              <span>Unggah file</span>
            </button>
          </div>
        </div>
        <textarea
          className="w-full h-32 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-slate-400 outline-none resize-none font-mono text-sm text-slate-900 dark:text-slate-100"
          placeholder="Masukkan teks untuk di-hash..."
          value={input}
          onChange={e => {
            const val = e.target.value;
            setInput(val);
            if (!val) setHashes({});
          }}
        />
      </div>
      
      <button onClick={handleGenerate} disabled={!input} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]">
        <Play size={18} /> <span>Hasilkan Hash</span>
      </button>

      {Object.entries(hashes).length > 0 && (
        <div className="space-y-4 mt-6">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="bg-slate-50 dark:bg-neutral-900 p-4 rounded-md border border-slate-200 dark:border-slate-800 relative group pr-16">
              <h3 className="font-bold text-sm mb-1 uppercase text-slate-700 dark:text-slate-300">{algo}</h3>
              <p className="font-mono text-sm break-all text-slate-900 dark:text-slate-100">{hash}</p>
              <button 
                onClick={() => handleCopy(hash, algo)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-white dark:bg-neutral-800 p-2 rounded shadow-sm border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 focus:opacity-100"
                title={`Salin ${algo}`}
              >
                {copiedHash === algo ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PasswordGeneratorComponent = () => {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const builder = new PasswordBuilder(opts.lowercase, opts.uppercase, opts.numbers, opts.symbols, length);
    setPassword(builder.Build());
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!password) return;
    const blob = new Blob([password], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pembuat String Acak</h2>
      <div className="space-y-6 bg-slate-50 dark:bg-neutral-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
        <div>
          <label className="block mb-2 font-medium">Panjang: {length}</label>
          <input type="range" min="4" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full max-w-md accent-primary dark:accent-primary" />
        </div>
        <div className="flex flex-wrap gap-6">
          {Object.keys(opts).map(k => (
            <label key={k} className="flex items-center gap-2 capitalize font-medium cursor-pointer">
              <input type="checkbox" checked={(opts as any)[k]} onChange={e => setOpts({...opts, [k]: e.target.checked})} className="w-4 h-4 rounded text-primary" />
              {k}
            </label>
          ))}
        </div>
        <button onClick={generate} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]">
          <RefreshCw size={18} /> <span>Buat</span>
        </button>
      </div>
      
      {password && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">String yang Dihasilkan</label>
            <div className="flex items-center space-x-3">
              <button onClick={() => setPassword('')} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
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
          <textarea readOnly value={password} className="w-full p-4 font-mono text-lg border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-slate-400" />
        </div>
      )}
    </div>
  );
};

export const LoremIpsumGeneratorComponent = () => {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setOutput(generateLoremIpsum(count, unit));
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lorem-ipsum.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pembuat Lorem Ipsum</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="border border-slate-300 dark:border-slate-700 p-2 rounded-md w-24 bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-400 outline-none" />
        <select value={unit} onChange={e => setUnit(e.target.value as any)} className="border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-neutral-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-400 outline-none">
          <option value="paragraphs">Paragraf</option>
          <option value="sentences">Kalimat</option>
          <option value="words">Kata</option>
        </select>
        <button onClick={generate} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all font-medium disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]">Hasilkan</button>
      </div>

      <div className="space-y-2 mt-6">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Teks yang Dihasilkan</label>
          <div className="flex items-center space-x-3">
            <button onClick={() => setOutput('')} disabled={!output} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
              <Trash2 size={14} />
              <span>Hapus</span>
            </button>
            <button onClick={handleCopy} disabled={!output} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
            <button onClick={handleDownload} disabled={!output} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
              <Download size={14} />
              <span>Unduh</span>
            </button>
          </div>
        </div>
        <textarea readOnly value={output} className="w-full h-64 p-4 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400" />
      </div>
    </div>
  );
};

export const UuidGeneratorComponent = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const generate = () => {
    const newUuids = Array.from({length: 5}, () => crypto.randomUUID());
    setUuids(newUuids);
  };

  const handleCopy = (uuid: string, idx: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Pembuat UUID</h2>
      <button onClick={generate} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all font-medium disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]">
        Hasilkan 5 UUID
      </button>
      
      {uuids.length > 0 && (
        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">UUID yang Dihasilkan</span>
            <button onClick={() => setUuids([])} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <Trash2 size={14} />
              <span>Hapus Semua</span>
            </button>
          </div>
          {uuids.map((u, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-md font-mono text-slate-900 dark:text-slate-100 flex justify-between items-center group">
              <span>{u}</span>
              <button 
                onClick={() => handleCopy(u, i)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-white dark:bg-neutral-800 p-2 rounded shadow-sm border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Salin UUID"
              >
                {copiedId === i ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RegexTesterComponent = () => {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const test = () => {
    try {
      const r = new RegExp(regex, flags);
      const matches = Array.from(testString.matchAll(r));
      setResult({
        matchCount: matches.length,
        matches: matches.map(m => m[0])
      });
    } catch (e: any) {
      setResult({ error: e.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const val = (ev.target?.result as string) || '';
      setTestString(val);
      if (!val) setResult(null);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Penguji Regex</h2>
      <div className="flex gap-2">
        <span className="p-2 border border-slate-300 dark:border-slate-700 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 font-mono text-lg flex items-center">/</span>
        <input className="flex-1 p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-neutral-900 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Pola" value={regex} onChange={e => {
          const val = e.target.value;
          setRegex(val);
          if (!val) setResult(null);
        }} />
        <span className="p-2 border border-slate-300 dark:border-slate-700 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 font-mono text-lg flex items-center">/</span>
        <input className="w-20 p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-neutral-900 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Flag" value={flags} onChange={e => setFlags(e.target.value)} />
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Teks Uji</label>
          <div className="flex items-center space-x-3">
            <button onClick={() => { setTestString(''); setResult(null); }} disabled={!testString} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
              <Trash2 size={14} />
              <span>Hapus</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.json,.csv,.xml,.log" />
            <button onClick={() => fileInputRef.current?.click()} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              <Upload size={14} />
              <span>Unggah file</span>
            </button>
          </div>
        </div>
        <textarea className="w-full h-32 p-3 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-neutral-900 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" placeholder="Tempel teks untuk diuji..." value={testString} onChange={e => {
          const val = e.target.value;
          setTestString(val);
          if (!val) setResult(null);
        }} />
      </div>

      <button onClick={test} disabled={!regex || !testString} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all font-medium disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]">Uji Regex</button>
      
      {result && (
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-neutral-900 mt-6 relative group">
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-white dark:bg-neutral-800 p-2 rounded shadow-sm border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Salin JSON"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <pre className="font-mono text-sm text-slate-800 dark:text-slate-200 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export const CssInlinerComponent = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const htmlRef = useRef<HTMLInputElement>(null);
  const cssRef = useRef<HTMLInputElement>(null);

  const inline = () => {
    setOutput(convertCSSToInline(html, css));
  };

  const handleUploadHTML = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const val = (ev.target?.result as string) || '';
      setHtml(val);
      if (!val) setOutput('');
    };
    reader.readAsText(file);
    if (htmlRef.current) htmlRef.current.value = '';
  };

  const handleUploadCSS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const val = (ev.target?.result as string) || '';
      setCss(val);
      if (!val) setOutput('');
    };
    reader.readAsText(file);
    if (cssRef.current) cssRef.current.value = '';
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inlined.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">CSS Inliner untuk Email</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">HTML</label>
            <div className="flex items-center space-x-3">
              <button onClick={() => { setHtml(''); setOutput(''); }} disabled={!html} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
                <Trash2 size={14} />
                <span>Hapus</span>
              </button>
              <input type="file" ref={htmlRef} onChange={handleUploadHTML} className="hidden" accept=".html,.htm,.txt" />
              <button onClick={() => htmlRef.current?.click()} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <Upload size={14} />
                <span>Unggah</span>
              </button>
            </div>
          </div>
          <textarea className="w-full h-64 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 font-mono text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" placeholder="<html>...</html>" value={html} onChange={e => {
            const val = e.target.value;
            setHtml(val);
            if (!val) setOutput('');
          }} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">CSS</label>
            <div className="flex items-center space-x-3">
              <button onClick={() => { setCss(''); setOutput(''); }} disabled={!css} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-colors">
                <Trash2 size={14} />
                <span>Hapus</span>
              </button>
              <input type="file" ref={cssRef} onChange={handleUploadCSS} className="hidden" accept=".css,.txt" />
              <button onClick={() => cssRef.current?.click()} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <Upload size={14} />
                <span>Unggah</span>
              </button>
            </div>
          </div>
          <textarea className="w-full h-64 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-neutral-900 font-mono text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" placeholder="body { ... }" value={css} onChange={e => {
            const val = e.target.value;
            setCss(val);
            if (!val) setOutput('');
          }} />
        </div>
      </div>
      
      <button onClick={inline} disabled={!html && !css} className="flex items-center justify-center space-x-2 px-6 py-2 bg-transparent border border-[var(--btn-bg)] text-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-white rounded-md transition-all font-medium disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--btn-bg)]">Inline CSS</button>
      
      {output && (
        <div className="space-y-2 mt-6">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Output HTML</label>
            <div className="flex items-center space-x-3">
              <button onClick={() => setOutput('')} className="text-xs flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
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
          <textarea readOnly className="w-full h-64 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-neutral-800 font-mono text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" placeholder="Output" value={output} />
        </div>
      )}
    </div>
  );
};
