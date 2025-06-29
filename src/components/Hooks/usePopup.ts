import { useSetAtom } from 'jotai';
import {
  isPopupOpenAtom,
  popupMessageAtom
} from '../../atoms/popupAtom';

export const usePopup = () => {
  const setIsOpen = useSetAtom(isPopupOpenAtom);
  const setMessage = useSetAtom(popupMessageAtom);

  return (message: string): Promise<void> =>
    new Promise<void>((resolve) => {
      setMessage(message);
      setIsOpen(true);

      // 表示時間 + フェード時間後に resolve
      setTimeout(() => {
        resolve();
      }, 3000);
    }
  );
}