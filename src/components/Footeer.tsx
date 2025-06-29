import styles from './Footer.module.css'

import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className={styles.footer}>
      <button
        className={styles.link}
        onClick={() => navigate("/Inquirie")}
      >
        お問い合わせ
      </button>
      <button
        className={styles.link}
        onClick={() => navigate("/Note")}
      >
        リリースノート
      </button>
    </header>
  );
};

export default Footer;