/**
 * Mengonversi string XML ke objek JSON
 * @param xml - String XML untuk dikonversi
 * @returns Objek JSON yang telah diurai
 */
export function xmlToJson(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  // Periksa kesalahan penguraian
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid XML");
  }

  function nodeToJson(node: Node): unknown {
    const obj: Record<string, unknown> = {};

    // Tangani node elemen
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // Tangani node anak terlebih dahulu
      const children: Record<string, unknown[]> = {};
      let hasTextContent = false;
      let textContent = "";

      if (element.hasChildNodes()) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];

          // Node teks
          if (
            child.nodeType === Node.TEXT_NODE ||
            child.nodeType === Node.CDATA_SECTION_NODE
          ) {
            const text = child.textContent?.trim();
            if (text) {
              hasTextContent = true;
              textContent = text;
            }
          }
          // Node elemen
          else if (child.nodeType === Node.ELEMENT_NODE) {
            const childName = child.nodeName;
            const childValue = nodeToJson(child);

            if (!children[childName]) {
              children[childName] = [];
            }
            children[childName].push(childValue);
          }
        }
      }

      // Tambahkan elemen anak ke objek
      for (const [name, values] of Object.entries(children)) {
        if (values.length === 1) {
          obj[name] = values[0];
        } else {
          obj[name] = values;
        }
      }

      // Tangani konten teks
      if (hasTextContent) {
        // Jika hanya konten teks dan tidak ada atribut, kembalikan teks secara langsung
        if (Object.keys(obj).length === 0 && element.attributes.length === 0) {
          return textContent;
        }
        // Jika memiliki atribut atau anak, tambahkan sebagai #text
        if (element.attributes.length > 0 || Object.keys(obj).length > 0) {
          obj["#text"] = textContent;
        }
      }

      // Tambahkan atribut sebagai objek @attributes
      if (element.attributes.length > 0) {
        const attributes: Record<string, string> = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          attributes[attr.nodeName] = attr.nodeValue || "";
        }
        obj["@attributes"] = attributes;
      }

      // Jika elemen kosong, kembalikan null
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        return null;
      }
    }

    return obj;
  }

  const root = doc.documentElement;
  return { [root.nodeName]: nodeToJson(root) };
}
