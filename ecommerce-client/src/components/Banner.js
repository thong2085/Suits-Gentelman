import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-primary text-white py-20 px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">{t("welcomeMessage")}</h1>
      <p className="text-xl text-black mb-8">{t("heroSubtitle")}</p>
      <Link to="/products" className="btn btn-lg">
        {t("shopNow")}
      </Link>
    </div>
  );
};

export default Banner;
