import { useState, useEffect } from 'react';

import { useErrorModal } from '../components/Hooks/useErrorModal';
import { useAlertModal } from '../components/Hooks/useAlertModal';

import { messages } from '../constants/message'
import { MemoInterface, FolderInterface } from '../constants/stateInterface';
import { getMemoByUser } from '../api/memoApi';
import {
  getCustomFolderByUser,
} from '../api/customFolderApi';

import { useUserContext } from '../contexts/UserContext';

import { MemoEdit } from './Editer'
import { Files } from './File'
import { CustomFolder } from './Folder'

import styles from './Memo.module.css';

const Memo: React.FC = () => {
  const showErrorModal = useErrorModal();
  const showAlertModal = useAlertModal();

  const { user } = useUserContext();

  const [folders, setfolders] = useState<FolderInterface[]>([]);
  const [memos, setMemos] = useState<MemoInterface[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderInterface | null>(null);
  const [selectedMemo, setSelectedMemo] = useState<MemoInterface | null>(null);
  const [editType, setEditType] = useState<string>('');
  const [isEditting, setIsEditting] = useState<boolean>(false);

  useEffect(() => {
    // 初回レンダリング時にデータ取得
    fetchData();
    // ブラウザバック時にモーダルの後ろで画面遷移してしまう事象を防いでいる。
    window.history.pushState({ user }, '', window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    // 無限ループの回避
    (async () => {
      try {
        // contextにユーザー情報が格納されているか確認
        if (user && user.user_id) {
          // ユーザーIDに基づきメモとフォルダの一覧を取得する。
          const [getMemos, getFolders] = await Promise.all([
            getMemoByUser(user?.user_id),
            getCustomFolderByUser(user?.user_id),
          ]);
          // いずれかの取得結果がfalseであった場合
          if (!getMemos.success || !getFolders.success) {
            // エラーダイアログ「システムエラーが発生しました。トップページに遷移します。」
            await showErrorModal(messages.ERROR.E001);
            return;
          } 
          setMemos(getMemos.memos);
          setfolders(getFolders.folders);
        } else {
          // エラーダイアログ「システムエラーが発生しました。トップページに遷移します。」
          await showErrorModal(messages.ERROR.E001);
          return;
        }
      } catch (error) {
        console.error(error);
        // エラーダイアログ「システムエラーが発生しました。トップページに遷移します。」
        await showErrorModal(messages.ERROR.E001);
        return;
      }
    })();
  };

  return (
    <div className={styles["main-container"]}>
      <aside className={styles["folder-section"]}>
        <div className={styles["allFolder-container"]}>
          <button
            className={styles["Folder-button"]}
            onClick={() => setSelectedFolder(null)}
          >
            <img src="/folder.png" />
            すべてのメモ
          </button>
          <CustomFolder
            folders={folders}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            onRefresh={fetchData}
          />
        </div>
      </aside>
      <Files
        memos={memos}
        selectedMemo={selectedMemo}
        setSelectedMemo={setSelectedMemo}
        selectedFolder={selectedFolder}
        editType={editType}
        setEditType={setEditType}
        isEditting={isEditting}
        setIsEditting={setIsEditting}
        onRefresh={fetchData}
      />
      <MemoEdit
        selectedMemo={selectedMemo}
        setSelectedMemo={setSelectedMemo}
        folders={folders}
        editType={editType}
        setEditType={setEditType}
        isEditting={isEditting}
        setIsEditting={setIsEditting}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default Memo;
