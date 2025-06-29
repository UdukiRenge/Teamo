import { useAtom } from 'jotai';
import {
  isPopupOpenAtom,
  popupMessageAtom,
  isFadingOutAtom,
} from '../atoms/popupAtom';
import { useEffect } from 'react';

import styles from './Popup.module.css';

const Popup = () => {
  const [isOpen, setIsOpen] = useAtom(isPopupOpenAtom);
  const [message, setMessage] = useAtom(popupMessageAtom);
  const [isFadingOut, setIsFadingOut] = useAtom(isFadingOutAtom);

  useEffect(() => {
    if (isOpen) {
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 2500); // フェードアウト開始

      const closeTimer = setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
        setIsFadingOut(false);
      }, 3000); // 完全に非表示

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(closeTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.popup} ${isFadingOut ? styles['fade-out'] : ''}`}>
      {message}
    </div>
  );
};

export default Popup;