import React from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';
import twColors from 'tailwindcss/colors';

const Security = () => {
  const { l10n } = useLocalization();
  const colors = useColors();

  const securityFeatures = [
    { icon: 'lock-outline', titleKey: 'security-ssl', descKey: 'security-ssl-desc', color: twColors.green[500] },
    { icon: 'credit-card-check-outline', titleKey: 'security-payment', descKey: 'security-payment-desc', color: twColors.blue[500] },
    { icon: 'shield-account-outline', titleKey: 'security-data', descKey: 'security-data-desc', color: twColors.purple[500] },
    { icon: 'two-factor-authentication', titleKey: 'security-2fa', descKey: 'security-2fa-desc', color: twColors.orange[500] },
  ];

  const certifications = [
    { name: 'PCI DSS', descKey: 'security-cert-pci' },
    { name: 'SSL/TLS', descKey: 'security-cert-ssl' },
    { name: 'KVKK', descKey: 'security-cert-kvkk' },
  ];

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={l10n.getString('security')} showBackButton />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-primary px-5 py-8">
          <View className="items-center mb-3">
            <MaterialIcon name="shield-check" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold text-center mb-2">
            {l10n.getString('security-hero-title')}
          </Text>
          <Text className="text-white/80 text-center">
            {l10n.getString('security-hero-subtitle')}
          </Text>
        </View>

        <View className="px-5 py-6">
          {/* Intro */}
          <View className="mb-8">
            <Text className="text-content/70 leading-6">
              {l10n.getString('security-intro')}
            </Text>
          </View>

          {/* Security Features */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('security-features-title')}
          </Text>
          <View className="gap-4 mb-8">
            {securityFeatures.map((feature, index) => (
              <View key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: feature.color + '20' }}
                  >
                    <MaterialIcon name={feature.icon as any} size={22} color={feature.color} />
                  </View>
                  <Text className="font-bold text-content flex-1">
                    {l10n.getString(feature.titleKey)}
                  </Text>
                </View>
                <Text className="text-content/60 text-sm leading-5">
                  {l10n.getString(feature.descKey)}
                </Text>
              </View>
            ))}
          </View>

          {/* Certifications */}
          <Text className="text-xl font-bold text-content mb-4">
            {l10n.getString('security-certs-title')}
          </Text>
          <View className="gap-3 mb-8">
            {certifications.map((cert, index) => (
              <View key={index} className="flex-row bg-green-50 rounded-xl p-4 items-center">
                <MaterialIcon name="certificate-outline" size={24} color={twColors.green[600]} />
                <View className="flex-1 ml-3">
                  <Text className="font-bold text-content">{cert.name}</Text>
                  <Text className="text-content/60 text-sm">
                    {l10n.getString(cert.descKey)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Tips */}
          <View className="bg-amber-50 rounded-xl p-5">
            <View className="flex-row items-center mb-3">
              <MaterialIcon name="lightbulb-outline" size={24} color={twColors.amber[600]} />
              <Text className="text-lg font-bold text-content ml-2">
                {l10n.getString('security-tips-title')}
              </Text>
            </View>
            <View className="gap-2">
              <Text className="text-content/70 text-sm">• {l10n.getString('security-tip-1')}</Text>
              <Text className="text-content/70 text-sm">• {l10n.getString('security-tip-2')}</Text>
              <Text className="text-content/70 text-sm">• {l10n.getString('security-tip-3')}</Text>
              <Text className="text-content/70 text-sm">• {l10n.getString('security-tip-4')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Security;
