import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalization } from '@fluent/react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Text from '@components/common/text';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import Navbar from '@components/common/navbar';
import { useColors } from '@styles/hooks';

type InfoCategory = 'corporate' | 'campaigns' | 'seller' | 'help';

type InfoPage = {
  titleKey: string;
  screenName: string;
  icon: 'information-outline' | 'briefcase-outline' | 'leaf' | 'email-outline' | 'shield-check-outline' | 'tag-outline' | 'crown-outline' | 'store-outline' | 'book-open-outline' | 'frequently-asked-questions' | 'headset' | 'package-variant-closed' | 'clipboard-list-outline';
};

type InfoPagesParams = {
  category: InfoCategory;
};

const categoryPages: Record<InfoCategory, InfoPage[]> = {
  corporate: [
    { titleKey: 'about-us', screenName: 'AboutUs', icon: 'information-outline' },
    { titleKey: 'career', screenName: 'Career', icon: 'briefcase-outline' },
    { titleKey: 'sustainability', screenName: 'Sustainability', icon: 'leaf' },
    { titleKey: 'contact-us', screenName: 'ContactUs', icon: 'email-outline' },
    { titleKey: 'security', screenName: 'Security', icon: 'shield-check-outline' },
  ],
  campaigns: [
    { titleKey: 'campaigns', screenName: 'Campaigns', icon: 'tag-outline' },
    { titleKey: 'elite-membership', screenName: 'EliteMembership', icon: 'crown-outline' },
  ],
  seller: [
    { titleKey: 'sell-on-bangoo', screenName: 'SellOnBangoo', icon: 'store-outline' },
    { titleKey: 'basic-concepts', screenName: 'BasicConcepts', icon: 'book-open-outline' },
  ],
  help: [
    { titleKey: 'faq', screenName: 'FAQ', icon: 'frequently-asked-questions' },
    { titleKey: 'live-support', screenName: 'LiveSupport', icon: 'headset' },
    { titleKey: 'how-to-return', screenName: 'HowToReturn', icon: 'package-variant-closed' },
    { titleKey: 'transaction-guide', screenName: 'TransactionGuide', icon: 'clipboard-list-outline' },
  ],
};

const categoryTitleKeys: Record<InfoCategory, string> = {
  corporate: 'corporate',
  campaigns: 'campaigns-menu',
  seller: 'seller',
  help: 'help',
};

const InfoPages = () => {
  const { l10n } = useLocalization();
  const navigation = useNavigation();
  const route = useRoute();
  const colors = useColors();
  const { category } = route.params as InfoPagesParams;

  const pages = categoryPages[category] || [];
  const categoryTitle = l10n.getString(categoryTitleKeys[category]);

  const handlePagePress = (page: InfoPage) => {
    (navigation as any).navigate(page.screenName);
  };

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={categoryTitle} showBackButton />
      <ScrollView className="flex-1 px-4 py-4">
        <View className="gap-3">
          {pages.map((page, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePagePress(page)}
              className="flex-row items-center p-4 bg-white rounded-xl border border-gray-100"
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
            >
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <MaterialIcon name={page.icon} size={22} color={colors.primary} />
              </View>
              <Text type="content" className="flex-1 text-content font-medium">
                {l10n.getString(page.titleKey)}
              </Text>
              <MaterialIcon name="chevron-right" size={20} color={colors.content} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default InfoPages;
