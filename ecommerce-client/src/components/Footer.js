import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2023 E-Shop. {t("allRightsReserved")}</p>
      </div>
    </footer>
  );
};

export default Footer;
