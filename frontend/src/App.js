import './App.css';
import Header from './components/Header';
import Aside from './components/Aside';
import MainMenu from './components/MainMenu';
import Rules from './components/Rules';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Aside />
      <main>
        <MainMenu />
        <Rules />
      </main>
      <Footer />
    </>
  );
}

export default App;
