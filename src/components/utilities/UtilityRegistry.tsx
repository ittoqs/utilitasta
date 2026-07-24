import React, { Suspense } from 'react';
import * as Simple from './SimpleTextUtilities';
import * as Custom from './CustomUtilities';
import * as Complex from './ComplexUtilities';
import * as FileBased from './FileBasedUtilities';
import * as DataViewer from './DataViewerUtilities';

const Registry: Record<string, React.FC> = {
  // Teks Sederhana
  'csv-to-json': Simple.CsvToJson,
  'tsv-to-json': Simple.TsvToJson,
  'base-64-encoder': Simple.Base64Encoder,
  'json-formatter': Simple.JsonFormatter,
  'unserializer': Simple.UnserializerComponent,
  'jsonl-validator': Simple.JsonlValidatorComponent,
  'yaml-to-json': Simple.YamlToJson,
  'json-to-yaml': Simple.JsonToYaml,
  'url-encoder': Simple.UrlEncoderComponent,
  'timestamp-to-date': Simple.TimestampToDateComponent,
  'query-params-to-json': Simple.QueryParamsToJsonComponent,
  'hex-to-rgb': Simple.HexToRgbComponent,
  'env-to-netlify-toml': Simple.EnvToTomlComponent,
  'json-to-csv': Simple.JsonToCsvComponent,
  'json-to-tsv': Simple.JsonToTsvComponent,
  'sql-minifier': Simple.SqlMinifierComponent,
  'xml-to-json': Simple.XmlToJsonComponent,
  'jwt-parser': Simple.JwtParserComponent,
  'number-base-changer': Simple.NumberBaseChangerComponent,

  // Teks Kustom
  'hash-generator': Custom.HashGeneratorComponent,
  'random-string-generator': Custom.PasswordGeneratorComponent,
  'lorem-ipsum-generator': Custom.LoremIpsumGeneratorComponent,
  'uuid-generator': Custom.UuidGeneratorComponent,
  'regex-tester': Custom.RegexTesterComponent,
  'css-inliner-for-email': Custom.CssInlinerComponent,

  // Kompleks
  'wcag-color-contrast-checker': Complex.WcagColorContrastComponent,
  'css-units-converter': Complex.CssUnitsConverterComponent,
  'svg-viewer': Complex.SvgViewerComponent,

  // Berbasis File
  'image-to-base64': FileBased.ImageToBase64Component,
  'base64-to-image': FileBased.Base64ToImageComponent,
  'image-resizer': FileBased.ImageResizerComponent,
  'webp-converter': FileBased.WebpConverterComponent,

  // Data / Tambahan
  'csv-file-viewer': DataViewer.CsvFileViewerComponent,
  'har-file-viewer': DataViewer.HarFileViewerComponent,
  'internet-speed-test': DataViewer.InternetSpeedTestComponent,
  'file-integrity-checker': DataViewer.FileIntegrityCheckerComponent,
};

export default function UtilityRegistry({ id }: { id: string }) {
  const Component = Registry[id];
  
  if (!Component) {
    return (
      <div className="container mx-auto px-4 my-10 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Utility: {id}</h1>
        <p className="text-slate-500 dark:text-slate-400">Fitur sedang dalam pengembangan...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 my-10 animate-fade-in">
      <Suspense fallback={<div className="text-center py-20 text-slate-500 dark:text-slate-400 font-medium">Memuat utilitas...</div>}>
        <Component />
      </Suspense>
    </div>
  );
}
