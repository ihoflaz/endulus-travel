import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localizedPath } from '../utils/locale-routes';

// Drop-in replacement for react-router's <Link> that translates + locale-prefixes
// the `to` target (Turkish-canonical internal paths -> /<lang>/<localized>).
// Admin/external/anchor targets pass through untouched.
const LocaleLink = ({ to, ...rest }) => {
  const { i18n } = useTranslation();
  const target = typeof to === 'string' ? localizedPath(to, i18n.language) : to;
  return <Link to={target} {...rest} />;
};

export { LocaleLink };
export default LocaleLink;
