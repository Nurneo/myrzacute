import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import { translations, t } from "@/content/translations";

const NotFound = () => {
  const location = useLocation();
  const { lang } = useLang();
  const tr = translations.notFound;

  useEffect(() => {
    console.error(
      "404 Error: Attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">{t(tr.message, lang)}</p>
        <Link to="/" className="text-primary hover:underline font-medium">
          {t(tr.back, lang)}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
