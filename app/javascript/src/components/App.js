// app/javascript/components/App.jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConverterForm from './body/image_to_pdf_converter/ConverterForm'
import HeaderComponent from './header/HeaderComponent';
import HomeComponent from './body/HomeComponent';
import ImageSignatureComponent from './body/mergeconverter/ImageSignatureComponent';
import ImageCompressorComponent from './body/ImageCompressor/ImageCompressorComponent';
import TextTranslatorComponent from './body/text_translator/TextTranslatorComponent';

const Pricing = () => <div className="p-8">Pricing Page</div>;
const API = () => <div className="p-8">API Documentation</div>;
const Login = () => <div className="p-8">Login Page</div>;
const SignUp = () => <div className="p-8">Sign Up Page</div>;

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/image-to-pdf" element={<ConverterForm />} />
          <Route path='/image-signature' element={<ImageSignatureComponent/>}/>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/api" element={<API />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="image-compressor" element={<ImageCompressorComponent/>} />
          <Route path="/text-translator" element={<TextTranslatorComponent />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('image-converter-root'));
  root.render(<App />);
});

export default App;