import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';


const ConverterForm = lazy(() => import('./body/image_to_pdf_converter/ConverterForm'));
const HeaderComponent = lazy(() => import('./header/HeaderComponent'));
const HomeComponent = lazy(() => import('./body/HomeComponent'));
const ImageSignatureComponent = lazy(() => import('./body/mergeconverter/ImageSignatureComponent'));
const ImageCompressorComponent = lazy(() => import('./body/ImageCompressor/ImageCompressorComponent'));
const TextTranslatorComponent = lazy(() => import('./body/text_translator/TextTranslatorComponent'));

const Loading = () => <div>Loading...</div>;
const Login = () => <div className="p-8">Login Page</div>;
const SignUp = () => <div className="p-8">Sign Up Page</div>;

const App = () => {
  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
};

const RoutesWrapper = () => {
  return (
    <div>
      {/* Suspense wraps all lazy-loaded components */}
      <Suspense fallback={<Loading />}>
        <HeaderComponent />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/image-to-pdf" element={<ConverterForm />} />
            <Route path="/image-signature" element={<ImageSignatureComponent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/image-compressor" element={<ImageCompressorComponent />} />
            <Route path="/text-translator" element={<TextTranslatorComponent />} />
          </Routes>
        </motion.div>
      </Suspense>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('image-converter-root'));
  root.render(<App />);
});

export default App;
