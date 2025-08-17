import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isLoginAtom } from '../atoms/loginAtom';

import { createUser, loginUser, refreshToken } from '../api/userApi';
import { checkUserInfoRegister, checkUserInfoLogin } from '../services/checkUserInfo';

import { useErrorModal } from '../components/Hooks/useErrorModal';
import { usePopup } from '../components/Hooks/usePopup';

import { useUserContext } from '../contexts/UserContext';

import { messages } from '../constants/message';

import styles from './Home.module.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [_isLogin, setIsLogin] = useAtom(isLoginAtom);
  
  const showErrorModal = useErrorModal();
  const showPopup = usePopup();

  const { setUser } = useUserContext();

  const [type, setType] = useState<string>("login");
  const [userIdInput, setUsrIdInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [confirmInput, setConfirmInput] = useState<string>("");
  const [userNameInput, setUserNameInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [tokenChecked, setTokenChecked] = useState<boolean>(false);

  // ユーザーIDの入力をstateに保存
  const handleChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '');
    setUsrIdInput(alphanumericOnly);
  };

  // パスワードの入力をstateに保存
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '');
    setPasswordInput(alphanumericOnly);      
  };

  // パスワード(確認用)の入力をstateに保存
  const handleChangeConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '');
    setConfirmInput(alphanumericOnly);      
  };

  // ユーザー名の入力をstateに保存
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserNameInput(value);      
  };
  
  // インプットのクリア
  const inputClear = () => {
    setUsrIdInput("");
    setPasswordInput("");
    setConfirmInput("");
    setUserNameInput("")
  }

  // 入力モードの切り替え
  const changeInput = async (mode: string) => {
    setType(mode);
    inputClear();
  }

  // 初回表示処理
  useEffect(() => {
    const checkSession = async () => {
      try {
        // ここでサーバーにリフレッシュトークン付きのリクエストを送る
        const verifyTokenResponse = await refreshToken();

        if (!verifyTokenResponse.success) {
          // トークン関連のエラーの場合は、通常のログインとみなす
          if (verifyTokenResponse.code.includes("TOKEN")) {
            return;
          } else {
            // 「システムエラーが発生しました。トップページに遷移します。」
            await showErrorModal(messages.ERROR.E001);
            return;
          }
        }

        // useContextにユーザー情報を保存
        setUser({user_id: verifyTokenResponse.user._id, user_name: verifyTokenResponse.user.user_name});
        // 状態をログインに変更
        setIsLogin(true);

        // 認証済みならログイン画面をスキップしてトップへ
        navigate("/Memo");
      } catch {
        // 「システムエラーが発生しました。トップページに遷移します。」
        await showErrorModal(messages.ERROR.E001);
        return;
      } finally {
        setTokenChecked(true);
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ログインを実施し、メモ画面に遷移する関数
  const loginFunction = async () => {
    // 入力チェックを実施
    const inputCheck = checkUserInfoLogin(userIdInput, passwordInput);

    // 入力が不正であった場合は、エラーダイアログを出力する。
    if (!inputCheck.success) {
      await showErrorModal(inputCheck.errorMessage ?? messages.ERROR.E001);
      return;
    }

    const userData = {
      _id: userIdInput,
      password: passwordInput,
    };    

    try {
      // ログインを実行
      const loginResult = await loginUser(userData);
      
      if (loginResult.success) {
        setUser({user_id: userIdInput, user_name: loginResult.userName});
        setIsLogin(true);
        navigate('/Memo');
      } else {
        switch (loginResult.code) {
          case 'USER_NOTFOUND':
            await showErrorModal(messages.ERROR.E011);
            break;
          case 'PASSWORD_ERROR':
            await showErrorModal(messages.ERROR.E010);
            break;
          default:
            await showErrorModal(messages.ERROR.E001);
            inputClear();
        }
      }
    } catch {
      // 「システムエラーが発生しました。トップページに遷移します。」
      await showErrorModal(messages.ERROR.E001);
      inputClear();
      return;
    }
  }

  //ユーザー登録を実施し、メモ画面に遷移する関数
  const resgisterFunction = async () => {
    // 入力チェックを実施
    const inputCheck = checkUserInfoRegister(userIdInput, passwordInput, confirmInput, userNameInput);

    // 入力が不正であった場合は、エラーダイアログを出力する。
    if (!inputCheck.success) {
      await showErrorModal(inputCheck.errorMessage ?? messages.ERROR.E001);
      return;
    }

    const userData = {
      _id: userIdInput,
      password: passwordInput,
      user_name: userNameInput
    };

    try {
      // ユーザーの登録を実行
      const createResponse = await createUser(userData);
      if (!createResponse.success) {
        if (createResponse.code === "USER_DUPLICATION") {
          // 「既に存在するユーザーIDが使用されています。別のIDで登録してください。」
          await showErrorModal(messages.ERROR.E009);
          return;
        }
      }
      inputClear();
      setType("login");
      showPopup(messages.INFO.I001);
    } catch {
      // 「システムエラーが発生しました。トップページに遷移します。」
      await showErrorModal(messages.ERROR.E001);
      inputClear();
      setType("login");
      return;
    }
  }

  if (!tokenChecked) {
    return null;
  }
  return (
    <div className={styles["home-container"]}>
      <div className={styles["input-container"]}>
        {type === "login" && <p className={styles.title}>ユーザーログイン</p>}
        {type === "register" && <p className={styles.title}>ユーザー登録</p>}
        <input 
          type="text"
          placeholder="ユーザーID"
          value={userIdInput}
          onChange={handleChangeUserId}
        />
        <p className={styles.inputPolicy}>半角英数字8字～20字</p>
        <input 
          type={showPassword ? "text" : "password"}
          placeholder="パスワード"
          value={passwordInput}
          onChange={handleChangePassword}
        />
        <p className={styles.inputPolicy}>半角英数字8字～20字(必須: 英大文字・英小文字・数字)</p>
        {type === "login" && (
          <>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              パスワードを表示
            </label>
            <Login
            loginFunction={loginFunction}
            changeInput={changeInput}
            />
          </>
        )}
        {type === "register" && (
          <>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="パスワード(確認用)"
              value={confirmInput}
              onChange={handleChangeConfirm}
            />
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              パスワードを表示
            </label>
            <input 
              type="text"
              placeholder="ユーザー名"
              value={userNameInput}
              onChange={handleChangeName}
            />
            <p className={styles.inputPolicy}>2字～20字</p>
            <Register
              resgisterFunction={resgisterFunction}
              changeInput={changeInput}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

interface LoginProps {
  loginFunction: () => void;
  changeInput: (mode: string) => void;
};

const Login: React.FC<LoginProps> = ({
  loginFunction,
  changeInput
}) => {
  return (
    <>
      <button 
        className={styles.button}
        onClick={() => loginFunction()}
      >
        ログイン
      </button>
      <button
        className={styles["link-button"]}
        onClick={() => changeInput("register")}
      >
        新規登録はこちらから
      </button>
    </>
  );
};

interface RegisterProps {
  resgisterFunction: () => void;
  changeInput: (mode: string) => void;
};

const Register: React.FC<RegisterProps> = ({
  resgisterFunction,
  changeInput
}) => {
  return (
    <>
      <button 
        className={styles.button}
        onClick={() => resgisterFunction()}
      >
        登録
      </button>
      <button
        className={styles["link-button"]}
        onClick={() => changeInput("login")}
      >
        戻る
      </button>
    </>
  );
};

