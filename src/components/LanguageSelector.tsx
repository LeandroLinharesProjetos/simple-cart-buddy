
import React from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="flex items-center">
      <Globe className="h-4 w-4 text-teal-500 mr-2" />
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[130px] h-8 text-sm bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt">{t('languages.pt')}</SelectItem>
          <SelectItem value="en">{t('languages.en')}</SelectItem>
          <SelectItem value="es">{t('languages.es')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
