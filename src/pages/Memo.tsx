import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

import { useErrorModal } from '../components/Hooks/useErrorModal';
import { useAlertModal } from '../components/Hooks/useAlertModal';

import { messages } from '../constants/message'
import { MemoInterface, FolderInterface } from '../constants/stateInterface';
import { getMemoByUser } from '../api/memoApi';
import {
  getCustomFolderByUser,
} from '../api/customFolderApi';

import { isMobileAtom } from '../atoms/mediaAtom'
import { viewModeAtom, previousViewModeAtom, ViewMode } from '../atoms/viewmodeAtom'
import { useUserContext } from '../contexts/UserContext';

import { MemoEdit } from './Editer'
import { Files } from './File'
import { CustomFolder } from './Folder'

import styles from './Memo.module.css';

const Memo: React.FC = () => {
  const showErrorModal = useErrorModal();
  const showAlertModal = useAlertModal();

  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [previousViewMode] = useAtom(previousViewModeAtom);
  const [isMobile] = useAtom(isMobileAtom);

  const { user } = useUserContext();

  const [folders, setfolders] = useState<FolderInterface[]>([]);
  const [memos, setMemos] = useState<MemoInterface[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FolderInterface | null>(null);
  const [selectedMemo, setSelectedMemo] = useState<MemoInterface | null>(null);
  const [editType, setEditType] = useState<string>('');
  const [isEditting, setIsEditting] = useState<boolean>(false);
  const [showBack, setShowBack] = useState<ViewMode>('files');

  useEffect(() => {
    // 初回レンダリング時にデータ取得
    fetchData();
    // ブラウザバック時にモーダルの後ろで画面遷移してしまう事象を防いでいる。
    window.history.pushState({ user }, '', window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ViewModeがフォルダとなった時にバックグラウンドでえ表示するセクションを決定
  useEffect(() => {
    if (viewMode === 'folder') {
      setShowBack(previousViewMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode])

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

  // すべてのメモを表示する。
  const clickAllFolder = async () => {
    if (isMobile) {
      const isChange = await changeFolderForMobile();

      if (!isChange) {
        return;
      }
      setIsEditting(false);
      setSelectedMemo(null);
    }
    setSelectedFolder(null);
    setViewMode('files');
  }

  // モバイルの場合はフォルダの切り替えにより画面が切り替わるので、確認する。
  const changeFolderForMobile = async () => {
    let confirm = true;
    if (isMobile && isEditting) {
      if (editType === "create") {
        confirm = await showAlertModal(messages.WARNING.W010);
      } else if (editType === "update") {
        confirm = await showAlertModal(messages.WARNING.W011);
      }
    }
    return confirm;
  }

  return (
    <div className={styles["main-container"]}>
      {/*PCまたは表示モードがfoldersの時に表示。スマホの時は画面の左80%をフォルダセクションと表示する。*/}
      {(!isMobile || viewMode === 'folder') && (
        <aside className={styles["folder-section"]} data-open={isMobile && viewMode === "folder"}>
          {/*残りの20%が押下された場合は、元の状態に戻す*/}
          {isMobile && viewMode === 'folder' && (
            <div
              className={styles["folder-overlay"]}
              onClick={() => {
                setViewMode(previousViewMode);
              }}
            />
          )}
          <div className={styles["allFolder-container"]}>
            <button
              className={styles["Folder-button"]}
              onClick={() => clickAllFolder()}
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
      )}
      {/*PCまたは表示モードがfilesの時に表示*/}
      {(!isMobile || (viewMode === 'files' || (viewMode === 'folder' && showBack === 'files'))) && (
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
      )}
      {(!isMobile || (viewMode === 'editor' || (viewMode === 'folder' && showBack === 'editor'))) && (
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
      )}
    </div>
  );
};

export default Memo;
