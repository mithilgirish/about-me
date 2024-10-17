"use client";
import React, { useEffect, useRef } from 'react';
import { motion} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';

interface SectionProps {
  children: React.ReactNode;
  id: string;
}

const Section: React.FC<SectionProps> = ({ children, id }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      {children}
    </motion.section>
  );
};

export default function About() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <Section id="about-intro">
            <motion.h1 
              className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              About Me
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Hello! I&apos;m Mithil Girish, a versatile full-stack web and mobile app developer, graphic designer, photographer, 
              and technology enthusiast. My passion lies in combining creativity with technical expertise to build user-centric 
              digital experiences. My journey has taken me across domains, including AI-powered apps, game development, IoT (Internet of Things) solutions, 
              and responsive web and mobile applications. I thrive on challenges that integrate hardware and software to solve real-world problems.
            </motion.p>
          </Section>

          <Section id="skills">
            <h2 className="text-4xl font-semibold mb-4">My Skills</h2>
            <ul className="text-lg text-gray-300 mb-8 list-disc list-inside">
              <li>Full Stack Web Development (React, Node.js, Django, Next.js)</li>
              <li>Mobile App Development (React Native, Expo)</li>
              <li>Backend Development (Express.js, Django Rest Framework)</li>
              <li>UI/UX Design and Responsive Web Design</li>
              <li>Graphic Design (Adobe Photoshop, UI Design)</li>
              <li>Photography </li>
              <li>Game Development (Unity, C#)</li>
              <li>IoT & Hardware Integration (ESP32, Arduino)</li>
            </ul>
          </Section>

        </div>
      </main>
    </div>
  );
}
