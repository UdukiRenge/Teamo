import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// アイコン
import { LuFileCheck } from 'react-icons/lu';
import { IoClose } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { IoTrashOutline } from 'react-icons/io5';

import { viewModeAtom } from '../atoms/viewmodeAtom';
import { useUserContext } from '../contexts/UserContext';

// カスタムフック
import { useAlertModal } from '../components/Hooks/useAlertModal'
import { useErrorModal } from '../components/Hooks/useErrorModal';
import { usePopup } from '../components/Hooks/usePopup';

import { MemoInterface, FolderInterface } from '../constants/stateInterface';

import { messages } from '../constants/message'

import {
  createMemo,
  updateMemo,
  deleteMemo
} from '../api/memoApi';

import { checkLength } from '../services/checkMaxLength';
import { htmlToText, sanitizeText } from '../services/sanitizeText';

import styles from './Editer.module.css';

// Propsのインタフェース
interface EditProps {
  selectedMemo: MemoInterface | null;
  setSelectedMemo: React.Dispatch<React.SetStateAction<MemoInterface | null>>;
  folders: FolderInterface[];
  editType: string;
  setEditType: React.Dispatch<React.SetStateAction<string>>;
  isEditting: boolean;
  setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: () => void;
}

// ToDo: propsとしてstateの選択されたメモ、更新用関数、フォルダ一覧を受け取る
export const MemoEdit: React.FC<EditProps> = ({
  selectedMemo,
  setSelectedMemo,
  folders,
  editType,
  setEditType,
  isEditting,
  setIsEditting,
  onRefresh
}) => {
  const showAlertModal = useAlertModal();
  const showErrorModal = useErrorModal();
  const showPopup = usePopup();

  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const { user } = useUserContext();

  // 保存先フォルダ
  const [saveFolder, setsaveFolder] = useState<string>("");
  // タイトル
  const [title, setTitle] = useState<string>("");
  // 本文
  const [text, setText] = useState<string>("");

  // 編集情報を全て空にする
  const cancelEditInfo = () => {
    setsaveFolder('')
    setTitle('');
    setText('');
  }

  // 編集をやめる
  const cancelEdit = () => {
    setEditType('');
    setIsEditting(false);
  }

  // 保存先フォルダの選択を保存
  const handleChangeSaveFolder = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setsaveFolder(event.target.value);
  };

  // タイトルを保存
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // ファイル選択時にメモ欄を表示する。
  useEffect(() => {
    if (selectedMemo) {
      setsaveFolder(selectedMemo?.folder_id || '');
      setTitle(selectedMemo?.title || '');
      if (selectedMemo?.text || '') {
        // ReactQuill がマウントされるのを待ってからセット
        setTimeout(() => {
          setText(selectedMemo.text!);
        }, 0);
      }
    } else if (selectedMemo === null) {
      cancelEditInfo();
    }
  }, [selectedMemo]);

  // 編集中であることを示すフラグを立てる
  useEffect(() => {
    if (editType === 'create') {
      if (saveFolder || title || text) {
        setIsEditting(true);
      }
    } else if (editType === 'update') {
      if (!selectedMemo) {
        return;
      }
      if (
        selectedMemo.title !== title ||
        (selectedMemo.folder_id !== saveFolder && selectedMemo.folder_id) ||
        selectedMemo.text !== sanitizeText(text)
      ) {
        setIsEditting(true);
      } else {
        // falseも明示することで、レスポンシブル対応時のイベントの呼出し順の差異に対応
        setIsEditting(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveFolder, title, text]);

  // メモを保存する。
  const saveMemoFanction = async () => {

    if (editType === 'create') {
      // 新規作成時
      if (title) {
        const titleCheck = checkLength(title, 50);
        if (!titleCheck) {
          await showErrorModal(messages.ERROR.E012);
          return;
        }
        if (user && user.user_id) {
          const user_id = user.user_id;

          const memoData = {
            user_id,
            folder_id: saveFolder ? saveFolder : undefined,
            title,
            text: text ? sanitizeText(text) : undefined,
          }

          await createMemo(memoData);
          showPopup(messages.INFO.I002);
        }
        cancelEditInfo();
        cancelEdit();
        onRefresh();
      } else {
        // エラーダイアログ「タイトルは入力必須です。」
        await showErrorModal(messages.ERROR.E002);
        return;
      }
    } else if (editType === 'update') {
      // 更新時
      if (
        selectedMemo &&
        (
          selectedMemo.title !== title ||
          (selectedMemo.folder_id !== saveFolder && selectedMemo.folder_id) ||
          selectedMemo.text !== text
        )
      ) {
        const titleCheck = checkLength(title, 50);
        if (!titleCheck) {
          await showErrorModal(messages.ERROR.E012);
          return;
        }
        const updateData = {
          folder_id: saveFolder ? saveFolder : undefined,
          title: title ? title : undefined,
          text: text ? sanitizeText(text): undefined
        }
        await updateMemo(selectedMemo._id, updateData);
        showPopup(messages.INFO.I003);

        setIsEditting(false);
        // state側の情報も更新し、連続の更新を検知できるようにする。
        // 注:更新日時については、更新できていない
        setSelectedMemo({
          ...selectedMemo,
          folder_id: saveFolder,
          title: title,
          text: text
        });
        onRefresh();
      } else {
        return;
      }
    }
  };

  // メモを閉じる処理
  const closeMemoFanction = async () => {
    if (isEditting) {
      const isClose = await showAlertModal(messages.WARNING.W003);

      if (!isClose) {
        return;
      }
    }
    cancelEditInfo();
    cancelEdit();
    setSelectedMemo(null);
    setViewMode("files");
  };

  // メモをダウンロードする処理
  const downloadMemo = () => {
    const filename = title.trim() !== "" ? `${title}.txt` : "noname.txt";

    const plainText = htmlToText(text);
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();

    URL.revokeObjectURL(url); // メモリ解放
  }

  // 削除ボタンをクリック
  const onClickDelete = async () => {
    // 選択されているメモがある場合は、メモの削除を確認
    if (selectedMemo) {
      const modalCheck = await showAlertModal(messages.WARNING.W005);

      if (!modalCheck) {
        return;
      }

      await deleteMemo(selectedMemo._id);
      showPopup(messages.INFO.I004);
    }
    setSelectedMemo(null);    
    setEditType('');
    setIsEditting(false);
    setViewMode('files');
    onRefresh();
  };

  return (
    <section className={`${styles['memo-section']} ${viewMode === "folder" ? styles['dimmed'] : ''}`}>
      {(editType) && (
        <>
          <input 
            type="text"
            className={styles["title-input"]}
            placeholder="タイトルを入力"
            value={title}
            onChange={handleChangeTitle}
          />
          <select 
            className={styles["folder-select"]}
            value={saveFolder}
            onChange={handleChangeSaveFolder}
          >
            <option value="">保存先を選択 -- デフォルト：すべてのメモ --</option>
            {folders.map((folder) => (
              <option 
                key={folder._id}
                value={folder._id}
              >
                {folder.folder_name}
              </option>
            ))}
          </select>
          <div className={styles["edit-options"]}>
            <button 
              title="保存"
              className={styles["tool-button"]}
              onClick={() => saveMemoFanction()}
            >
              <LuFileCheck color="#44e782" size={25}/>
            </button>
            <button
              title="閉じる"
              className={styles["tool-button"]}
              onClick={() => closeMemoFanction()}
            >
              <IoClose color="#cc1c1c" size={25}/>
            </button>
            <button
              title="ダウンロード"
              className={styles["tool-button"]}
              onClick={() => downloadMemo()}
            >
              <LuDownload color="#1c1d31ff" size={25}/>
            </button>
            <button
              title="削除"
              className={styles["tool-button"]}
              onClick={() => onClickDelete()}
            >
            <IoTrashOutline color="#1c1d31ff" size={25}/>
          </button>
          </div>
          <Textarea
            value={text}
            onChange={setText}
          />
        </>
      )}
    </section>
  );
};

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const Textarea: React.FC<TextareaProps> = ({ value, onChange }) => {

  const modules = {
    toolbar: [
      ["bold", "underline"],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  return (
    <ReactQuill
      className={`${styles.textarea} custom-quill`}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};