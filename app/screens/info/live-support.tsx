import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const LiveSupport = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const supportChannels = [
    {
      icon: 'chat-outline',
      titleKey: 'support-chat',
      descKey: 'support-chat-desc',
      availableKey: 'support-chat-available',
      color: twColors.blue[500],
      action: () => {},
    },
    {
      icon: 'whatsapp',
      titleKey: 'support-whatsapp',
      descKey: 'support-whatsapp-desc',
      availableKey: 'support-whatsapp-available',
      color: twColors.green[500],
      action: () => Linking.openURL('https://wa.me/905321234567'),
    },
    {
      icon: 'phone-outline',
      titleKey: 'support-phone',
      descKey: 'support-phone-desc',
      availableKey: 'support-phone-available',
      color: twColors.purple[500],
      action: () => Linking.openURL('tel:+903921234567'),
    },
    {
      icon: 'email-outline',
      titleKey: 'support-email',
      descKey: 'support-email-desc',
      availableKey: 'support-email-available',
      color: twColors.orange[500],
      action: () => Linking.openURL('mailto:destek@bangoo.com.tr'),
    },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('live-support')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="headset" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('support-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('support-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Quick Response */}
          <View className="bg-green-50 rounded-xl p-4 mb-6 flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center mr-3">
              <MaterialIcon name="clock-fast" size={22} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-green-800">
                {l10n.getString('support-response-title')}
              </Text>
              <Text className="text-green-700/70 text-sm">
                {l10n.getString('support-response-desc')}
              </Text>
            </View>
          </View>

          {/* Support Channels */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('support-channels-title')}
          </Text>
          <View className="gap-4 mb-8">
            {supportChannels.map((channel, index) => (
              <TouchableOpacity
                key={index}
                onPress={channel.action}
                className="bg-white rounded-xl p-4 border border-gray-100"
              >
                <View className="flex-row items-start">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: channel.color + '20' }}
                  >
                    <MaterialIcon name={channel.icon as any} size={26} color={channel.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-content text-lg mb-1">
                      {l10n.getString(channel.titleKey)}
                    </Text>
                    <Text className="text-content/60 text-sm mb-2">
                      {l10n.getString(channel.descKey)}
                    </Text>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      <Text className="text-green-600 text-xs font-medium">
                        {l10n.getString(channel.availableKey)}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcon name="chevron-right" size={20} color={colors.content} style={{ opacity: 0.5 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Working Hours */}
          <View className="bg-gray-50 rounded-xl p-5">
            <View className="flex-row items-center mb-3">
              <MaterialIcon name="clock-outline" size={24} color={colors.primary} />
              <Text className="text-lg font-bold text-content ml-2">
                {l10n.getString('support-hours-title')}
              </Text>
            </View>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-content/70">{l10n.getString('support-hours-weekdays')}</Text>
                <Text className="font-medium text-content">09:00 - 21:00</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-content/70">{l10n.getString('support-hours-weekend')}</Text>
                <Text className="font-medium text-content">10:00 - 18:00</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LiveSupport;
