import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Projects from './pages/Projects.tsx';
import Certifications from './pages/Certifications.tsx';
import Services from './pages/Services.tsx';
import Contact from './pages/Contact.tsx';
import Game from './pages/Game.tsx';
import NotFound from './pages/NotFound.tsx';

import usePageTitle from './hooks/usePageTitle.ts';

export default function App() {
  usePageTitle();

  return (
    <>
      <Analytics />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}