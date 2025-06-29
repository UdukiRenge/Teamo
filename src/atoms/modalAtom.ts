import { atom } from 'jotai';

export type ModalType = 'info' | 'error' | 'alert' | null;

// モーダルの開閉を管理
export const isModalOpenAtom = atom(false);
// モーダルに表示するメッセージ
export const modalMessageAtom = atom<string | null>(null);
// 警告ダイアログのボタン押下に応じた値を保持（OK: true or キャンセル: false）
export const modalResolveAtom = atom<((result: boolean | void) => void) | null>(null);
// モーダル種別
export const modalTypeAtom = atom<ModalType>(null); 