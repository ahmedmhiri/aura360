"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const IDLE_AUTOROTATE_DELAY = 2500; // ms of no interaction before auto-rotate resumes
const AUTOROTATE_SPEED = 0.025; // degrees per frame, roughly

// Interactive equirectangular 360° panorama viewer. Renders the image on the
// inside of a sphere and lets the user drag to look around; falls back to a
// slow auto-rotate when idle. Pure three.js (no controls add-on) to keep the
// bundle small — only longitude/latitude are tracked, no roll/zoom.
export default function Pano360({ src, className = "" }) {
  const canvasRef = useRef(null);

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
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    let disposed = false;
    loader.load(src, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      if (disposed) {
        texture.dispose();
        return;
      }
      material.map = texture;
      material.needsUpdate = true;
    });

    let lon = 0;
    let lat = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastInteraction = performance.now();

    canvas.style.cursor = "grab";

    const onPointerDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastInteraction = performance.now();
      canvas.style.cursor = "grabbing";
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
      dragging = false;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

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
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} />;
}
