import './App.css';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="app">
      <Toaster position="top-right"/>
      <Header/>
      <Gallery/>
      <Footer/>
    </div>
  );
}

export default App;
