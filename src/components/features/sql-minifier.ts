/**
 * SQL Minifier utility that safely removes comments and unnecessary whitespace
 * while preserving string literals and essential SQL syntax
 */

/**
 * Minifies SQL by removing comments and unnecessary whitespace while preserving string literals
 */
export function minifySQL(sql: string): string {
  if (typeof sql !== "string") {
    throw new Error("Input must be a string");
  }

  if (sql.trim() === "") {
    return "";
  }

  try {
    let result = "";
    let i = 0;

    while (i < sql.length) {
      const char = sql[i];

      // Tangani string dengan tanda kutip tunggal
      if (char === "'") {
        let stringContent = "'";
        i++; // lewati tanda kutip pembuka

        while (i < sql.length) {
          stringContent += sql[i];
          if (sql[i] === "'") {
            // Periksa apakah itu di-escape (tanda kutip ganda)
            if (i + 1 < sql.length && sql[i + 1] === "'") {
              i++; // lewati tanda kutip pertama
              stringContent += sql[i]; // tambahkan tanda kutip kedua
            } else {
              // Akhir string
              break;
            }
          }
          i++;
        }

        result += stringContent;
        i++;
        continue;
      }

      // Tangani string dengan tanda kutip ganda
      if (char === '"') {
        let stringContent = '"';
        i++; // lewati tanda kutip pembuka

        while (i < sql.length) {
          stringContent += sql[i];
          if (sql[i] === '"') {
            // Periksa apakah itu di-escape (tanda kutip ganda)
            if (i + 1 < sql.length && sql[i + 1] === '"') {
              i++; // lewati tanda kutip pertama
              stringContent += sql[i]; // tambahkan tanda kutip kedua
            } else {
              // Akhir string
              break;
            }
          }
          i++;
        }

        result += stringContent;
        i++;
        continue;
      }

      // Tangani komentar multi-baris /* ... */
      if (char === "/" && i + 1 < sql.length && sql[i + 1] === "*") {
        i += 2; // lewati /*

        // Cari penutup */ atau akhir string
        let found = false;
        while (i < sql.length - 1) {
          if (sql[i] === "*" && sql[i + 1] === "/") {
            i += 2; // lewati */
            found = true;
            break;
          }
          i++;
        }

        // Jika kita tidak menemukan penutup */, kita telah menggunakan semuanya sampai akhir
        if (!found) {
          i = sql.length;
        }

        // Tambahkan spasi jika kita menghapus komentar di antara kata-kata
        if (result.length > 0 && /\w/.test(result.slice(-1))) {
          // Lihat ke depan untuk melihat apakah karakter non-spasi berikutnya adalah karakter kata
          let j = i;
          while (j < sql.length && /\s/.test(sql[j])) {
            j++;
          }
          if (j < sql.length && /\w/.test(sql[j])) {
            result += " ";
          }
        }
        continue;
      }

      // Tangani komentar baris tunggal --
      if (char === "-" && i + 1 < sql.length && sql[i + 1] === "-") {
        // Cari akhir baris atau akhir string
        while (i < sql.length && sql[i] !== "\n" && sql[i] !== "\r") {
          i++;
        }

        // Tambahkan spasi jika kita menghapus komentar di antara kata-kata dan ada lebih banyak konten
        if (result.length > 0 && /\w/.test(result.slice(-1))) {
          // Lihat ke depan untuk melihat apakah ada lebih banyak konten setelah baris baru
          let j = i;
          while (j < sql.length && /[\r\n\s]/.test(sql[j])) {
            j++;
          }
          if (j < sql.length && /\w/.test(sql[j])) {
            result += " ";
          }
        }
        continue;
      }

      // Tangani pengutipan pengenal (backtick) dan whitespace
      if (/\s/.test(char)) {
        // Ganti beberapa karakter spasi dengan spasi tunggal
        // tetapi hanya jika kita belum memiliki spasi di akhir
        if (result.length > 0 && !result.endsWith(" ")) {
          result += " ";
        }

        // Lewati spasi tambahan
        while (i + 1 < sql.length && /\s/.test(sql[i + 1])) {
          i++;
        }
      } else {
        // Regular character
        result += char;
      }

      i++;
    }

    // Final cleanup
    return result.trim();
  } catch (error) {
    throw new Error(
      `Failed to minify SQL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        cause: error,
      }
    );
  }
}

/**
 * Validates that the input is a valid string for SQL minification
 */
export function validateSQLInput(input: string): {
  isValid: boolean;
  error?: string;
} {
  if (typeof input !== "string") {
    return { isValid: false, error: "Input must be a string" };
  }

  if (input.trim() === "") {
    return { isValid: false, error: "Input cannot be empty" };
  }

  // Basic validation - check for unmatched quotes
  let singleQuoteCount = 0;
  let doubleQuoteCount = 0;
  let i = 0;

  while (i < input.length) {
    if (input[i] === "'") {
      if (i + 1 < input.length && input[i + 1] === "'") {
        // Lewati tanda kutip yang di-escape
        i += 2;
      } else {
        singleQuoteCount++;
        i++;
      }
    } else if (input[i] === '"') {
      if (i + 1 < input.length && input[i + 1] === '"') {
        // Lewati tanda kutip yang di-escape
        i += 2;
      } else {
        doubleQuoteCount++;
        i++;
      }
    } else {
      i++;
    }
  }

  if (singleQuoteCount % 2 !== 0) {
    return { isValid: false, error: "Unmatched single quote" };
  }

  if (doubleQuoteCount % 2 !== 0) {
    return { isValid: false, error: "Unmatched double quote" };
  }

  return { isValid: true };
}
