import { atom } from 'jotai';

// 画面幅がモバイル相当かどうかを管理するAtom
export const isMobileAtom = atom<boolean>(false);