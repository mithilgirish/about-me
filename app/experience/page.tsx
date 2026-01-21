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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      {children}
    </motion.section>
  );
};

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positionArray = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }
    for (let i = 0; i < starCount; i++) {
      sizes[i] = Math.random() * 2 + 0.5;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Monochrome / White Stars
    const colors = new Float32Array(starCount * 3);
    colors.fill(1.0); // White
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 1.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      vertexColors: false // Use single color
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0002;
      stars.rotation.x += 0.0001;
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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  const experiences: Experience[] = [
    // Internship/Work Experiences
    
    {
      organization: "ANNAM.AI",
      logo: "annamai.png",
      type: "experience",
      positions: [
        {
          title: "Project Intern",
          duration: "May 2025 - Jul 2025",
          description: "Team won national 1st place at the Annam.ai Hackathon."
        }
      ]
    },
    {
      organization: "IGCAR (Indira Gandhi Centre for Atomic Research)",
      logo: "igcar.png",
      type: "experience",
      positions: [
        {
          title: "Research Intern",
          duration: "Jun 2025 - Jul 2025",
          description: "Worked on ML-based detection systems."
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
    },{
      organization: "Channelise",
      logo: "channelise.png",
      type: "experience",
      positions: [
        {
          title: "Co-Founder",
          duration: "Dec 2024 - Dec 2025",
        }
      ]
    },

    // Club Experiences
    {
      organization: "Microsoft Innovations Club (MIC) VITC",
      logo: "mic.png",
      type: "clubs",
      positions: [
        {
          title: "Development Lead",
          duration: "Apr 2025 - Present",
          description: "Promoted from Web Development member."
        },
        {
          title: "Web Dev member",
          duration: "Oct 2024 - Apr 2025"
        }
      ]
    },
    {
      organization: "Open Source Programming Club (OSPC) VITC",
      logo: "ospc.png",
      type: "clubs",
      positions: [
        {
          title: "Vice President",
          duration: "Apr 2025 - Nov 2025",
          description: "Led club operations and events."
        },
        {
          title: "Web Dev lead",
          duration: "Sep 2024 - Apr 2025"
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
          duration: "Aug 2025 - Oct 2025"
        },
        {
          title: "Programming and analysis member",
          duration: "Apr 2024 - Aug 2025"
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
          duration: "Sep 2024 - Sep 2025"
        }
      ]
    }
  ];

  const internshipExperiences = experiences.filter(e => e.type === "experience");
  const clubExperiences = experiences.filter(e => e.type === "clubs");

  const achievements = [
    {
      title: "Hackathon Win at DeFy'26",
      date: "Jan 2026",
      description: "Won two bounties at DeFy'26 with team CipherLabs for Project ParaCipher, a blockchain-based protocol for gig workers."
    },
    {
      title: "National Win at Annam.ai Hackathon",
      date: "2025",
      description: "Secured 1st Place nationally with the team at Annam.ai."
    }
  ];

  const ExperienceCard = ({ experience, index, theme = 'sky' }: { experience: Experience; index: number; theme?: 'sky' | 'violet' | 'green' | 'orange' }) => {

    // Theme-based colors (Bolder & Classier)
    const themeStyles = {
      sky: {
        wrapper: 'hover:border-sky-500/60 hover:bg-sky-500/5',
        text: 'text-sky-300',
        subText: 'text-sky-400',
        leftBorder: 'border-l-sky-400'
      },
      violet: {
        wrapper: 'hover:border-violet-500/60 hover:bg-violet-500/5',
        text: 'text-violet-300',
        subText: 'text-violet-400',
        leftBorder: 'border-l-violet-400'
      },
      green: {
        wrapper: 'hover:border-emerald-500/60 hover:bg-emerald-500/5',
        text: 'text-emerald-300',
        subText: 'text-emerald-400',
        leftBorder: 'border-l-emerald-400'
      },
      orange: {
        wrapper: 'hover:border-amber-500/60 hover:bg-amber-500/5',
        text: 'text-amber-300',
        subText: 'text-amber-400',
        leftBorder: 'border-l-amber-400'
      }
    };

    const currentTheme = themeStyles[theme];

    return (
      <motion.div
        className={`group bg-zinc-900/50 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-zinc-800 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${currentTheme.wrapper}`}
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
                className="rounded-sm transition-all duration-300" // Removed grayscale
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/100?text=" + experience.organization.charAt(0);
                }}
              />
            </div>
            <h2 className={`text-xl font-semibold ${currentTheme.text} transition-colors`}>
              {experience.organization}
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {experience.positions.map((position, posIndex) => (
            <div key={posIndex} className={`border-l-2 pl-4 ${currentTheme.leftBorder} transition-colors duration-300`}>
              <h3 className="text-lg font-semibold text-white mb-1">
                {position.title}
              </h3>
              <div className={`flex items-center gap-2 text-sm mb-2 ${currentTheme.subText}`}>
                <Calendar size={12} className={currentTheme.subText} />
                <span>{position.duration}</span>
              </div>
              {position.description && (
                <p className="text-gray-400 text-sm leading-relaxed font-light">{position.description}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      {/* ... canvas ... */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      <main className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <Section id="experience-intro">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2"
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

          {/* Experience Section */}
          <Section id="experience">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {internshipExperiences.map((experience, index) => {
                let theme: 'sky' | 'violet' | 'green' | 'orange' = 'sky';
                if (experience.organization.includes("Channelise")) theme = 'violet';
                else if (experience.organization.includes("ANNAM")) theme = 'green';
                else if (experience.organization.includes("FinaHQ")) theme = 'orange';

                return (
                  <ExperienceCard
                    key={`internship-${index}`}
                    experience={experience}
                    index={index}
                    theme={theme}
                  />
                );
              })}
            </div>
          </Section>

          {/* Club Experiences Section */}
          <Section id="club-experiences">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 text-white"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {clubExperiences.map((experience, index) => (
                <ExperienceCard
                  key={`club-${index}`}
                  experience={experience}
                  index={index}
                  theme="violet"
                />
              ))}
            </div>
          </Section>

          {/* Achievements Section */}
          <Section id="achievements">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Achievements
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-xl border border-zinc-700/50 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all duration-300 hover:shadow-2xl group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">{item.title}</h3>
                  <div className="text-amber-500 text-sm mb-3 flex items-center gap-2 font-medium">
                    <Calendar size={14} /> {item.date}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}