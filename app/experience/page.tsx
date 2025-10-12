"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import * as THREE from "three";
import { Calendar } from "lucide-react";

interface SectionProps {
  children: React.ReactNode;
  id: string;
}

interface Experience {
  organization: string;
  positions: {
    title: string;
    duration: string;
    description?: string;
  }[];
  logo: string;
  type: "clubs" | "experience";
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

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const experiences: Experience[] = [
    // Internship Experiences
    {
      organization: "Indira Gandhi Centre For Atomic Research, Kalpakkam",
      logo: "igcar.png",
      type: "experience",
      positions: [
        {
          title: "Summer Research Internship",
          duration: "Jun 2025 - Jul 2025 • 2 mos"
        }
      ]
    },
    {
      organization: "FinaHQ",
      logo: "finahq.jpeg",
      type: "experience",
      positions: [
        {
          title: "SDE Summer Internship",
          duration: "May 2024 - Jul 2024 • 3 mos",
        }
      ]
    },
    {
      organization: "Annam.ai",
      logo: "annamai.png",
      type: "experience",
      positions: [
        {
          title: "Project Intern",
          duration: "May 2025 - Jul 2025 • 3 mos",
        }
      ]
    },
    {
      organization: "Channelise",
      logo: "channelise.png",
      type: "experience",
      positions: [
        {
          title: "Co-Founder",
          duration: "Jan 2025 - Present",
        }
      ]
    },

    // Club Experiences
    {
      organization: "Open Source Programming Club VITC",
      logo: "ospc.png",
      type: "clubs",
      positions: [
        {
          title: "Vice President",
          duration: "Apr 2025 - Nov 2025 • 8 mos"
        },
        {
          title: "Web Dev lead",
          duration: "Sep 2024 - Apr 2025 • 8 mos"
        }
      ]
    },
    {
      organization: "Microsoft Innovations Club VITC",
      logo: "mic.png",
      type: "clubs",
      positions: [
        {
          title: "Development Lead",
          duration: "Apr 2025 - Present"
        },
        {
          title: "Web Dev member",
          duration: "Oct 2024 - Apr 2025 • 7 mos"
        }
      ]
    },
    {
      organization: "MOVIS (Special Team)",
      logo: "movis.png",
      type: "clubs",
      positions: [
        {
          title: "Programming Lead",
          duration: "Aug 2025 - Oct 2025 • 3 mos"
        },
        {
          title: "Programming and analysis member",
          duration: "Apr 2024 - Aug 2025 • 1 yr 5 mos"
        }
      ]
    },
    {
      organization: "E-Cell, VIT Chennai",
      logo: "ecell.png",
      type: "clubs",
      positions: [
        {
          title: "Web Developer",
          duration: "Sep 2024 - Sep 2025 • 1 yr"
        }
      ]
    }
  ];

  const internshipExperiences = experiences.filter(e => e.type === "experience");
  const clubExperiences = experiences.filter(e => e.type === "clubs");

  const ExperienceCard = ({ experience, index }: { experience: Experience; index: number }) => (
    <motion.div
      className="group bg-gray-800/40 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700/50 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-2xl hover:scale-105 hover:border-blue-500/50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 ">
            <img
      src={`/logos/${experience.logo}`}
      alt={`${experience.organization} logo`}
      width={100}
      height={100}
      className="rounded-sm"
    />
          </div>
          <h2 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
            {experience.organization}
          </h2>
        </div>
      </div>
      
      <div className="space-y-3">
        {experience.positions.map((position, posIndex) => (
          <div key={posIndex} className="border-l-2 border-purple-500/30 pl-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors mb-1">
              {position.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
              <Calendar size={12} className="text-purple-400" />
              <span>{position.duration}</span>
            </div>
            {position.description && (
              <p className="text-gray-400 text-sm leading-relaxed">{position.description}</p>
            )}
          </div>
        ))}
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
          <Section id="experience-intro">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              My Experience
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Explore my journey through leadership roles, technical contributions, 
              and professional growth across clubs, organizations, and experience.
            </motion.p>
          </Section>

          {/* experience Section */}
          <Section id="experience">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {internshipExperiences.map((experience, index) => (
                <ExperienceCard key={`internship-${index}`} experience={experience} index={index} />
              ))}
            </div>
          </Section>

          {/* Club Experiences Section */}
          <Section id="club-experiences">
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
              Leadership roles and technical contributions across various student organizations 
              and programming clubs at VIT Chennai.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubExperiences.map((experience, index) => (
                <ExperienceCard key={`club-${index}`} experience={experience} index={index} />
              ))}
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}