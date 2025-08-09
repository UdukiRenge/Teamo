import { Provider } from 'jotai';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { UserProvider } from './contexts/UserContext';

import './App.css';
// 各画面
import Header from './components/Header';
import Footer from './components/Footeer'
import Home from './pages/Home';
import Memo from './pages/Memo';
import Inquirie from './pages/Inquirie';
import Note from './pages/Note';

import { CheckMedia } from './components/CheckMedia'

// カスタムフック
import UserManage from './pages/UserManage';
import AlertModal from './components/Modal';
import Popup from './components/Popup';
import ComfirmSession from './components/ComfirmSession'

function App() {
  return (
    <Provider>
      <UserProvider>
        <Router>
          <CheckMedia />
          <Header />
          <Footer />
          <Routes>
            {/*ログイン前の画面*/}
            <Route path="/" element={<Home />} />
            <Route path="/Inquirie" element={<Inquirie />} />
            <Route path="/Note" element={<Note />} />
            {/*ログイン前の画面*/}
            <Route element={<ComfirmSession />}>
              <Route path="/Memo" element={<Memo />} />
              <Route path="/UserManage" element={<UserManage/>} />
            </Route>
          </Routes>
          <Popup/>
          <AlertModal />
        </Router>
      </UserProvider>
    </Provider>
  );
}

export default App;