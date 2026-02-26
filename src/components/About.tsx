"use client";
import { motion } from "framer-motion";

const skills = [
  "TypeScript", "React", "Next.js", "Node.js",
  "AWS", "Supabase", "PostgreSQL", "Three.js",
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              I&apos;m Saad - a full-stack developer who loves building things that are both
              useful and fast. I specialize in React and Next.js on the frontend, and
              Node.js + AWS on the backend.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Outside of coding I run a{" "}
              <a
                href="https://www.youtube.com/@the_saadster"
                target="_blank"
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                YouTube channel
              </a>{" "}
              where I post about software development and whatever I&apos;m currently obsessed with.
            </p>
            <p className="text-gray-400 leading-relaxed">
              My biggest project so far is{" "}
              <a
                href="https://chessitup.com"
                target="_blank"
                className="text-indigo-400 hover:text-indigo-300 transition"
              >
                Chess It Up
              </a>
              , a free unlimited chess game review platform with 50,000+ users.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5 text-gray-300">Tech I work with</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="text-sm bg-gray-900 border border-gray-800 px-4 py-2 rounded-full text-gray-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
