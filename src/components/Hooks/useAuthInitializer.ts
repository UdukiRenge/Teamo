import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import { isLoginAtom } from '../../atoms/loginAtom';

import { useUserContext } from '../../contexts/UserContext';

import { refreshToken, logoutUser } from '../../api/userApi';

import { messages } from '../../constants/message';
import { useErrorModal } from './useErrorModal';

// ➀コンテクストにユーザー情報が入っているか確認
// ➁➀がfalseである場合、リフレッシュトークンを基にユーザー情報を取得
// ➂➁で取得したユーザー情報をコンテクストに保存
export const useAuthInitializer = () => {
  const { user, setUser } = useUserContext();
  const [_isLogin, setIsLogin] = useAtom(isLoginAtom);

  const navigate = useNavigate();
  const showErrorModal = useErrorModal();

  useEffect( () => {
    const fetchAccessInfo = async () => {
      try {
        // リフレッシュトークンを基にアクセストークンとユーザー情報を取得する。
        const accessInfo = await refreshToken();

        if (!accessInfo.success) {
          await showErrorModal(messages.ERROR.E015);
          await logoutUser();
          navigate('/');
          return;
        }

        // コンテクストにユーザー情報を保存
        setUser({user_id: accessInfo.user._id, user_name: accessInfo.user.user_name});
        setIsLogin(true);
      } catch {
        await showErrorModal(messages.ERROR.E001);
        await logoutUser();
        navigate('/');
        return;
      }
    }

    if (user) {
      // 既にログイン中
      return; 
    }

    fetchAccessInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};