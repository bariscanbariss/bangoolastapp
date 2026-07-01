import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const ContactUs = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const contactMethods = [
    {
      icon: 'email-outline',
      titleKey: 'contact-email',
      value: 'destek@bangoo.com.tr',
      action: () => Linking.openURL('mailto:destek@bangoo.com.tr'),
      color: twColors.blue[500],
    },
    {
      icon: 'phone-outline',
      titleKey: 'contact-phone',
      value: '+90 392 123 45 67',
      action: () => Linking.openURL('tel:+903921234567'),
      color: twColors.green[500],
    },
    {
      icon: 'whatsapp',
      titleKey: 'contact-whatsapp',
      value: '+90 532 123 45 67',
      action: () => Linking.openURL('https://wa.me/905321234567'),
      color: twColors.emerald[500],
    },
  ];

  const socialMedia = [
    { icon: 'facebook', color: '#1877F2', url: 'https://www.facebook.com/profile.php?id=61582619520721' },
    { icon: 'instagram', color: '#E4405F', url: 'https://www.instagram.com/bangoo_cyp/' },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('contact-us')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="headset" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('contact-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('contact-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Contact Methods */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('contact-methods-title')}
          </Text>
          <View className="gap-3 mb-8">
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                onPress={method.action}
                className="flex-row bg-white rounded-xl p-4 border border-gray-100 items-center"
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: method.color + '20' }}
                >
                  <MaterialIcon name={method.icon as any} size={24} color={method.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-content/60 text-sm">
                    {l10n.getString(method.titleKey)}
                  </Text>
                  <Text className="font-bold text-content">
                    {method.value}
                  </Text>
                </View>
                <MaterialIcon name="chevron-right" size={20} color={colors.content} style={{ opacity: 0.5 }} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Working Hours */}
          <View className="bg-gray-50 rounded-xl p-5 mb-8">
            <View className="flex-row items-center mb-3">
              <MaterialIcon name="clock-outline" size={24} color={colors.primary} />
              <Text className="text-lg font-bold text-content ml-2">
                {l10n.getString('contact-hours-title')}
              </Text>
            </View>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-content/70">{l10n.getString('contact-hours-weekdays')}</Text>
                <Text className="font-medium text-content">09:00 - 18:00</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-content/70">{l10n.getString('contact-hours-saturday')}</Text>
                <Text className="font-medium text-content">10:00 - 14:00</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-content/70">{l10n.getString('contact-hours-sunday')}</Text>
                <Text className="font-medium text-content">{l10n.getString('contact-hours-closed')}</Text>
              </View>
            </View>
          </View>

          {/* Address */}
          <View className="bg-white rounded-xl p-5 border border-gray-100 mb-8">
            <View className="flex-row items-center mb-3">
              <MaterialIcon name="map-marker-outline" size={24} color={colors.primary} />
              <Text className="text-lg font-bold text-content ml-2">
                {l10n.getString('contact-address-title')}
              </Text>
            </View>
            <Text className="text-content/70 leading-5">
              {l10n.getString('contact-address-content')}
            </Text>
          </View>

          {/* Social Media */}
          <Text className="text-lg font-bold text-content mb-4">
            {l10n.getString('contact-social-title')}
          </Text>
          <View className="flex-row justify-center gap-4">
            {socialMedia.map((social, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(social.url)}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: social.color + '15' }}
              >
                <MaterialIcon name={social.icon as any} size={28} color={social.color} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ContactUs;
