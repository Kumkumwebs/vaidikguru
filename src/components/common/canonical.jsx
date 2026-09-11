
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://vaidikguru.com";

const Canonical = () => {
  const { pathname } = useLocation();

  // Remove trailing slash except for homepage
  const cleanPath =
    pathname === "/"
      ? "/"
      : pathname.replace(/\/+$/, "");

  const canonicalUrl = `${SITE_URL}${cleanPath}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default Canonical;

