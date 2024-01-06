import logo from './logo.svg';
import './App.css';
import VideoPlayer from './components/VideoPlayer';
import PlayerDescription from './components/PlayerDescription';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar />


      <div className='main-container'>
        <div>
          <PlayerDescription />
        </div>
        <div>
          <VideoPlayer />
        </div>

      </div>
    </>
  );
}

export default App;
