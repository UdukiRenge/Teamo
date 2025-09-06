import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import { isLoginAtom } from '../atoms/loginAtom';

import styles from './Note.module.css';

type ReleaseItem = {
  date: string;
  version: string;
  changes: string[];
};

const releaseNotes: ReleaseItem[] = [
  {
    date: '2025-06-24',
    version: 'v1.0.0',
    changes: [
      'リリースしました。',
    ],
  },
  {
    date: '2025-08-10',
    version: 'v2.0.0',
    changes: [
      'スマートフォン・タブレット向けのレイアウトを作成しました。',
    ],
  },
  {
    date: '2025-08-12',
    version: 'v2.1.0',
    changes: [
      'メモのダウンロード機能を追加しました。',
    ],
  },
  {
    date: '2025-08-13',
    version: 'v2.2.0',
    changes: [
      'SEO対応を実施しました。',
    ],
  },
  {
    date: '2025-08-18',
    version: 'v2.3.0',
    changes: [
      'メモの削除方法を変更しました。',
      '背景画像の読み込み速度を向上させました。'
    ],
  },
  {
    date: '2025-08-23',
    version: 'v3.0.0',
    changes: [
      'メモの装飾機能を追加しました。'
    ],
  },
  {
    date: '2025-09-06',
    version: 'v3.0.0',
    changes: [
      '初回起動時の処理遅延を改善しました。'
    ],
  },
];

const Note: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin] = useAtom(isLoginAtom);

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
      <div className={styles["note-container"]}>
        <h1 className={styles.title}>リリースノート</h1>
        <table className={styles.table}>
        <thead>
          <tr>
            <th>バージョン</th>
            <th>日付</th>
            <th>変更内容</th>
          </tr>
        </thead>
        <tbody>
          {releaseNotes.map((note, index) => (
            <tr key={index}>
              <td className={styles.version}>{note.version}</td>
              <td>{note.date}</td>
              <td>
                <ul className={styles.changeList}>
                  {note.changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        className={styles.buttons}
        style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
        onClick={() => backScreen()}
      >
        戻る
      </button>
      </div>
    </div>
  );
}

export default Note;