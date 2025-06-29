import { useSetAtom } from 'jotai';
import {
  isModalOpenAtom,
  modalMessageAtom,
  modalResolveAtom,
  modalTypeAtom,
} from '../../atoms/modalAtom';

export const useAlertModal = () => {
  const setIsOpen = useSetAtom(isModalOpenAtom);
  const setMessage = useSetAtom(modalMessageAtom);
  const setResolve = useSetAtom(modalResolveAtom);
  const setType = useSetAtom(modalTypeAtom);

  return (message: string): Promise<boolean> =>
    new Promise<boolean>((resolve) => {
      setMessage(message);
      setType('alert');
      setResolve(() => resolve);
      setIsOpen(true);
    });
};