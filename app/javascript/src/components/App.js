// app/javascript/components/App.jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom/client'; 
import ConverterForm from './converter/ConverterForm';

const App = () => {
  return (
    <div>
      <ConverterForm />
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('image-converter-root'));
  root.render(<App />);
});

export default App;