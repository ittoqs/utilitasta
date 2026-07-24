import GenericTextUI from './GenericTextUI';
import { convertCSVtoJSON } from '../features/csv-to-json';
import { convertTSVtoJSON } from '../features/tsv-to-json';
import { toBase64, fromBase64 } from '../features/base-64';
import { unserialize } from '../features/unserializer';
import { parseJsonLines } from '../features/jsonl-validator';
import { encode, decode } from '../features/url-encoder';
import { formatOutput } from '../features/timestamp-to-date';
import { convertQueryParamsToJSON } from '../features/query-prm-to-json';
import { convertToRGB } from '../features/hex-to-rgb';
import { envToToml } from '../features/env-to-toml';
import { convertJSONtoCSV } from '../features/json-to-csv';
import { convertJSONtoTSV } from '../features/json-to-tsv';
import { minifySQL } from '../features/sql-minifier';
import { xmlToJson } from '../features/xml-to-json';
import { decodeJWT } from '../features/jwt-parser';
import yaml from 'js-yaml';

const withErrorHandling = (fn: (input: string, mode?: string) => any) => (input: string, mode?: string) => {
  if (!input.trim()) return '';
  return fn(input, mode);
};

export const CsvToJson = () => (
  <GenericTextUI
    title="CSV ke JSON"
    description="Konversi data CSV ke format JSON."
    inputLabel="Data CSV"
    outputLabel="Output JSON"
    onExecute={withErrorHandling((input) => convertCSVtoJSON(input, false))}
  />
);

export const TsvToJson = () => (
  <GenericTextUI
    title="TSV ke JSON"
    description="Konversi data TSV ke format JSON."
    inputLabel="Data TSV"
    outputLabel="Output JSON"
    onExecute={withErrorHandling((input) => convertTSVtoJSON(input, false))}
  />
);

export const Base64Encoder = () => (
  <GenericTextUI
    title="Enkode/Dekode Base64"
    description="Enkode teks ke Base64 atau dekode dari Base64."
    inputLabel="Input Data"
    outputLabel="Hasil"
    modes={[
      { label: 'Enkode', value: 'encode' },
      { label: 'Dekode', value: 'decode' }
    ]}
    onExecute={withErrorHandling((input, mode) => {
      if (mode === 'decode') {
        return fromBase64(input);
      }
      return toBase64(input);
    })}
  />
);

export const JsonFormatter = () => (
  <GenericTextUI
    title="Format JSON"
    description="Format dan percantik data JSON."
    onExecute={withErrorHandling((input) => JSON.stringify(JSON.parse(input), null, 2))}
  />
);

export const UnserializerComponent = () => (
  <GenericTextUI
    title="PHP Unserializer"
    description="Urai string PHP terdeserialisasi ke format JSON."
    onExecute={withErrorHandling((input) => {
      const result = unserialize(input);
      return JSON.stringify(result, null, 2);
    })}
  />
);

export const JsonlValidatorComponent = () => (
  <GenericTextUI
    title="Validasi JSONL"
    description="Validasi baris JSONL dan temukan baris yang rusak."
    onExecute={withErrorHandling((input) => {
      const result = parseJsonLines(input);
      return JSON.stringify(result, null, 2);
    })}
  />
);

export const YamlToJson = () => (
  <GenericTextUI
    title="YAML ke JSON"
    description="Konversi YAML ke JSON."
    onExecute={withErrorHandling((input) => JSON.stringify(yaml.load(input), null, 2))}
  />
);

export const JsonToYaml = () => (
  <GenericTextUI
    title="JSON ke YAML"
    description="Konversi JSON ke YAML."
    onExecute={withErrorHandling((input) => yaml.dump(JSON.parse(input)))}
  />
);

export const UrlEncoderComponent = () => (
  <GenericTextUI
    title="Enkode/Dekode URL"
    description="Enkode atau dekode URL."
    modes={[
      { label: 'Enkode', value: 'encode' },
      { label: 'Dekode', value: 'decode' }
    ]}
    onExecute={withErrorHandling((input, mode) => {
      if (mode === 'decode') {
        return decode(input);
      }
      return encode(input);
    })}
  />
);

export const TimestampToDateComponent = () => (
  <GenericTextUI
    title="Konversi Timestamp ke Tanggal"
    description="Konversi timestamp Unix ke tanggal yang mudah dibaca."
    onExecute={withErrorHandling((input) => formatOutput(input))}
  />
);

export const QueryParamsToJsonComponent = () => (
  <GenericTextUI
    title="Parameter Query ke JSON"
    description="Konversi parameter query URL ke JSON."
    onExecute={withErrorHandling((input) => JSON.stringify(convertQueryParamsToJSON(input), null, 2))}
  />
);

export const HexToRgbComponent = () => (
  <GenericTextUI
    title="Konversi HEX ke RGB"
    description="Konversi warna HEX ke RGB."
    onExecute={withErrorHandling((input) => JSON.stringify(convertToRGB(input), null, 2))}
  />
);

export const EnvToTomlComponent = () => (
  <GenericTextUI
    title="Konversi .env ke netlify.toml"
    description="Ubah variabel .env ke format netlify.toml."
    onExecute={withErrorHandling((input) => envToToml(input))}
  />
);

export const JsonToCsvComponent = () => (
  <GenericTextUI
    title="JSON ke CSV"
    description="Konversi array objek JSON ke CSV."
    onExecute={withErrorHandling((input) => convertJSONtoCSV(input))}
  />
);

export const JsonToTsvComponent = () => (
  <GenericTextUI
    title="JSON ke TSV"
    description="Konversi array objek JSON ke TSV."
    onExecute={withErrorHandling((input) => convertJSONtoTSV(input))}
  />
);

export const SqlMinifierComponent = () => (
  <GenericTextUI
    title="Minifikasi SQL"
    description="Minifikasi kueri SQL."
    onExecute={withErrorHandling((input) => minifySQL(input))}
  />
);

export const XmlToJsonComponent = () => (
  <GenericTextUI
    title="XML ke JSON"
    description="Konversi data XML ke format JSON."
    onExecute={withErrorHandling((input) => xmlToJson(input))}
  />
);

export const JwtParserComponent = () => (
  <GenericTextUI
    title="Pengurai JWT"
    description="Urai token JWT."
    onExecute={withErrorHandling((input) => {
      const result = decodeJWT(input);
      return JSON.stringify(result, null, 2);
    })}
  />
);

export const NumberBaseChangerComponent = () => (
  <GenericTextUI
    title="Pengubah Basis Angka"
    description="Format: nilai,basisAwal,basisTujuan (contoh: 15,10,16)"
    onExecute={withErrorHandling((input) => {
      const parts = input.split(',');
      if (parts.length !== 3) throw new Error("Format harus berupa: nilai,basisAwal,basisTujuan");
      const [val, fromBase, toBase] = parts;
      const parsed = parseInt(val.trim(), parseInt(fromBase.trim()));
      if (isNaN(parsed)) throw new Error("Angka tidak valid");
      return parsed.toString(parseInt(toBase.trim()));
    })}
  />
);
