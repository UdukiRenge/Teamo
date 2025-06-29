import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  isModalOpenAtom,
  modalMessageAtom,
  modalResolveAtom,
  modalTypeAtom,
} from '../atoms/modalAtom';
import { messages } from '../constants/message';

import styles from './Modal.module.css';

const Modal = () => {
  const navigate = useNavigate(); 

  const [isOpen, setIsOpen] = useAtom(isModalOpenAtom);
  const [message, setMessage] = useAtom(modalMessageAtom);
  const [resolve, setResolve] = useAtom(modalResolveAtom);
  const [type, setType] = useAtom(modalTypeAtom);

const close = (result: boolean | void = true) => {
  setIsOpen(false);
  setMessage(null);
  setType(null);

  if (resolve) {
    resolve(result);
    setResolve(null);
  }

  if (message === messages.ERROR.E001) {
    navigate('/');
  }
};

  if (!isOpen || !type) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <p>{message}</p>
        <div className={styles["modal-buttons"]}>
          <button className={styles["ok-button"]} onClick={() => close(true)}>OK</button>
          {type === 'alert' && (
            <button className={styles["cancel-button"]} onClick={() => close(false)}>キャンセル</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;