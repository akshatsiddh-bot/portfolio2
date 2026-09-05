import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ColorProvider } from './systems/ColorProvider';
import SectionProgress from './components/SectionProgress';
import CustomCursor from './components/CustomCursor';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <ColorProvider>
      {/* Skip to content — accessibility */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:rounded"
        style={{
          backgroundColor: 'var(--bg-hero)',
          color: 'var(--text-primary)',
          border: '1px solid var(--line)',
        }}
      >
        Skip to content
      </a>

      <CustomCursor />
      <SectionProgress />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </ColorProvider>
  );
}
