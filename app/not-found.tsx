"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const NotFound = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
      if (!canvasRef.current) return;
  
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
  
      // Create enhanced stars geometry
      const starsGeometry = new THREE.BufferGeometry();
      const starCount = 2000;
      const positionArray = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);
  
      for (let i = 0; i < starCount; i++) {
        positionArray[i * 3] = (Math.random() - 0.5) * 2000;
        positionArray[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positionArray[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        sizes[i] = Math.random() * 2 + 0.5;
      }
  
      starsGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positionArray, 3)
      );
      starsGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(sizes, 1)
      );
  
      // Enhanced color palette for stars
      const colors = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const colorType = Math.random();
        let r, g, b;
        
        if (colorType < 0.7) {
          r = 0.8 + Math.random() * 0.2;
          g = 0.8 + Math.random() * 0.2;
          b = 1.0;
        } else if (colorType < 0.9) {
          r = 0.8 + Math.random() * 0.2;
          g = 0.4 + Math.random() * 0.3;
          b = 1.0;
        } else {
          r = 1.0;
          g = 0.8 + Math.random() * 0.2;
          b = 0.4 + Math.random() * 0.3;
        }
        
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }
  
      starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  
      const starsMaterial = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
  
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      camera.position.z = 10;
  
      let mouseX = 0;
      let mouseY = 0;
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);
  
      const animate = () => {
        requestAnimationFrame(animate);
        
        stars.rotation.y += 0.001 + mouseX * 0.0005;
        stars.rotation.x += 0.0005 + mouseY * 0.0003;
        stars.position.y = Math.sin(Date.now() * 0.0005) * 0.5;
        
        renderer.render(scene, camera);
      };
  
      animate();
  
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        starsGeometry.dispose();
        starsMaterial.dispose();
      };
    }, []);



  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 ">
        <motion.div
          className="text-center bg-gray-800/10 backdrop-blur-md p-20 rounded-xl shadow-2xl border border-gray-700/30 "
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent"
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(96, 165, 250, 0.3))",
                "drop-shadow(0 0 40px rgba(147, 51, 234, 0.4))",
                "drop-shadow(0 0 20px rgba(96, 165, 250, 0.3))"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            404
          </motion.h1>
          
          <motion.div
            className="space-y-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
              Page Not Found
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              The page you&apos;re looking for has drifted away into space.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a href="/">
              <motion.a
                className="inline-block bg-gray-800/40 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-2xl hover:scale-105 hover:border-blue-500/50 "
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Return Home
              </motion.a>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;