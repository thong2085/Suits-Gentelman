import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          {t("pageNotFound")}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{t("pageNotFoundMessage")}</p>
        <div className="mt-5">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
