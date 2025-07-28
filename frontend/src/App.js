import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Authentication from './pages/Authentication.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import VideoMeetComponent from './pages/VideoMeet.jsx';
import  HomeComponent from './pages/Home.jsx';
import History from './pages/history.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/home' element={<HomeComponent />} />
            <Route path='/history' element={<History />} />
          <Route path='/:url' element={<VideoMeetComponent/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
