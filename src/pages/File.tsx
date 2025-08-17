import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';

import { AiOutlinePlus } from 'react-icons/ai';

import { viewModeAtom } from '../atoms/viewmodeAtom';

import { MemoInterface, FolderInterface } from '../constants/stateInterface';
import { useAlertModal } from '../components/Hooks/useAlertModal';
import { messages } from '../constants/message';

import styles from './File.module.css';

// Propsのインタフェース
interface FilesProps {
  memos: MemoInterface[];
  // 親要素のuseState更新用関数をpropsとして渡している。
  selectedMemo: MemoInterface | null;
  setSelectedMemo: React.Dispatch<React.SetStateAction<MemoInterface | null>>;
  selectedFolder: FolderInterface | null;
  editType: string;
  setEditType: React.Dispatch<React.SetStateAction<string>>;
  isEditting: boolean;
  setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: () => void;
}

export const Files: React.FC<FilesProps> = ({
  memos,
  selectedMemo,
  setSelectedMemo,
  selectedFolder,
  editType,
  setEditType,
  isEditting,
  setIsEditting
}) => {
  const showAlertModal = useAlertModal();
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  const [filteredMemos, setFilteredMemos] = useState<MemoInterface []>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchedMemos, setSearchedMemos] = useState<MemoInterface []>([]);

  // フォルダの選択によるメモの絞り込み
  useEffect(() => {
    if (selectedFolder) {
      const filtered = memos.filter((memo) => memo.folder_id === selectedFolder._id);
      setFilteredMemos(filtered);
    } else {
      // フォルダが選択されていない場合は、全メモをセット
      setFilteredMemos(memos);
    }
  }, [memos, selectedFolder])

  // 検索欄への入力制御
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }

  // メモの検索
  useEffect(() => {
    if (searchText) {
      const searched = filteredMemos.filter((fillterdMemo) => fillterdMemo.title.includes(searchText));
      setSearchedMemos(searched);
    } else {
      // 検索欄が空白の場合は、選択フォルダ内の全メモをセット
      setSearchedMemos(filteredMemos);
    }
  }, [searchText, filteredMemos])

  // ファイルボタンをクリック
  const onClickMemo = async (searchedMemo: MemoInterface) => {
    console.log(isEditting);
    if (isEditting) {
      // 編集中のメモがある場合は、確認
      let modalCheck;

      if (editType === 'create') {
        //メモを新規作成中です。内容を破棄し、別のメモを編集しますか？
        modalCheck = await showAlertModal(messages.WARNING.W001);
      } else if (editType === 'update') {
        //メモを編集中です。内容を破棄し、別のメモを開きますか？
        modalCheck = await showAlertModal(messages.WARNING.W004);
      }

      if (!modalCheck) {
        return;
      }
    }
    setSelectedMemo(searchedMemo);
    setEditType('update');
    setIsEditting(false);
    setViewMode("editor");
  };

  // 新規作成ボタンをクリック
  const onClickCreate = async () => {
    // 編集中のメモがある場合は、確認
    if (editType === 'update' && isEditting) {
      // メモを編集中です。内容を破棄し、新しいメモを作成しますか？
      const modalCheck = await showAlertModal(messages.WARNING.W002);

      if (!modalCheck) {
        return;
      }
    }
    setSelectedMemo(null);    
    setEditType('create');
    setIsEditting(false);
    setViewMode("editor");
  };

  return (
    <section className={`${styles['file-section']} ${viewMode === "folder" ? styles['dimmed'] : ''}`}>
      <div className={styles['fileoption-container']}>
        <div className={styles['fileCD-buttons']}>
          <button 
            className={styles["fileCD-button"]}
            onClick={() => onClickCreate()}
          >
            <AiOutlinePlus color="#FFFFFF" />
          </button>
        </div>
        <input 
          type="text"
          className={styles["search-input"]}
          placeholder="検索"
          value={searchText}
          onChange={handleChangeSearch}
        />
      </div>
      <div className={styles["files-container"]}>
        {searchedMemos.map((searchedMemo) => (
          <button
            key={searchedMemo._id}
            className={styles["file-button"]}
            style={{
              backgroundColor: selectedMemo?._id === searchedMemo._id ? '#c7efff' : 'white',
              border: `1px solid ${selectedMemo?._id === searchedMemo._id ? 'deepskyblue' : 'rgb(150, 150, 150)'}`,
            }}
            onClick={() => onClickMemo(searchedMemo)}
          >
            <span className={styles["fileButton-title"]}>{searchedMemo.title}</span>
            <span className={styles["fileButton-description"]}>{searchedMemo.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
};