import { Outlet } from 'react-router-dom';
import { useAuthInitializer } from './Hooks/useAuthInitializer';
import { useUserContext } from '../contexts/UserContext';

// ログイン後の画面で実行する。
// リフレッシュトークンを基にuseContextにユーザー情報を格納する。
const ComfirmSession = () => {
  const { user } = useUserContext();
  useAuthInitializer();

  // ユーザー情報が設定されるまで表示を待つ
  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ComfirmSession;