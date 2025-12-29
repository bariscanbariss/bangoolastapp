import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const Campaigns = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const activeCampaigns = [
    {
      titleKey: 'campaign-welcome',
      descKey: 'campaign-welcome-desc',
      discount: '15%',
      icon: 'gift-outline',
      color: twColors.purple[500],
      bgColor: 'bg-purple-50',
    },
    {
      titleKey: 'campaign-freeship',
      descKey: 'campaign-freeship-desc',
      discount: l10n.getString('campaign-free'),
      icon: 'truck-fast-outline',
      color: twColors.blue[500],
      bgColor: 'bg-blue-50',
    },
    {
      titleKey: 'campaign-weekend',
      descKey: 'campaign-weekend-desc',
      discount: '20%',
      icon: 'calendar-weekend',
      color: twColors.orange[500],
      bgColor: 'bg-orange-50',
    },
  ];

  const upcomingCampaigns = [
    { titleKey: 'campaign-summer', dateKey: 'campaign-summer-date', icon: 'white-balance-sunny' },
    { titleKey: 'campaign-backtoschool', dateKey: 'campaign-backtoschool-date', icon: 'school-outline' },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('campaigns')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-gradient-to-r from-purple-600 to-pink-500 bg-primary px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="sale" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('campaigns-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('campaigns-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Active Campaigns */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('campaigns-active-title')}
          </Text>
          <View className="gap-4 mb-8">
            {activeCampaigns.map((campaign, index) => (
              <TouchableOpacity
                key={index}
                className={`${campaign.bgColor} rounded-xl p-5 border border-gray-100`}
              >
                <View className="flex-row items-start">
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: campaign.color + '20' }}
                  >
                    <MaterialIcon name={campaign.icon as any} size={28} color={campaign.color} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-bold text-content text-lg">
                        {l10n.getString(campaign.titleKey)}
                      </Text>
                      <View className="bg-red-500 px-3 py-1 rounded-full">
                        <Text className="text-white font-bold text-sm">{campaign.discount}</Text>
                      </View>
                    </View>
                    <Text className="text-content/60 text-sm leading-5">
                      {l10n.getString(campaign.descKey)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upcoming Campaigns */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('campaigns-upcoming-title')}
          </Text>
          <View className="gap-3 mb-8">
            {upcomingCampaigns.map((campaign, index) => (
              <View
                key={index}
                className="flex-row bg-gray-50 rounded-xl p-4 items-center"
              >
                <MaterialIcon name={campaign.icon as any} size={24} color={colors.content} style={{ opacity: 0.5 }} />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-content">
                    {l10n.getString(campaign.titleKey)}
                  </Text>
                  <Text className="text-content/50 text-sm">
                    {l10n.getString(campaign.dateKey)}
                  </Text>
                </View>
                <MaterialIcon name="bell-outline" size={20} color={colors.primary} />
              </View>
            ))}
          </View>

          {/* Newsletter */}
          <View className="bg-primary/10 rounded-xl p-5 items-center">
            <MaterialIcon name="email-newsletter" size={40} color={colors.primary} />
            <Text className="text-lg font-bold text-content mt-3 mb-1">
              {l10n.getString('campaigns-newsletter-title')}
            </Text>
            <Text className="text-content/60 text-center text-sm">
              {l10n.getString('campaigns-newsletter-desc')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Campaigns;
