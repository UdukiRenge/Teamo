import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import { isLoginAtom } from '../atoms/loginAtom';

import { createInquirie } from '../api/inquirieApi';

import { useAlertModal } from '../components/Hooks/useAlertModal';
import { useErrorModal } from '../components/Hooks/useErrorModal';
import { usePopup } from '../components/Hooks/usePopup';

import { messages } from '../constants/message';

import styles from './Inquirie.module.css';

const Inquirie: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin] = useAtom(isLoginAtom);

  const showAlertModal = useAlertModal();
  const showErrorModal = useErrorModal();
  const showPopup = usePopup();

  const [inquirieInput, setInquirieInput] = useState<string>("");

  // ユーザー名の入力をstateに保存
  const handleChangeInquirie = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInquirieInput(value);      
  };

  // ユーザーを削除する
  const submitInquirie = async () => {
    //問い合わせ内容が空欄の場合、スルー
    if (!inquirieInput) {
      return;
    }

    // 本当に削除を実行するか確認
    const submitCheck = await showAlertModal(messages.WARNING.W009);

    if (!submitCheck) {
      return;
    }

    // ユーザーの削除を実行する。
    try {
      const createResponse = await createInquirie(inquirieInput);

      if (!createResponse.success) {
        await showErrorModal(messages.ERROR.E001);
        return;
      }
      
      setInquirieInput("");
      showPopup(messages.INFO.I009);
    } catch {
      // 「システムエラーが発生しました。トップページに遷移します。」
      await showErrorModal(messages.ERROR.E001);
      return;
    }
  }

  // 戻るボタン押下
  const backScreen = () => {
    if (isLogin) {
      navigate('/Memo');
    } else {
      navigate('/');
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles["input-container"]}>
        <p className={styles.title}>お問い合わせ</p>
        <p className={styles.explanation}>お問い合わせ・ご要望などございましたら以下のフォームからお送りください。</p>
        <textarea
          className={styles.textInput}
          value={inquirieInput}
          onChange={handleChangeInquirie}
        />
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
            onClick={() => submitInquirie()}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inquirie;