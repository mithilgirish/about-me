"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

// --- Improved Multi-Layered Parallax Three.js Hook ---
const useStarfield = (canvasRef: React.RefObject<HTMLCanvasElement>, scrollY: MotionValue<number>) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starLayers: THREE.Points[] = [];
    const layerData = [
      { count: 1800, size: 0.5, z: -1000, color: 0x888888, parallaxFactor: 0.03 },
      { count: 1200, size: 0.8, z: -500, color: 0xcccccc, parallaxFactor: 0.08 },
      { count: 600, size: 1.3, z: -200, color: 0xffffff, parallaxFactor: 0.18 },
    ];

    layerData.forEach(layer => {
      const starsGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(layer.count * 3);
      for (let i = 0; i < layer.count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 1200;
        positions[i3 + 1] = (Math.random() - 0.5) * 1200;
        positions[i3 + 2] = (Math.random() - 0.5) * 1200 + layer.z;
      }
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const starsMaterial = new THREE.PointsMaterial({
        size: layer.size,
        color: layer.color,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
      });
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      starLayers.push(starField);
      scene.add(starField);
    });

    const mouse = new THREE.Vector2();
    let isTouch = false;
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      isTouch = true;
      const touch = event.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const currentScroll = scrollY.get();

      // Multi-layered parallax depth translation on scroll
      starLayers[0].position.y = currentScroll * layerData[0].parallaxFactor;
      starLayers[1].position.y = currentScroll * layerData[1].parallaxFactor;
      starLayers[2].position.y = currentScroll * layerData[2].parallaxFactor;

      // Mouse Parallax & smooth tilt
      if (!isTouch) {
        camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.025;
        camera.position.z += (-mouse.y * 0.4 - camera.position.z + 1) * 0.025;
      }

      starLayers[0].rotation.y = elapsedTime * 0.006;
      starLayers[1].rotation.y = elapsedTime * 0.012;
      starLayers[2].rotation.y = elapsedTime * 0.022;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
    };
  }, [canvasRef, scrollY]);
};

interface SectionProps {
  children: React.ReactNode;
  id: string;
  indexCode?: string;
  sectionLabel?: string;
}

const Section: React.FC<SectionProps> = ({ children, id, indexCode, sectionLabel }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 45 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 45 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-20"
    >
      <div className="micro-glass-card rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        

        <div className="relative z-10 text-center">
          {children}
        </div>
      </div>
    </motion.section>
  );
};

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollY } = useScroll();
  
  // Smooth Spring physics for buttery-smooth Parallax
  const smoothScrollY = useSpring(scrollY, { stiffness: 70, damping: 22, restDelta: 0.001 });

  useStarfield(canvasRef, smoothScrollY);

  const heroOpacity = useTransform(smoothScrollY, [0, 350], [1, 0]);
  const heroScale = useTransform(smoothScrollY, [0, 350], [1, 0.94]);

  // Enhanced Background Parallax Transforms
  const bgY = useTransform(smoothScrollY, [0, 1000], [0, 320]);
  const bgScale = useTransform(smoothScrollY, [0, 1000], [1, 1.22]);
  const bgOpacity = useTransform(smoothScrollY, [0, 500, 1200], [0.35, 0.45, 0.2]);

  const [showScrollUpArrow, setShowScrollUpArrow] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUpArrow(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      {/* Enhanced Parallax Foreground Image */}
      <motion.img
        src="/images/background.png"
        alt="decorative space background"
        className="fixed bottom-0 left-0 w-full h-auto object-cover z-20 pointer-events-none mix-blend-screen"
        style={{
          y: bgY,
          scale: bgScale,
          opacity: bgOpacity
        }}
      />

      <main className="relative z-20">
        <div className="h-screen flex flex-col justify-center items-center">
          <motion.div
            className="text-center px-4 max-w-4xl w-full mt-[-140px]"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <motion.h1
              className="text-6xl sm:text-7xl md:text-9xl font-bold mb-6 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, delay: 0.5 }}
            >
              <span className="relative inline-block">
                <span
                  className="relative text-white"
                  style={{ textShadow: `0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.1)` }}
                >
                  Mithil Girish
                </span>
              </span>
            </motion.h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-center relative z-30 mb-4">
              <motion.span
                className="block text-gray-200 font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 1.2 }}
              >
                Full Stack Developer & Data Scientist
              </motion.span>
              <motion.span
                className="block text-lg md:text-xl text-gray-400 mt-2 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.8, delay: 1.8 }}
              >
                Final year at VIT Chennai
              </motion.span>
            </p>

            <motion.a
              href="https://freelance.mithilgirish.dev/query"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-1 inline-flex items-center space-x-2 px-7 py-3 rounded-lg
                bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.18)]
                shadow-[0_8px_32px_rgba(31,38,135,0.37)] backdrop-blur-md
                transition-all duration-300 hover:border-white/40 font-mono text-sm tracking-wide
              "
              whileHover={{ scale: 1.04, background: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 2.0, ease: "easeOut" }}
            >
              <span>Let&apos;s Build Together</span>
              <ArrowUpRight size={15} />
            </motion.a>
          </motion.div>

          <motion.div
            className="absolute flex justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.3 }}
          >
            <motion.button
              aria-label="Scroll down to content"
              className="focus:outline-none p-2 touch-manipulation hover:text-blue-400 transition-colors mt-52 z-30"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronDown size={32} strokeWidth={2} />
            </motion.button>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-16">
          <Section id="about" indexCode="01" sectionLabel="About Me">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto font-light leading-relaxed">
              An engineer and data scientist building advanced systems spanning Edge AI, decentralized architectures, and full-stack web platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/about">
                <motion.button
                  aria-label="Learn more about me"
                  className="px-6 py-2.5 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300 font-mono text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </Link>
              <Link href="/experience">
                <motion.button
                  aria-label="View my experience"
                  className="px-6 py-2.5 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300 font-mono text-sm text-gray-300 hover:text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Experience
                </motion.button>
              </Link>
            </div>
          </Section>

          <Section id="projects" indexCode="02" sectionLabel="Projects">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Projects</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto font-light leading-relaxed">
              From distributed Edge AI systems and decentralized architectures to robust infrastructure for AI agents, explore a collection of projects that push the boundaries of modern engineering.
            </p>
            <Link href="/projects">
              <motion.button
                aria-label="View my projects"
                className="px-6 py-2.5 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300 font-mono text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.button>
            </Link>
          </Section>

          <Section id="gallery" indexCode="03" sectionLabel="Gallery">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Gallery</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto font-light leading-relaxed">
              Explore my high-resolution photography portfolio. With over 700,000 global views on Unsplash, this is where technical precision meets creative perspective.
            </p>
            <Link href="/gallery">
              <motion.button
                aria-label="View my gallery"
                className="px-6 py-2.5 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300 font-mono text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Gallery
              </motion.button>
            </Link>
          </Section>
        </div>
      </main>

      {showScrollUpArrow && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 cursor-pointer transition-all duration-300"
          onClick={scrollToTop}
        >
          <ChevronUp size={32} className="text-white hover:text-gray-400 transition" />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
