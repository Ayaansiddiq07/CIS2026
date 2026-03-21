import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';

const Home = lazy(() => import('./pages/Home.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Sessions = lazy(() => import('./pages/Sessions.tsx'));
const Speakers = lazy(() => import('./pages/Speakers.tsx'));
const Partners = lazy(() => import('./pages/Partners.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const FAQ = lazy(() => import('./pages/FAQ.tsx'));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-brand-accent animate-pulse font-display text-2xl">LOADING...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
