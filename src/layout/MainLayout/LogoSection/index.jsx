import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
import bookLogo from 'assets/images/book.png'; // <-- import your image

export default function LogoSection() {
  return (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo">
      <img
        src={bookLogo}
        alt="Book Logo"
        style={{ width: 180, height: 50 }} // adjust size as needed
      />
    </Link>
  );
}
