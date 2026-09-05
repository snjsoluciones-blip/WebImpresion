/**
 * Parser de STL (binario y ASCII), sin dependencias. Devuelve las posiciones de los
 * triángulos listas para three.js (BufferGeometry) y el volumen exacto de la malla
 * (suma de tetraedros con signo desde el origen — funciona para mallas cerradas y
 * es el mismo método que usan los slicers para estimar el volumen sólido).
 */

export type ParsedStl = {
  /** Float32Array de [x,y,z, x,y,z, ...] por vértice, 3 vértices por triángulo. */
  positions: Float32Array;
  triangleCount: number;
  /** Volumen sólido exacto en mm³ (asumiendo que 1 unidad del archivo = 1 mm, lo habitual). */
  volumeMm3: number;
  boundingBox: { min: [number, number, number]; max: [number, number, number] };
};

function isBinarySTL(buffer: ArrayBuffer): boolean {
  // Un STL ASCII empieza con "solid " seguido de texto; el binario tiene
  // 80 bytes de header + uint32 con la cantidad de triángulos, y el tamaño de
  // archivo tiene que calzar exacto con esa cantidad (80 + 4 + n*50 bytes).
  if (buffer.byteLength < 84) return false;
  const head = new Uint8Array(buffer, 0, Math.min(5, buffer.byteLength));
  const looksAscii = String.fromCharCode(...head).toLowerCase() === "solid";
  if (!looksAscii) return true;
  const triCount = new DataView(buffer).getUint32(80, true);
  const expected = 80 + 4 + triCount * 50;
  return expected === buffer.byteLength;
}

function parseBinary(buffer: ArrayBuffer): Float32Array {
  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  const positions = new Float32Array(triangleCount * 9);
  let offset = 84;
  for (let i = 0; i < triangleCount; i++) {
    offset += 12; // normal (no la necesitamos: se recalcula plana si hiciera falta)
    for (let v = 0; v < 3; v++) {
      const base = i * 9 + v * 3;
      positions[base] = view.getFloat32(offset, true);
      positions[base + 1] = view.getFloat32(offset + 4, true);
      positions[base + 2] = view.getFloat32(offset + 8, true);
      offset += 12;
    }
    offset += 2; // attribute byte count
  }
  return positions;
}

function parseAscii(text: string): Float32Array {
  const nums = text.match(/vertex\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)/g) ?? [];
  const positions = new Float32Array(nums.length * 3);
  nums.forEach((line, i) => {
    const m = /vertex\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)\s+([\-\d.eE+]+)/.exec(line);
    if (!m) return;
    positions[i * 3] = parseFloat(m[1]);
    positions[i * 3 + 1] = parseFloat(m[2]);
    positions[i * 3 + 2] = parseFloat(m[3]);
  });
  return positions;
}

/** Volumen con signo (divergencia): suma de (v1 · (v2 × v3)) / 6 por triángulo. */
function signedVolume(positions: Float32Array): number {
  let vol = 0;
  for (let i = 0; i < positions.length; i += 9) {
    const x1 = positions[i], y1 = positions[i + 1], z1 = positions[i + 2];
    const x2 = positions[i + 3], y2 = positions[i + 4], z2 = positions[i + 5];
    const x3 = positions[i + 6], y3 = positions[i + 7], z3 = positions[i + 8];
    vol +=
      (x1 * (y2 * z3 - z2 * y3) - y1 * (x2 * z3 - z2 * x3) + z1 * (x2 * y3 - y2 * x3)) / 6;
  }
  return Math.abs(vol);
}

function computeBoundingBox(positions: Float32Array): ParsedStl["boundingBox"] {
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      const v = positions[i + a];
      if (v < min[a]) min[a] = v;
      if (v > max[a]) max[a] = v;
    }
  }
  return { min, max };
}

export async function parseStlFile(file: File): Promise<ParsedStl> {
  const buffer = await file.arrayBuffer();
  const positions = isBinarySTL(buffer)
    ? parseBinary(buffer)
    : parseAscii(new TextDecoder().decode(buffer));
  if (positions.length === 0) {
    throw new Error("El archivo no tiene triángulos: ¿es realmente un STL?");
  }
  return {
    positions,
    triangleCount: positions.length / 9,
    volumeMm3: signedVolume(positions),
    boundingBox: computeBoundingBox(positions),
  };
}
