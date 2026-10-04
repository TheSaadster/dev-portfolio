import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Youtube from "@/components/Youtube";
import Contact from "@/components/Contact";
import Timeline from "@/components/Timeline";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Projects />
        <About />
        <Youtube />
        <Contact />
      </main>
      <Timeline />
      <SmoothScroll />
    </>
  );
}
