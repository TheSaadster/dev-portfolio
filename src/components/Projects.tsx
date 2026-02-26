"use client";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Chess It Up",
    description:
      "Free unlimited Stockfish chess analysis platform with 50,000+ users. Import games from Chess.com & Lichess.",
    tech: ["Next.js", "TypeScript", "AWS EC2", "Stockfish", "Supabase"],
    link: "https://chessitup.com",
  },
  {
    title: "Minecraft Armor Calculator",
    description: "Armor protection calculator with 3D visualization features.",
    tech: ["React", "Three.js", "TypeScript"],
    link: "#",
  },
  {
    title: "Voice AI Assistant",
    description: "A real-time voice AI assistant. Watch the demo on YouTube.",
    tech: ["AI", "Python", "API"],
    link: "https://www.youtube.com/watch?v=rflU5b_Yn60",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.link}
              target="_blank"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition group"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition">
                {p.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
