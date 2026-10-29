"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { parseStlFile, type ParsedStl } from "./stl";

export type StlViewerProps = {
  file: File;
  onParsed?: (parsed: ParsedStl) => void;
  onError?: (message: string) => void;
  className?: string;
};

/**
 * Visor 3D del archivo STL o 3MF que el cliente sube (sin subirlo a ningún servidor: se
 * parsea y se renderiza 100% en el navegador). Escena mínima: una luz ambiente + una
 * direccional, cámara que encuadra la pieza entera, y OrbitControls para poder girarla
 * con el mouse/dedo. También devuelve el volumen exacto de la malla via `onParsed`,
 * que es lo que alimenta el cálculo de precio estimado (ver pricing.ts).
 */
export default function StlViewer({ file, onParsed, onError }: StlViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let disposed = false;
    const mount = mountRef.current;
    if (!mount) return;

    setStatus("loading");

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(1, 1.4, 1.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-1, -0.4, -1);
    scene.add(fill);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let mesh: THREE.Object3D | null = null;

    const loadObject = async (): Promise<{ object: THREE.Object3D; parsed?: ParsedStl }> => {
      if (/\.3mf$/i.test(file.name)) {
        const group = new ThreeMFLoader().parse(await file.arrayBuffer());
        const material = new THREE.MeshStandardMaterial({ color: 0xd9d9d9, metalness: 0.05, roughness: 0.55 });
        group.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = material;
        });
        // 3MF viene en Z-arriba, igual que los slicers: se acuesta para que el piso quede abajo en la escena.
        group.rotation.x = -Math.PI / 2;
        const wrap = new THREE.Group();
        wrap.add(group);
        return { object: wrap };
      }
      const parsed = await parseStlFile(file);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(parsed.positions, 3));
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({ color: 0xd9d9d9, metalness: 0.05, roughness: 0.55 });
      return { object: new THREE.Mesh(geometry, material), parsed };
    };

    loadObject()
      .then(({ object, parsed }) => {
        if (disposed) return;
        mesh = object;

        // Centrar la pieza en el origen y ubicar la cámara a una distancia que la encuadre entera.
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        object.position.sub(center);
        scene.add(object);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const distance = maxDim * 2.2;
        camera.position.set(distance, distance * 0.8, distance);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Rejilla de referencia bajo la pieza (misma escala que el archivo: mm).
        const grid = new THREE.GridHelper(maxDim * 3, 10, 0x333333, 0x1a1a1a);
        grid.position.y = box.min.y - center.y;
        scene.add(grid);

        setStatus("ready");
        if (parsed) onParsed?.(parsed);
      })
      .catch((err: unknown) => {
        if (disposed) return;
        setStatus("error");
        onError?.(err instanceof Error ? err.message : "No se pudo leer el archivo");
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      if (mesh) {
        mesh.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) {
            m.geometry.dispose();
            (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => mt.dispose());
          }
        });
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [file, onParsed, onError]);

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="h-full w-full" />
      {status === "loading" && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono-tech text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--tx-4)" }}
        >
          Cargando modelo…
        </div>
      )}
      {status === "error" && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center font-mono-tech text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--tx-4)" }}
        >
          No pudimos abrir este archivo
        </div>
      )}
    </div>
  );
}
