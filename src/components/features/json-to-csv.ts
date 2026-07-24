import Papa from "papaparse";

export function convertJSONtoCSV(input: string | object): string {
  try {
    let data: object[] = [];

    if (typeof input === "string") {
      data = JSON.parse(input);
    } else if (Array.isArray(input)) {
      data = input;
    } else if (typeof input === "object") {
      data = [input];
    } else {
      throw new Error("Input must be a JSON string or an object.");
    }

    const config = {
      header: true, // Sertakan header dalam CSV
      delimiter: ",", // Gunakan koma sebagai pemisah
      newline: "\r\n", // Gunakan carriage return dan baris baru untuk baris baru
      quoteChar: '"', // Gunakan tanda kutip ganda untuk mengutip bidang
      escapeChar: '"', // Gunakan tanda kutip ganda untuk melarikan bidang kutipan
      skipEmptyLines: true, // Lewati baris kosong dalam output
    };

    const csv = Papa.unparse(data, config);
    return csv;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message, { cause: error });
    } else {
      throw new Error("Failed to convert JSON to CSV: Unknown error", {
        cause: error,
      });
    }
  }
}
