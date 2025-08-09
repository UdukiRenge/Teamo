// atoms/viewModeAtom.ts
import { atom } from 'jotai';

export type ViewMode = 'folder' | 'files' | 'editor';

// 現在のモード
export const viewModeAtom = atom<ViewMode>('files');

// 前回のモードを記憶する
export const previousViewModeAtom = atom<ViewMode>('files');