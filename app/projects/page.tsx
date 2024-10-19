"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import * as THREE from "three";
import Link from "next/link";

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

export default function Projects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const projects = [
    {
      title: "Crop-Core_Tech",
      description:
        "A crop yield prediction app using machine learning, with API integration and state rainfall data.",
      github: "https://github.com/yourusername/Crop-Core_Tech",
    },
    {
      title: "Pill-Dispenser",
      description:
        "A pill dispenser system controlled via a React app, integrated with ESP32 and servo motors.",
      github: "https://github.com/yourusername/Pill-Dispenser",
    },
    {
      title: "Treximo",
      description:
        "A game built using Pygame, focusing on a unique interactive experience.",
      github: "https://github.com/yourusername/Treximo",
    },
    {
      title: "Music-Player",
      description:
        "A Python music player application built with a simple UI for playing local music files.",
      github: "https://github.com/yourusername/Music-Player",
    },
    {
      title: "To-Do App",
      description:
        "A task management app built with React, featuring task sorting, due date management, and a clean UI.",
      github: "https://github.com/yourusername/To-Do-App",
    },
  ];

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create stars geometry
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500; // Increased star count
    const positionArray = new Float32Array(starCount * 3);
    const sizes = [];

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000; // Spread the stars in 3D space
      sizes.push(Math.random() * 1.5 + 0.5); // Vary star size
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );

    // Create color gradient for stars
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = Math.random();
      const g = Math.random() * 0.5;
      const b = Math.random() * 0.7 + 0.3;
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5, // Set a larger size
      vertexColors: true, // Enable color gradient
      transparent: true,
      opacity: 0.8, // Slight transparency for depth
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    camera.position.z = 7; // Adjusted for better view

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.002; // Faster rotation for a more dynamic look
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <Section id="projects-intro">
            <motion.h1
              className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              My Projects
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Explore a selection of my projects showcasing my skills in web
              development, machine learning, and more. Click on any project to
              view its GitHub repository.
            </motion.p>
          </Section>

          <Section id="project-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Link href={project.github} key={index} passHref>
                  <motion.div
                    className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg cursor-pointer transition-all duration-300 hover:bg-opacity-70 hover:shadow-xl hover:scale-105"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h2 className="text-2xl font-semibold mb-3 text-blue-400">
                      {project.title}
                    </h2>
                    <p className="text-gray-300">{project.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
