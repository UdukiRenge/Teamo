import { atom } from 'jotai';

// ポップアップの開閉を管理
export const isPopupOpenAtom = atom(false);
// ポップアップに表示するメッセージ
export const popupMessageAtom = atom<string | null>(null);
// フェードアウト中かどうか
export const isFadingOutAtom = atom(false); 