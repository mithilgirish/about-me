"use client";
import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
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
  github?: string;
  liveLink?: string;
  tech: string[];
  type: "personal" | "work" | "research";
  organization?: string;
  theme?: "sky" | "violet" | "orange" | "rose";
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
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
    >
      {children}
    </motion.section>
  );
};

export default function Projects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 70, damping: 22 });

  const projects: Project[] = [
    // Personal Projects
    {
      title: "Crop-Core_Tech",
      description: "A comprehensive crop yield prediction application leveraging machine learning algorithms, with seamless API integration and real-time state rainfall data analysis.",
      github: "https://github.com/mithilgirish/Crop-Core_Tech",
      tech: ["Python", "Machine Learning", "API", "Data Analysis"],
      type: "personal",
      theme: "sky"
    },
    {
  
  title: "Strand",
description: "AI-powered construction intelligence platform for hyperscale data center EPC delivery and compliance.",  tech: ["LangGraph", "Neo4j", "FastAPI", "Next.js", "React Native"],
  liveLink: "https://strand-docs.vercel.app/",
  type: "personal",
  theme: "violet"
},
    {
      title: "MargDrishti",
      description: "Offline edge AI system for secure facial authentication and liveness verification in remote field operations.",
      github: "https://github.com/mithilgirish/MargDrishti",
      tech: ["TypeScript", "Edge AI", "Computer Vision", "Security"],
      type: "personal",
      theme: "sky"
    },
    {
      title: "CloudPilot",
      description: "Distributed Edge-Cloud Autonomous Navigation System that offloads complex inference from ESP32/Raspberry Pi nodes to compute servers.",
      github: "https://github.com/mithilgirish/CloudPilot",
      tech: ["C", "IoT", "Distributed Systems", "Raspberry Pi"],
      type: "personal",
      theme: "violet"
    },
    {
      title: "GlucoZap",
      description: "Comprehensive healthcare ecosystem leveraging 7 distributed FastAPI microservices, YOLOv11/ResNet18 computer vision, and a LangChain RAG pipeline for medical document analysis.",
      github: "https://github.com/mithilgirish/GlucoZap",
      tech: ["FastAPI", "Next.js", "PyTorch", "LangChain", "Groq", "Microservices"],
      type: "personal",
      theme: "violet"
    },
     {
      title: "Safedip",
      description: "AI-Driven IoT swimming pool safety monitor featuring real-time ESP32 water chemistry telemetry, a PyTorch LSTM predictive maintenance engine, and a personalised Skin Safety AI.",
      github: "https://github.com/mithilgirish/Safedip",
      tech: ["FastAPI", "Next.js", "PyTorch", "ESP32", "IoT"],
      type: "personal",
      theme: "rose"
    },
    {
      title: "Macrowatch",
      description: "Market trend direction and risk signaling platform built by analyzing global economic indicators using statistical modeling.",
      github: "https://github.com/mithilgirish/Macrowatch",
      tech: ["Jupyter Notebook", "Data Science", "Finance", "Analytics"],
      type: "personal",
      theme: "orange"
    },
   
    
    {
      title: "Agroflow",
      description: "A smart agriculture platform designed to improve farming efficiency using modern technology like IoT-based monitoring, AI-powered insights, and secure digital traceability.",
      github: "https://github.com/mithilgirish/Agroflow",
      tech: ["IoT", "AI", "AgriTech", "Next.js"],
      type: "personal",
      theme: "sky"
    },
    {
      title: "Reminisce",
      description: "A comprehensive ecosystem supporting early-stage Alzheimer's patients through AI-powered face recognition, real-time safety monitoring, and intuitive interfaces.",
      github: "https://github.com/mithilgirish/reminisce",
      tech: ["Next.js", "React", "AI/ML", "Healthcare"],
      type: "personal",
      theme: "rose"
    },
    {
      title: "ParaCipher",
      description: "A blockchain-based micro-insurance protocol designed for gig workers. Won two bounties at DeFy'26 with team CipherLabs.",
      github: "https://github.com/mithilgirish/ParaCipher",
      tech: ["Blockchain", "Solidity", "Web3", "React"],
      type: "personal",
      theme: "violet"
    },
    {
      title: "CareerTrack",
      description: "The Smartest Way to Learn, Prepare & Succeed! An AI-powered career guidance platform.",
      github: "https://github.com/mithilgirish/careertrack",
      liveLink: "https://careertrack-one.vercel.app",
      tech: ["Next.js", "FastAPI", "Generative AI", "Supabase"],
      type: "personal",
      theme: "orange"
    },
    {
      title: "Obscura",
      description: "Obscura is a sleek, full-stack app to track your personal book collection. Securely add, edit, and manage books with notes—each tied to your account.",
      github: "https://github.com/mithilgirish/obscura",
      liveLink: "https://obscura.mithilgirish.dev/",
      tech: ["Next.js", "TypeScript", "MongoDB", "Clerk"],
      type: "personal",
      theme: "violet"
    },
    {
      title: "Pill-Dispenser",
      description: "An intelligent pill dispenser system with React-based control interface, integrated with ESP32 microcontroller and precision servo motors for automated medication management.",
      github: "https://github.com/mithilgirish/Pill-Dispenser",
      tech: ["React", "ESP32", "IoT", "Hardware"],
      type: "personal",
      theme: "sky"
    },
    {
      title: "Treximo",
      description: "An engaging interactive game built with Pygame, featuring unique gameplay mechanics and immersive user experience with custom graphics and sound effects.",
      github: "https://github.com/mithilgirish/Treximo",
      tech: ["Python", "Pygame", "Game Development"],
      type: "personal",
      theme: "violet"
    },
    {
      title: "Music-Player",
      description: "A feature-rich Python music player application with intuitive UI, playlist management, audio visualization, and support for multiple audio formats.",
      github: "https://github.com/mithilgirish/Music-Player",
      tech: ["Python", "Tkinter", "Audio Processing"],
      type: "personal",
      theme: "sky"
    },
    {
      title: "FitFusion",
      description: "An AI-powered fitness and health monitoring mobile app built with React Native.",
      github: "https://github.com/mithilgirish/FitFusion",
      tech: ["React Native", "HealthConnect", "GenAI", "Clerk"],
      type: "personal",
      theme: "rose"
    },
    {
      title: "InstaCut",
      description: "InstaCut is a sleek AI-powered web app that instantly removes image backgrounds. Built with Vite, Tailwind, and ShadCN/UI.",
      github: "https://github.com/mithilgirish/InstaCut",
      liveLink: "https://instacut.mithilgirish.dev/",
      tech: ["React", "Tailwind", "ShadCN/UI", "Vite"],
      type: "personal",
      theme: "orange"
    },
    {
      title: "Mouse Run",
      description: "Mouse Run is a fast-paced Pygame arcade game where a mouse dodges trains and grabs cheese to score.",
      github: "https://github.com/mithilgirish/Mouse-Run",
      tech: ["Python", "Pygame", "Game Development"],
      type: "personal",
      theme: "sky"
    },

    // Work/Club Projects 
    {
      title: "OSPC Club Website",
      description: "Led the complete development of the OSPC's website, implementing modern UI/UX principles and responsive design.",
      github: "https://github.com/OSPC-VITC/ospc-website",
      liveLink: "https://ospcvitc.club",
      tech: ["Next.js", "Tailwind CSS", "Particles.js"],
      type: "work",
      organization: "Open Source Programming Club VITC",
      theme: "violet"
    },
    {
      title: "Treasure Hunt PWA",
      description: "Cyberpunk-themed digital treasure hunt with QR scanning, GPS challenges. Built with Next.js for an interactive puzzle-solving experience.",
      github: "https://github.com/OSPC-VITC/treasure-hunt-website",
      tech: ["Next.js", "Supabase", "PWA", "Clerk"],
      liveLink: "https://www.treasurehunt.ospcvitc.club/",
      type: "work",
      organization: "Open Source Programming Club VITC",
      theme: "sky"
    },
    {
      title: "IPL Battle",
      description: "IPL-Battle is a fantasy cricket game where users can create teams, join leagues, and compete based on real IPL match statistics.",
      github: "https://github.com/ecell-vitc/IPL-Battle",
      liveLink: "https://ipl-battle.vercel.app/",
      tech: ["vite", "Django", "React", "Tailwind CSS"],
      type: "work",
      organization: "E-Cell VITC",
      theme: "orange"
    },
    {
      title: "MIC Official Website",
      description: "Official website for the Microsoft Innovation Club at VIT Chennai. Discover events, hackathons, and opportunities to innovate with a futuristic design.",
      github: "https://github.com/mithilgirish/mic-official-website-25",
      liveLink: "https://www.microsoftinnovations.club/",
      tech: ["Next.js", "Tailwind CSS", "React"],
      type: "work",
      organization: "Microsoft Innovations Club VITC",
      theme: "sky"
    },
    {
      title: "OnlyFounders PWA",
      description: "The one-of-a-kind hackathon platform for student founders. A mobile-first PWA providing exclusive access to startup events and networking.",
      liveLink: "https://app.onlyfounders.in/",
      github: "https://github.com/mithilgirish/onlyfounder-pwa",
      tech: ["Next.js", "PWA", "Supabase", "Tailwind"],
      type: "work",
      organization: "Microsoft Innovations Club VITC",
      theme: "violet"
    },
    {
      title: "VOID App",
      description: "VOID:v1 - A futuristic tech event PWA for OSPC's flagship hackathon. Features real-time session tracking and an immersive dark theme experience.",
      github: "https://github.com/mithilgirish/void_app",
      liveLink: "https://app.void25.site/",
      tech: ["Next.js", "PWA", "Supabase", "Clerk"],
      type: "work",
      organization: "Open Source Programming Club VITC",
      theme: "rose"
    },

    // Research / Ventures
    {
      title: "PACTUS",
      description: "A Decentralized 'Immune System' for the Agentic Web defending against malicious autonomous AI agents through Polymorphic Adversarial Traps and Blockchain Consensus.",
      github: "https://github.com/mithilgirish/PACTUS",
      tech: ["Python", "Solidity", "Blockchain", "Web3", "Security"],
      type: "research",
      theme: "sky"
    },
    {
      title: "traz",
      description: "A local-first engineering memory layer and MCP server that provides AI coding tools with a shared, persistent context architecture.",
      github: "https://github.com/mithilgirish/traz",
      liveLink: "https://traz.mithilgirish.dev/",
      tech: ["Rust", "SQLite", "MCP", "AI Agents", "Vector DB"],
      type: "research",
      theme: "violet"
    },
    {
      title: "Apache Iceberg (Go)",
      organization: "Open Source Contribution",
      description: "Upstream contributions to the Apache Iceberg Go client, focusing on distributed data lakehouse storage and file deletion pipelines.",
      github: "https://github.com/apache/iceberg-go",
      tech: ["Go", "Apache Iceberg", "Data Engineering", "Open Source"],
      type: "research",
      theme: "sky"
    },
  ];

  const personalProjects = projects.filter(p => p.type === "personal");
  const workProjects = projects.filter(p => p.type === "work");
  const researchProjects = projects.filter(p => p.type === "research");

  const themeMap = {
    sky: {
      border: "hover:border-sky-500/40",
      bgHover: "hover:bg-sky-500/5",
      text: "text-sky-300",
    },
    violet: {
      border: "hover:border-violet-500/40",
      bgHover: "hover:bg-violet-500/5",
      text: "text-violet-300",
    },
    orange: {
      border: "hover:border-orange-500/40",
      bgHover: "hover:bg-orange-500/5",
      text: "text-orange-300",
    },
    rose: {
      border: "hover:border-rose-500/40",
      bgHover: "hover:bg-rose-500/5",
      text: "text-rose-300",
    },
    default: {
      border: "hover:border-blue-500/40",
      bgHover: "hover:bg-blue-500/5",
      text: "text-blue-300",
    }
  };

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const t = project.theme && themeMap[project.theme] ? themeMap[project.theme] : themeMap.default;

    return (
      <motion.div
        className={`group bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-zinc-800 transition-all duration-300 ${t.border} ${t.bgHover} relative overflow-hidden flex flex-col justify-between`}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        whileHover={{ y: -4, scale: 1.02 }}
      >
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className={`text-xl font-bold transition-colors ${t.text} font-sans`}>
              {project.title}
            </h3>
            {project.organization && (
              <span className="px-2 py-0.5 text-[10px] bg-zinc-800/80 text-violet-300 rounded border border-violet-900/40 font-mono text-right ml-2 flex-shrink-0">
                {project.organization}
              </span>
            )}
          </div>

          <p className="text-gray-400 mb-4 text-xs leading-relaxed font-light line-clamp-3">
            {project.description}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[11px]">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2.5 py-0.5 text-[10px] bg-zinc-800/80 text-gray-300 rounded border border-zinc-700/60"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-2 font-mono text-xs pt-2 border-t border-zinc-800/80">
            {project.github && (
              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded transition-all text-xs border border-zinc-700">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </Link>
            )}
            {project.liveLink && (
              <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                <button className={`flex items-center gap-1.5 px-3 py-1.5 hover:text-white rounded transition-all text-xs border ${t.border} ${t.bgHover} text-gray-300`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 1.6,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    camera.position.z = 10;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      stars.rotation.y = smoothScrollY.get() * 0.0004 + 0.0002;
      stars.rotation.x += 0.0001;
      renderer.render(scene, camera);
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
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, [smoothScrollY]);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

      <main className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-7xl">
          
          {/* INTRO HERO */}
          <Section id="projects-intro">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#EBF4F5] to-[#B5C6E0] bg-clip-text text-transparent tracking-tight leading-[1.15] pb-4 pt-1 inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              My Projects
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore my diverse portfolio spanning Edge AI, local MCP context engines, decentralized security protocols, and full-stack web platforms.
            </motion.p>
          </Section>

          {/* PERSONAL PROJECTS */}
          <Section id="personal-projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {personalProjects.map((project, index) => (
                <ProjectCard key={`personal-${index}`} project={project} index={index} />
              ))}
            </div>
          </Section>

          {/* RESEARCH & VENTURES */}
          <Section id="research-projects">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Research & Ventures (Concepts)
            </motion.h2>
            
            <motion.p
              className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl font-light"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Exploring next-generation AI-developer tools and decentralized consensus models. Active concepts currently in development.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {researchProjects.map((project, index) => (
                <ProjectCard key={`research-${index}`} project={project} index={index} />
              ))}
            </div>
          </Section>

          {/* WORK & CLUB PROJECTS */}
          <Section id="work-projects">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Club Work
            </motion.h2>

            <motion.p
              className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl font-light"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Projects contributed through clubs, hackathons, and collaborative engineering teams at VIT Chennai.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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