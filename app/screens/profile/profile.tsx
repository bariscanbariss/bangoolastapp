import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import { useColors } from '@styles/hooks';
import { useNavigation } from '@react-navigation/native';
import Navbar from '@components/common/navbar';
import { useCustomer } from '@data/customer-context';
import { useLocale, type Locale } from '@data/locale-context';
import twColors from 'tailwindcss/colors';

type ProfileIconName = 'account-details' | 'text-box-multiple-outline' | 'map-marker-outline' | 'cog-outline' | 'logout' | 'account-circle' | 'chevron-right' | 'chevron-up' | 'chevron-down' | 'check' | 'domain' | 'tag-multiple' | 'store' | 'help-circle-outline';

type ProfileOptionType = {
  icon: ProfileIconName;
  label: string;
  onPress?: () => void;
};

type InfoCategoryType = {
  icon: ProfileIconName;
  label: string;
  category: 'corporate' | 'campaigns' | 'seller' | 'help';
  color: string;
};

const Profile = () => {
  const { l10n } = useLocalization();
  const navigation = useNavigation();
  const { customer, logout } = useCustomer();
  const { locale, setLocale } = useLocale();
  const colors = useColors();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languageOptions = [
    { label: 'English', value: 'en-US' as Locale, flag: '🇺🇸' },
    { label: 'Türkçe', value: 'tr-TR' as Locale, flag: '🇹🇷' },
  ];

  const handleLanguageChange = (lang: Locale) => {
    setLocale(lang);
    setShowLanguageMenu(false);
  };

  // Info categories for all users (guest and logged in)
  const infoCategories: InfoCategoryType[] = [
    {
      icon: 'domain',
      label: l10n.getString('corporate'),
      category: 'corporate',
      color: twColors.blue[500],
    },
    {
      icon: 'tag-multiple',
      label: l10n.getString('campaigns-menu'),
      category: 'campaigns',
      color: twColors.orange[500],
    },
    {
      icon: 'store',
      label: l10n.getString('seller'),
      category: 'seller',
      color: twColors.green[500],
    },
    {
      icon: 'help-circle-outline',
      label: l10n.getString('help'),
      category: 'help',
      color: twColors.purple[500],
    },
  ];

  if (!customer) {
    return (
      <View className="flex-1 bg-background p-safe">
        <Navbar title={l10n.getString('profile')} showBackButton={false} />
        <ScrollView className="flex-1">
          <View className="px-5 py-6">
            {/* Language Selector Button */}
            <View className="flex-row justify-end mb-4">
              <TouchableOpacity
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex-row items-center px-4 py-2 bg-gray-100 rounded-lg"
              >
                <Text className="text-base mr-2">
                  {languageOptions.find(opt => opt.value === locale)?.flag}
                </Text>
                <MaterialIcon
                  name={showLanguageMenu ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.content}
                />
              </TouchableOpacity>
              {showLanguageMenu && (
                <View className="absolute top-12 right-5 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                  {languageOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleLanguageChange(option.value)}
                      className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                      <Text className="text-xl mr-3">{option.flag}</Text>
                      <Text className="text-base flex-1">{option.label}</Text>
                      {locale === option.value && (
                        <MaterialIcon name="check" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Sign In Section */}
            <View className="items-center py-8 bg-white rounded-xl mb-6">
              <MaterialIcon
                name="account-circle"
                size={80}
                color={twColors.gray[300]}
              />
              <Text className="text-lg text-content mb-4 text-center mt-2">
                {l10n.getString('sign-in-to-view-your-profile')}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                className="bg-primary px-8 py-4 rounded-lg mb-3 w-full max-w-xs"
              >
                <Text className="text-white font-medium text-center">
                  {l10n.getString('sign-in')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                className="bg-white border-2 border-primary px-8 py-4 rounded-lg w-full max-w-xs"
              >
                <Text className="text-primary font-medium text-center">
                  {l10n.getString('register')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info Categories for Guest Users */}
            <View className="mt-2">
              <Text type="display" className="text-content mb-4 text-lg">
                {l10n.getString('help')} & {l10n.getString('corporate')}
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {infoCategories.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => (navigation as any).navigate('InfoPages', { category: cat.category })}
                    className="w-[48%] mb-3 p-4 bg-white rounded-xl border border-gray-100"
                    style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
                  >
                    <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: cat.color + '20' }}>
                      <MaterialIcon name={cat.icon} size={24} color={cat.color} />
                    </View>
                    <Text type="content" className="text-content font-medium">
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Main');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const options: ProfileOptionType[] = [
    {
      icon: 'account-details',
      label: l10n.getString('profile-information'),
      onPress: () => navigation.navigate('ProfileDetail'),
    },
    {
      icon: 'text-box-multiple-outline',
      label: l10n.getString('orders'),
      onPress: () => navigation.navigate('Orders'),
    },
    {
      icon: 'map-marker-outline',
      label: l10n.getString('shipping-addresses'),
      onPress: () => navigation.navigate('AddressList'),
    },
    {
      icon: 'cog-outline',
      label: l10n.getString('settings'),
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const logoutOption: ProfileOptionType = {
    icon: 'logout',
    label: l10n.getString('logout'),
    onPress: handleLogout,
  };

  return (
    <View className="flex-1 bg-background p-safe">
      {/* Header */}
      <Navbar title={l10n.getString('profile')} showBackButton={false} />

      <ScrollView className="flex-1">
        {/* Profile Info Section */}
        <View className="px-5 py-6">
          <View className="items-center mb-6">
            <MaterialIcon
              name="account-circle"
              size={100}
              color={twColors.gray[300]}
            />
            <Text type="display" className="text-content mb-1">
              {customer.first_name} {customer.last_name}
            </Text>
            <Text type="content" className=" text-content opacity-50">
              {customer.email}
            </Text>
          </View>

          {/* Account Options */}
          <View className="mt-4 gap-3">
            {options.map((option, index) => (
              <ProfileOption
                key={index}
                icon={option.icon}
                label={option.label}
                onPress={option.onPress}
              />
            ))}
          </View>

          {/* Info Categories Section */}
          <View className="mt-8">
            <Text type="display" className="text-content mb-4 text-lg">
              {l10n.getString('help')} & {l10n.getString('corporate')}
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {infoCategories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => (navigation as any).navigate('InfoPages', { category: cat.category })}
                  className="w-[48%] mb-3 p-4 bg-white rounded-xl border border-gray-100"
                  style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
                >
                  <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: cat.color + '20' }}>
                    <MaterialIcon name={cat.icon} size={24} color={cat.color} />
                  </View>
                  <Text type="content" className="text-content font-medium">
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <View className="mt-6">
            <ProfileOption
              icon={logoutOption.icon}
              label={logoutOption.label}
              onPress={logoutOption.onPress}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const ProfileOption = ({
  icon,
  label,
  onPress,
}: ProfileOptionType & { onPress?: () => void }) => {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center pb-4 px-4 rounded-lg border-b border-gray-200">
        <MaterialIcon name={icon} size={20} color={colors.content} />
        <Text type="content" className="flex-1 ml-3">
          {label}
        </Text>
        <MaterialIcon name="chevron-right" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

export default Profile;
