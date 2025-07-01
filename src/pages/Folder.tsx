import { useState, useEffect, useRef } from 'react';

import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { FolderInterface } from '../constants/stateInterface';
import {
  createCustomFolder,
  updateCustomFolder,
  deleteCustomFolder,
} from '../api/customFolderApi';

import { useUserContext } from '../contexts/UserContext';

import { useErrorModal } from '../components/Hooks/useErrorModal';
import { usePopup } from '../components/Hooks/usePopup';

import { messages } from '../constants/message'

interface FolderProps {
  folders: FolderInterface[];
  selectedFolder: FolderInterface | null;
  setSelectedFolder: React.Dispatch<
    React.SetStateAction<FolderInterface | null>
  >;
  onRefresh: () => void;
}

import styles from './Folder.module.css';

export const CustomFolder: React.FC<FolderProps> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  onRefresh,
}) => {
  const { user } = useUserContext();

  // リストの開閉状態
  const [isOpen, setIsOpen] = useState(false);
  // メニューの開閉
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  // フォルダ作成フラグ
  const [creatFlg, setCreateFlg] = useState<boolean>(false);
  // 名前変更フラグ
  const [renameFlg, setRenameFlg] = useState<boolean>(false);
  // インプットのフォルダ名
  const [editFolderName, setEditFolderName] = useState<string>('');
  // メニューボタンの位置を格納する
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showErrorModal = useErrorModal();
  const showPopup = usePopup();

  const creatFolderRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // クリックされた要素がメニューまたはメニューボタンでなければメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // すべてのメニューボタンとメニューのDOM要素を取得
      const menuButtons = document.querySelectorAll(`.${styles['folderMenu-button']}`);
      const menuContainer = document.querySelector(`.${styles['FolderCD-container']}`);

      let isClickInsideMenuButton = false;

      // クリックされた要素がどれかのメニューボタンかどうかチェック
      menuButtons.forEach((button) => {
        if (button.contains(event.target as Node)) {
          isClickInsideMenuButton = true;
        }
      });

      // メニュー外のクリックだった場合、メニューを閉じる
      if (
        !isClickInsideMenuButton &&
        (!menuContainer || !menuContainer.contains(event.target as Node))
      ) {
        setOpenMenu(false);
      }
    };

    // イベントリスナー
    window.addEventListener('click', handleClickOutside);

    // クリーンアップ
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 新規フォルダ作成時のインプットにカーソルを移動
  useEffect(() => {
    if (!creatFlg) {
      return;
    }
    creatFolderRef.current?.focus();
  }, [creatFlg]);

  // フォルダ名変更時のインプットにカーソルを移動
  // 変更前のフォルダ名を監視対象とする。
  useEffect(() => {
    if (!renameFlg || !selectedFolder) {
      setEditFolderName('');
      return;
    }
    renameInputRef.current?.focus();
    setEditFolderName(selectedFolder.folder_name);
  }, [renameFlg, selectedFolder]);

  // メニューボックスを開く
  const toggleMenu = (
    folder: FolderInterface,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.top + window.scrollY - 160,
      // top: rect.top + window.scrollY - 152,
      left: rect.right + window.scrollX,
    });
    // Todo:OpenMenuIdを真偽値にできないか検討
    setSelectedFolder(folder);
    setOpenMenu(true);
  };

  // フォルダ新規作成開始
  const createFolder = () => {
    setCreateFlg(true);
    setIsOpen(true);
  };

  // フォルダ名の入力
  const handleChangeFolderName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditFolderName(event.target.value);
  };

  // フォルダインプットからカーソルが外れた場合、またはEnterが押下された時に作成・更新処理を実施
  const handleSubmitFolderName = async () => {
    if (isSubmitting) {
      return;
    } else {
      setIsSubmitting(true);
    }
    // インプットが空かどうか判別
    if (editFolderName.trim() !== '') {
      if (creatFlg) {
        if (user && user.user_id) {
          const user_id = user.user_id;
          // 新規フォルダ作成
          await createCustomFolder({ user_id, folder_name: editFolderName });
          showPopup(messages.INFO.I005);
        }
      } else if (
        renameFlg &&
        openMenu &&
        selectedFolder &&
        editFolderName !== selectedFolder.folder_name
      ) {
        // フォルダ名更新
        const updateData = {
          folder_name: editFolderName,
        };
        await updateCustomFolder(selectedFolder._id, updateData);
        showPopup(messages.INFO.I006);
      }
    }
    setEditFolderName('');
    setCreateFlg(false);
    setRenameFlg(false);
    setOpenMenu(false);
    setIsSubmitting(false);
    // 再レンダリング
    onRefresh();
  };

  const handleKeyDownFolderInput = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSubmitFolderName();
    }
  };

  // 選択されたフォルダを削除する。
  // const deleteFolder = async (deleteFolderId: string) => {
  const deleteFolder = async () => {
    try {
      if (selectedFolder) {
        await deleteCustomFolder(selectedFolder._id);
        showPopup(messages.INFO.I007);
      }
    } catch {
      // 「システムエラーが発生しました。トップページに遷移します。」
      await showErrorModal(messages.ERROR.E001);
    }
    setOpenMenu(false);
    onRefresh();
  };

  return (
    <div className={styles["customFolder"]}>
      <button className={styles["list-header"]} onClick={() => setIsOpen(!isOpen)}>
        カスタムフォルダ {isOpen ? '▼' : '▶'}
      </button>
      <button className={styles["folderPlus-button"]} onClick={() => createFolder()}>
        <AiOutlinePlus color="#a8a8a8" />
      </button>
      {isOpen && (
        <div className={styles["folder-list"]}>
          {folders.map((folder) => (
            <div key={folder._id} className={styles["folder-container"]}>
              <button
                className={styles["Folder-button"]}
                onClick={() => setSelectedFolder(folder)}
              >
                <img src="/folder.png" alt="folder icon" />
                {renameFlg && openMenu && selectedFolder?._id === folder._id ? (
                  <input
                    ref={renameInputRef}
                    type="text"
                    name="FolderRename"
                    className={styles["Folder-input"]}
                    value={editFolderName}
                    onChange={handleChangeFolderName}
                    onBlur={handleSubmitFolderName}
                    onKeyDown={handleKeyDownFolderInput}
                    // 親要素に動作を伝播させない
                    onClick={(e) => e.stopPropagation()}
                    disabled={isSubmitting}
                  />
                ) : (
                  folder.folder_name
                )}
              </button>
              <button
                className={styles["folderMenu-button"]}
                onClick={(event) => toggleMenu(folder, event)}
              >
                <BsThreeDotsVertical color="#a8a8a8" />
              </button>
            </div>
          ))}
          {creatFlg && (
            <div className={styles["newFolder"]}>
              <img src="/folder.png" alt="folder icon" />
              <input
                ref={creatFolderRef}
                name="newFolderName"
                value={editFolderName}
                onChange={handleChangeFolderName}
                onBlur={handleSubmitFolderName}
                onKeyDown={handleKeyDownFolderInput}
              />
            </div>
          )}
        </div>
      )}
      {openMenu && (
        <div
          className={styles["FolderCD-container"]}
            style={{
              position: 'absolute',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
          <button
            className={styles["FolderCD-buttons"]}
            onClick={() => setRenameFlg(true)}
          >
            名前を変更
          </button>
          <button
            className={styles["FolderCD-buttons"]}
            onClick={() => deleteFolder()}
          >
            <p className={styles.redLine}>削除</p>
          </button>
        </div>
      )}
    </div>
  );
};
