import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import Navbar from '@components/common/navbar';
import { DEFAULT_LOCALE, useLocale, type Locale } from '@data/locale-context';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';


type LanguageOption = {
  label: string;
  value: Locale;
  flag: string;
  icon: string;
};

const languageOptions: LanguageOption[] = [
  {
    label: 'English',
    value: 'en-US',
    flag: '🇺🇸',
    icon: 'translate',
  },
  {
    label: 'Türkçe',
    value: 'tr-TR',
    flag: '🇹🇷',
    icon: 'translate',
  },
];

const Settings = () => {
  const { l10n } = useLocalization();
  const { locale, setLocale } = useLocale();
  const colors = useColors();

  const handleLanguageChange = (language: Locale) => {
    setLocale(language);
  };

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('settings')} />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-lg font-content-bold mb-4">
            {l10n.getString('language')}
          </Text>
          <View className="gap-3">
            {languageOptions.map(option => (
              <LanguageCard
                key={option.value}
                option={option}
                isSelected={locale === option.value}
                onPress={() => handleLanguageChange(option.value)}
                colors={colors}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

type LanguageCardProps = {
  option: LanguageOption;
  isSelected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
};

const LanguageCard = ({
  option,
  isSelected,
  onPress,
  colors,
}: LanguageCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`flex-row items-center p-4 rounded-xl border-2 ${
          isSelected
            ? 'border-primary bg-primary/10'
            : 'border-gray-200 bg-background-secondary'
        }`}
      >
        <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-4">
          <Text className="text-2xl">{option.flag}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-content-bold">{option.label}</Text>
          <Text className="text-sm opacity-60">{option.value}</Text>
        </View>
        {isSelected && (
          <MaterialIcon
            name="check-circle"
            size={24}
            color={colors.primary}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Settings;
