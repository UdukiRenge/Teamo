import { useSetAtom } from 'jotai';
import {
  isModalOpenAtom,
  modalMessageAtom,
  modalResolveAtom,
  modalTypeAtom,
} from '../../atoms/modalAtom';

export const useErrorModal = () => {
  const setIsOpen = useSetAtom(isModalOpenAtom);
  const setMessage = useSetAtom(modalMessageAtom);
  const setResolve = useSetAtom(modalResolveAtom);
  const setType = useSetAtom(modalTypeAtom);

  return (message: string): Promise<void> =>
    new Promise<void>((resolve) => {
      setMessage(message);
      setType('error');
      setResolve(() => () => resolve());
      setIsOpen(true);
    });
};