/**
 * Fungsi `encode` mencoba untuk mengenkode string input yang diberikan sebagai URL.
 * Jika input adalah URL yang valid, ia menggunakan `encodeURI` untuk mengenkode URL tersebut.
 * Jika input bukan URL yang valid, ia beralih ke `encodeURIComponent` untuk mengenkode input sebagai string biasa.
 *
 * Fungsi `decode` mencoba untuk mendekode string input yang diberikan.
 * Jika input adalah URL yang valid dengan protokol (http atau https), ia menggunakan `decodeURI` untuk mendekode URL tersebut.
 * Jika input tidak memiliki protokol atau bukan URL yang valid, ia beralih ke `decodeURIComponent` untuk mendekode input sebagai string biasa.
 * Jika dekode gagal, ia mengembalikan pesan kegagalan.
 */

export function encode(input: string): string {
  try {
    new URL(input);
    return encodeURI(input);
  } catch {
    return encodeURIComponent(input);
  }
}

export function decode(input: string): string {
  try {
    const hasProtocol = /^https?:\/\//i.test(input);

    if (hasProtocol) {
      new URL(input);
      return decodeURI(input);
    } else {
      return decodeURIComponent(input);
    }
  } catch {
    return "Failed to decode string";
  }
}
