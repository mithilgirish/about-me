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

interface Project {
  title: string;
  description: string;
  github: string;
  liveLink?: string; // Optional deployed link
  tech: string[];
  type: "personal" | "work"; // Distinguish between personal projects and work
  organization?: string; // For work projects
}

const Section: React.FC<SectionProps> = ({ children, id }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,

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

  const projects: Project[] = [
    // Personal Projects
    {
      title: "Crop-Core_Tech",
      description:
        "A comprehensive crop yield prediction application leveraging machine learning algorithms, with seamless API integration and real-time state rainfall data analysis.",
      github: "https://github.com/mithilgirish/Crop-Core_Tech",
      tech: ["Python", "Machine Learning", "API", "Data Analysis"],
      type: "personal"
    },
    {
      title: "CareerTrack",
      description:
        "The Smartest Way to Learn, Prepare & Succeed! An AI-powered career guidance platform.",
      github: "https://github.com/mithilgirish/careertrack",
      liveLink: "https://careertrack-one.vercel.app",
      tech: ["Next.js", "FastAPI", "Generative AI", "Supabase"],
      type: "personal"
    },
    {
      title: "Obscura",
      description:
        "Obscura is a sleek, full-stack app to track your personal book collection. Securely add, edit, and manage books with notes—each tied to your account.",
      github: "https://github.com/mithilgirish/obscura",
      liveLink: "https://obscura.mithilgirish.dev/",
      tech: ["Next.js", "TypeScript", "MongoDB", "Clerk"],
      type: "personal"
    },
    {
      title: "Pill-Dispenser",
      description:
        "An intelligent pill dispenser system with React-based control interface, integrated with ESP32 microcontroller and precision servo motors for automated medication management.",
      github: "https://github.com/mithilgirish/Pill-Dispenser",
      tech: ["React", "ESP32", "IoT", "Hardware"],
      type: "personal"
    },
    {
      title: "Treximo",
      description:
        "An engaging interactive game built with Pygame, featuring unique gameplay mechanics and immersive user experience with custom graphics and sound effects.",
      github: "https://github.com/mithilgirish/Treximo",
      tech: ["Python", "Pygame", "Game Development"],
      type: "personal"
    },
    {
      title: "Music-Player",
      description:
        "A feature-rich Python music player application with intuitive UI, playlist management, audio visualization, and support for multiple audio formats.",
      github: "https://github.com/mithilgirish/Music-Player",
      tech: ["Python", "Tkinter", "Audio Processing"],
      type: "personal"
    },
    {
      title: "FitFusion",
      description:
        "An AI-powered fitness and health monitoring mobile app built with React Native.",
      github: "https://github.com/mithilgirish/FitFusion",
      tech: ["React Native", "HealthConnect", "GenAI", "Clerk"],
      type: "personal"
    },
    
    {
      title: "InstaCut",
      description:
        "InstaCut is a sleek AI-powered web app that instantly removes image backgrounds. Built with Vite, Tailwind, and ShadCN/UI",
      github: "https://github.com/mithilgirish/InstaCut",
      liveLink: "https://instacut.mithilgirish.dev/",
      tech: ["React", "Tailwind", "ShadCN/UI", "Vite"],
      type: "personal"
    },
    {
      title: "Mouse Run",
      description:
        "Mouse Run is a fast-paced Pygame arcade game where a mouse dodges trains and grabs cheese to score.",
      github: "https://github.com/mithilgirish/Mouse-Run",
      tech: ["Python", "Pygame", "Game Development"],
      type: "personal"
    },
    

    // Work/Club Projects 
    {
      title: "OSPC Club Website",
      description:
        "Led the complete development of the OSPC's website, implementing modern UI/UX principles and responsive design.",
      github: "https://github.com/OSPC-VITC/ospc-website",
      liveLink: "https://ospcvitc.club",
      tech: ["Next.js", "Tailwind CSS", "Particles.js"],
      type: "work",
      organization: "Open Source Programming Club VITC"
    },
    {
      title: "Treasure Hunt PWA",
      description:
        "Cyberpunk-themed digital treasure hunt with QR scanning, GPS challenges. Built with Next.js for an interactive puzzle-solving experience with futuristic dashboard and ambient soundscapes.",
      github: "https://github.com/OSPC-VITC/treasure-hunt-website",
      tech: ["Next.js", "Supabase", "PWA", "Clerk"],
      liveLink: "https://www.treasurehunt.ospcvitc.club/",
      type: "work",
      organization: "Open Source Programming Club VITC"
    },
    {
      title: "IPL Battle",
      description:
        "IPL-Battle is a fantasy cricket game where users can create teams, join leagues, and compete based on real IPL match statistics. It features a user-friendly interface, real-time updates, and a robust backend.",
      github: "https://github.com/ecell-vitc/IPL-Battle",
      liveLink: "https://ipl-battle.vercel.app/",
      tech: ["vite", "Django", "React", "Tailwind CSS"],
      type: "work",
      organization: "E-Cell VITC"
    },
  ];

  const personalProjects = projects.filter(p => p.type === "personal");
  const workProjects = projects.filter(p => p.type === "work");

  



  const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
    <motion.div
      className="group bg-gray-800/40 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-2xl hover:scale-105 hover:border-blue-500/50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
          {project.title}
        </h2>
        <div className="flex flex-col items-end gap-2">
          
          {project.organization && (
            <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              {project.organization}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech, techIndex) => (
          <span 
            key={techIndex}
            className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-3 mt-4">
        <Link href={project.github} target="_blank" rel="noopener noreferrer">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-200 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </Link>
        {project.liveLink && (
          <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/50 hover:bg-blue-500/50 text-blue-200 hover:text-white rounded-lg transition-all duration-200 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );

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
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
      
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <Section id="projects-intro">
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              My Projects
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Explore my diverse portfolio of projects spanning web development, 
              machine learning, IoT, and game development. From personal innovations 
              to collaborative work with clubs and organizations.
            </motion.p>
          </Section>

        

          {/* Personal Projects Section */}
          <Section id="personal-projects">
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {personalProjects.map((project, index) => (
                <ProjectCard key={`personal-${index}`} project={project} index={index} />
              ))}
            </div>
          </Section>

          {/* Work/Club Projects Section */}
          <Section id="work-projects">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Club Work
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 mb-8 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Projects I&apos;ve contributed to through clubs, organizations, and collaborative efforts.
              These showcase my ability to work in teams and contribute to larger initiatives.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workProjects.map((project, index) => (
                <ProjectCard key={`work-${index}`} project={project} index={index} />
              ))}
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}