import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localizedPath } from '../utils/locale-routes';

// Like useNavigate(), but translates + locale-prefixes string destinations so
// programmatic navigation lands on the correct /<lang>/<localized> URL.
export const useLocaleNavigate = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  return (to, opts) =>
    navigate(typeof to === 'string' ? localizedPath(to, i18n.language) : to, opts);
};

export default useLocaleNavigate;
