import styles from './Header.module.css'

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';

import { MdAccountCircle } from "react-icons/md";

import { isLoginAtom } from '../atoms/loginAtom'
import { useUserContext } from '../contexts/UserContext';

import { useAlertModal } from '../components/Hooks/useAlertModal';
import { useErrorModal } from '../components/Hooks/useErrorModal';

import { messages } from '../constants/message';

import { logoutUser } from '../api/userApi'

const Header: React.FC = () => {
  
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Teamo</h1>
      <LoginMenu/>
    </header>
  );
};

export default Header;

const LoginMenu: React. FC = () => {
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);

  const { user, setUser } = useUserContext();

  const navigate = useNavigate();
  const location = useLocation();

  const showAlertModal = useAlertModal();
  const showErrorModal = useErrorModal();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // メニューのref
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 現在のパスを取得
  const currentPath = location.pathname;

  // ログアウトを実施
  const logoutFunc = async () => {
    // ログアウトの確認
    const comfirmLogout = await showAlertModal(messages.WARNING.W006);
    if (!comfirmLogout) {
      return;
    }
    setIsLogin(false);
    try {
      // ログアウトを実施
      await logoutUser();
      setIsMenuOpen(false);
      setUser(null);
      // ホーム画面に遷移
      navigate('/');
    } catch {
      // エラーダイアログ「システムエラーが発生しました。トップページに遷移します。」
      await showErrorModal(messages.ERROR.E001);
      return;
    }
  }

  // メモ画面でブラウザバックを検知した場合、ログアウト処理を実施する。
  useEffect(() => {
  const handlePopState = async () => {
    // ブラウザバック時にモーダルの後ろで画面遷移してしまう事象を防いでいる。
    window.history.pushState({ user }, '', window.location.pathname);
    
    // パスが"Memo"であればブラウザバック処理を実行
    if (currentPath === '/Memo') {
      await logoutFunc();
    } else {
      return;
    }
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [location.pathname]); 

  // ユーザー情報管理画面に遷移
  const navigateUserManage = () => {
    navigate("/UserManage");
    setIsMenuOpen(false);
  }

  // クリックされた要素がメニューまたはメニューボタンでなければメニューを閉じる
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    // `mousedown` の方が競合しにくい
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {isLogin && (
        <div ref={wrapperRef} className={styles['loginmenu-container']}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MdAccountCircle size={30}/>
          </button>
          {isMenuOpen && (
            <div 
              className={styles["menu-container"]}
            >
              <button
                style={{color: 'black'}}
                onClick={() => navigateUserManage()}
              >
                ユーザー情報編集
              </button>
              <button
                style={{color: 'red'}}
                onClick={() => logoutFunc()}
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      )} 
    </>
  )
}
