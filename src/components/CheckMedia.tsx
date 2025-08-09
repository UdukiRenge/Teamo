import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { isMobileAtom } from '../atoms/mediaAtom';

const MOBILE_BREAKPOINT = 1000;

export const CheckMedia = () => {
  const setIsMobile = useSetAtom(isMobileAtom);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return null;
};