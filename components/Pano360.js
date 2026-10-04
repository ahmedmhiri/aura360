"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const IDLE_AUTOROTATE_DELAY = 2500; // ms of no interaction before auto-rotate resumes
const AUTOROTATE_SPEED = 0.025; // degrees per frame, roughly

// Interactive equirectangular 360° panorama viewer. Renders the image on the
// inside of a sphere and lets the user drag to look around; falls back to a
// slow auto-rotate when idle. Pure three.js (no controls add-on) to keep the
// bundle small — only longitude/latitude are tracked, no roll/zoom.
export default function Pano360({ src, className = "", onInteractingChange }) {
  const canvasRef = useRef(null);
  const onInteractingChangeRef = useRef(onInteractingChange);
  onInteractingChangeRef.current = onInteractingChange;

  useEffect(() => {
    if (!src || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // flip so the texture faces inward

    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false; // hidden until the texture arrives (no white flash)
    scene.add(mesh);

    // Panoramas are stored at up to 8192px for large screens. Phones get a
    // 4096px copy made on the fly: a full 8192×4096 texture (~170 MB of GPU
    // memory with mipmaps) can crash mobile browsers.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const maxSize = Math.min(renderer.capabilities.maxTextureSize, coarse ? 4096 : 8192);

    const loader = new THREE.TextureLoader();
    let disposed = false;
    loader.load(src, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      const img = texture.image;
      if (img.width > maxSize) {
        const scale = maxSize / img.width;
        const canvas2d = document.createElement("canvas");
        canvas2d.width = maxSize;
        canvas2d.height = Math.round(img.height * scale);
        const ctx = canvas2d.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas2d.width, canvas2d.height);
        texture.image = canvas2d;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.needsUpdate = true;
      material.map = texture;
      material.needsUpdate = true;
      mesh.visible = true;
    });

    let lon = 0;
    let lat = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastInteraction = performance.now();

    canvas.style.cursor = "grab";
    // On touch screens a sideways swipe turns the view while an up/down swipe
    // still scrolls the page (the hero viewer fills the whole screen). Without
    // this the browser claims every gesture and cancels the drag.
    canvas.style.touchAction = "pan-y";

    const onPointerDown = (e) => {
      dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
      lastX = e.clientX;
      lastY = e.clientY;
      lastInteraction = performance.now();
      canvas.style.cursor = "grabbing";
      onInteractingChangeRef.current?.(true);
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      lon -= dx * 0.15;
      lat = Math.max(-85, Math.min(85, lat + dy * 0.15));
      lastInteraction = performance.now();
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      onInteractingChangeRef.current?.(false);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    // A cancelled gesture must end the drag too, or auto-rotate never resumes.
    window.addEventListener("pointercancel", onPointerUp);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!dragging && performance.now() - lastInteraction > IDLE_AUTOROTATE_DELAY) {
        lon += AUTOROTATE_SPEED;
      }

      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      const target = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      if (dragging) onInteractingChangeRef.current?.(false);
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} />;
}
