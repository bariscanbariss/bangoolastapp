import React from 'react';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThemeProvider from '@styles/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabBar from '@components/common/tab-bar';
import Splash from '@screens/splash';
import Home from '@screens/home';
import Favorites from '@screens/favorites';
import Notifications from '@screens/notifications';
import Categories from '@screens/category/categories';
import CategoryDetail from '@screens/category/category-detail';
import Collections from '@screens/collection/collections';
import CollectionDetail from '@screens/collection/collection-detail';
import ProductDetail from '@screens/product-detail';
import ProductReviews from '@screens/product-reviews';
import ProductList from '@screens/product-list';
import ProductGrid from '@screens/product-grid';
import Search from '@screens/search';
import Cart from '@screens/cart';
import Checkout from '@screens/checkout';
import Profile from '@screens/profile/profile';
import SignIn from '@screens/auth/login';
import Register from '@screens/auth/register';
import ForgotPassword from '@screens/auth/forgot-password';
import EnterOTP from '@screens/auth/enter-otp';
import ChangePassword from '@screens/auth/change-password';
import Orders from '@screens/order/orders';
import OrderDetail from '@screens/order/order-detail';
import ProfileDetail from '@screens/profile/profile-detail';
import { CartProvider } from '@data/cart-context';
import { RegionProvider } from '@data/region-context';
import { CustomerProvider } from '@data/customer-context';
import { LocaleProvider } from '@data/locale-context';
import { FavoritesProvider } from '@data/favorites-context';
import AddressForm from '@screens/address/address-form';
import AddressList from '@screens/address/address-list';
import RegionSelect from '@screens/region-select';
import Settings from '@screens/settings';
import InfoPages from '@screens/info/info-pages';
import AboutUs from '@screens/info/about-us';
import Career from '@screens/info/career';
import Sustainability from '@screens/info/sustainability';
import ContactUs from '@screens/info/contact-us';
import Security from '@screens/info/security';
import Campaigns from '@screens/info/campaigns';
import EliteMembership from '@screens/info/elite-membership';
import SellOnBangoo from '@screens/info/sell-on-bangoo';
import BasicConcepts from '@screens/info/basic-concepts';
import FAQ from '@screens/info/faq';
import LiveSupport from '@screens/info/live-support';
import HowToReturn from '@screens/info/how-to-return';
import TransactionGuide from '@screens/info/transaction-guide';

import '@styles/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = StaticParamList<typeof RootStack>;

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider name="default">
      <LocaleProvider>
        <RegionProvider>
          <FavoritesProvider>
            <CartProvider>
              <CustomerProvider>
                <QueryClientProvider client={queryClient}>
                  <GestureHandlerRootView>
                    <SafeAreaProvider>
                      <Navigation />
                    </SafeAreaProvider>
                  </GestureHandlerRootView>
                </QueryClientProvider>
              </CustomerProvider>
            </CartProvider>
          </FavoritesProvider>
        </RegionProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

const HomeTabs = createBottomTabNavigator({
  tabBar: props => <TabBar {...props} />,
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'home',
      },
    },
    Favorites: {
      screen: Favorites,
      options: {
        title: 'favorites',
      },
    },
    Cart: {
      screen: Cart,
      options: {
        title: 'cart',
      },
    },
    Profile: {
      screen: Profile,
      options: {
        title: 'profile',
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Splash',
  groups: {
    App: {
      screenOptions: {
        headerShown: false,
      },
      screens: {
        Main: HomeTabs,
        Splash,
        Notifications,
        ProductDetail,
        ProductReviews,
        ProductList,
        ProductGrid,
        Search,
        CategoryDetail,
        CollectionDetail,
        Categories,
        Checkout,
        SignIn,
        Register,
        ForgotPassword,
        EnterOTP,
        ChangePassword,
        Orders,
        OrderDetail,
        ProfileDetail,
        AddressList,
        AddressForm,
        Settings,
        InfoPages,
        AboutUs,
        Career,
        Sustainability,
        ContactUs,
        Security,
        Campaigns,
        EliteMembership,
        SellOnBangoo,
        BasicConcepts,
        FAQ,
        LiveSupport,
        HowToReturn,
        TransactionGuide,
      },
    },
    Modal: {
      screenOptions: {
        presentation: 'modal',
        headerShown: false,
      },
      screens: {
        RegionSelect: RegionSelect,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);
