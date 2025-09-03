import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updateUser, deleteUser } from '../api/userApi';
import { checkUserInfoUpdate } from '../services/checkUserInfo'

import { useUserContext } from '../contexts/UserContext';

import { useAlertModal } from '../components/Hooks/useAlertModal';
import { useErrorModal } from '../components/Hooks/useErrorModal';
import { usePopup } from '../components/Hooks/usePopup';

import { messages } from '../constants/message';

import styles from './UserManage.module.css';

const UserManage: React.FC = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUserContext();

  const showAlertModal = useAlertModal();
  const showErrorModal = useErrorModal();
  const showPopup = usePopup();

  const [updatePassword, setUpdatePassword] = useState<boolean>(false);
  const [nowPasswordInput, setNowPasswordInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [confirmInput, setConfirmInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userNameInput, setUserNameInput] = useState<string | undefined>(user?.user_name);

  // 現在のパスワードの入力をstateに保存
  const handleChangeNowPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '');
    setNowPasswordInput(alphanumericOnly);      
  };

  // 新しいパスワードの入力をstateに保存
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const alphanumericOnly = value.replace(/[^a-zA-Z0-9]/g, '');
    setPasswordInput(alphanumericOnly);      
  };

  // 新しいパスワード(確認用)の入力をstateに保存
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
  
  // パスワードインプットのクリア
  const passwordClear = () => {
    setNowPasswordInput("");
    setPasswordInput("");
    setConfirmInput("");
  }

  // パスワードの変更をキャンセルする。
  const passChangeCancel = () => {
    passwordClear();
    setUpdatePassword(false);
  }

  // 初回表示処理
  useEffect(() => {
    const checkContext = async () =>{
      // useContextにのユーザー情報を確認することで、正常の遷移か確認する。
      if (!user || !user.user_id) {
        // 「システムエラーが発生しました。トップページに遷移します。」
        await showErrorModal(messages.ERROR.E001);
        return;
      }
    }
    checkContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ユーザー情報を更新する。
  const updateUserInfo = async () => {
    // 入力チェックを実施
    const inputCheck = checkUserInfoUpdate(nowPasswordInput, passwordInput, confirmInput, userNameInput);

    // 入力が不正であった場合は、エラーダイアログを出力する。
    if (!inputCheck.success) {
      await showErrorModal(inputCheck.errorMessage ?? messages.ERROR.E001);
      return;
    }

    // 更新内容に変更がない場合、処理を終了する。
    // パスワードに変更がない
    // ユーザー名が未入力または変更なし
    if (
      (passwordInput === nowPasswordInput) &&
      (!userNameInput || userNameInput === user?.user_name)
    ) {
      return;
    }

    const userData = {
      nowPassword: nowPasswordInput,
      password: passwordInput,
      user_name: userNameInput
    };

    try {
      if (user?.user_id) {
        // ユーザー情報の更新を実施
        const userUpdateResponse = await updateUser(user?.user_id, userData);

        if (!userUpdateResponse.success) {
          switch (userUpdateResponse.code) {
            case 'USER_NOTFOUND':
            await showErrorModal(messages.ERROR.E011);
            break;
            case 'PASSWORD_ERROR':
              await showErrorModal(messages.ERROR.E010);
              break;
            default:
              await showErrorModal(messages.ERROR.E001);
          }
          return;
        }

        // 現在のユーザー情報を変更したユーザー情報に変更
        setUser({
          user_id: user.user_id,
          user_name: userNameInput
        })

        // 新規パスワード入力エリアをクリア
        passwordClear();
        // パスワード更新を解除
        setUpdatePassword(false);
      }
      showPopup(messages.INFO.I008);
    } catch {
      // 「システムエラーが発生しました。トップページに遷移します。」
      await showErrorModal(messages.ERROR.E001);
      return;
    }
  }

  // ユーザーを削除する
  const deleteUserInfo = async () => {
    // 本当に削除を実行するか確認
    const deleteCheck = await showAlertModal(messages.WARNING.W007);

    if (!deleteCheck) {
      return;
    }

    // ユーザーの削除を実行する。
    try {
      if (user?.user_id) {
        await deleteUser(user?.user_id);
        // ユーザー情報をクリア
        setUser(null);

        // ログイン画面に遷移
        navigate('/');

        // 退会完了のメッセージを表示
        await showPopup(messages.INFO.I010);
      }
    } catch {
      // 「システムエラーが発生しました。トップページに遷移します。」
      await showErrorModal(messages.ERROR.E001);
      return;
    }
  }

  // 戻るボタン押下
  const backScreen = async () => {
    // 新規パスワードの入力がある。またはユーザー名が現在の値と異なる場合
    if (
      passwordInput || 
      confirmInput ||
      (userNameInput !== user?.user_name)
    ) {
      await showErrorModal(messages.WARNING.W008);
    }
    navigate('/Memo');
  }
    
  return (
    <div className={styles.container}>
      <div className={styles["input-container"]}>
        <p className={styles.title}>ユーザー情報編集</p>
        <p className={styles.itemText}>ユーザーID</p>
        <input 
          type="text"
          value={user?.user_id}
          disabled
        />
        {updatePassword ? (
          <>
            <p className={styles.itemText}>現在のパスワード</p>
            <input 
              type={showPassword ? "text" : "password"}
              value={nowPasswordInput}
              onChange={handleChangeNowPassword}
            />
            <p className={styles.inputPolicy}>半角英数字8字～20字(必須: 英大文字・英小文字・数字)</p>
                <p className={styles.itemText}>新しいパスワード</p>
            <input 
              type={showPassword ? "text" : "password"}
              value={passwordInput}
              onChange={handleChangePassword}
            />
            <p className={styles.itemText}>新しいパスワード(確認用)</p>
            <input 
              type={showPassword ? "text" : "password"}
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
            <button 
              className={styles["password-button"]}
              onClick={() => passChangeCancel()}
            >
              パスワード変更取り消し
           </button>
          </>
        ) : (
          <button 
            className={styles["password-button"]}
            onClick={() => setUpdatePassword(!updatePassword)}
          >
            パスワード変更
          </button>
        )}
        <p className={styles.itemText}>ユーザー名</p>
        <input 
          type="text"
          value={userNameInput}
          onChange={handleChangeName}
        />
        <p className={styles.inputPolicy}>2字～20字</p>
        <div className={styles["buttons-container"]}>
          <button 
            className={styles.buttons}
            style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
            onClick={() => backScreen()}
          >
            戻る
          </button>
          <button 
            className={styles.buttons}
            style={{ backgroundColor: '#007bff', color: 'white' }}
            onClick={() => updateUserInfo()}
          >
            更新
          </button>
          <button 
            className={styles.buttons}
            style={{ backgroundColor: 'red', color: 'white' }}
            onClick={() => deleteUserInfo()}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserManage;