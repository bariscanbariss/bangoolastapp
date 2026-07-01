import React, { useEffect, useState } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from '@react-native-vector-icons/ant-design';
import { useColors, useTheme } from '@styles/hooks';
import { useNavigation } from '@react-navigation/native';
import Text from '@components/common/text';
import apiClient from '@api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from '@fluent/react';

const NOTIFICATIONS_CACHE_KEY = '@notifications_cache';

interface Notification {
  id: string;
  type: 'campaign' | 'shipping' | 'order' | 'general' | 'promo' | 'price_drop' | 'stock';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    orderId?: string;
    trackingNumber?: string;
    campaignId?: string;
    promoCode?: string;
    discount?: string;
    amount?: string;
    productName?: string;
  };
}

const Notifications = () => {
  const colors = useColors();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { l10n } = useLocalization();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotificationsFromCache();
  }, []);

  const loadNotificationsFromCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(NOTIFICATIONS_CACHE_KEY);
      if (cached) {
        setNotifications(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading notifications from cache:', error);
    }
  };

  const { data: notificationsData, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiClient.store.notification.list();
      const backendNotifications = response.notifications || [];

      await AsyncStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(backendNotifications));
      setNotifications(backendNotifications);

      return { notifications: backendNotifications };
    },
    staleTime: 1000 * 60 * 2,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        // Try backend API
        await apiClient.store.notification.markAsRead(notificationId);
      } catch (error) {
        console.log('Backend mark as read not available');
      }

      const updatedNotifications = notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );

      await AsyncStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);

      return updatedNotifications;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiClient.store.notification.markAllAsRead();
      } catch (error) {
        console.log('Backend mark all as read not available');
      }

      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      await AsyncStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);

      return updatedNotifications;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'campaign':
      case 'promo':
        return { name: 'tago' as const, color: '#8e6cef' };
      case 'shipping':
        return { name: 'car' as const, color: '#3b82f6' };
      case 'order':
        return { name: 'shoppingcart' as const, color: '#10b981' };
      case 'price_drop':
        return { name: 'arrowdown' as const, color: '#ef4444' };
      case 'stock':
        return { name: 'check' as const, color: '#10b981' };
      default:
        return { name: 'bell' as const, color: '#6b7280' };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return l10n.getString('minutes-ago', { count: diffMins });
    if (diffHours < 24) return l10n.getString('hours-ago', { count: diffHours });
    return l10n.getString('days-ago', { count: diffDays });
  };

  const getTranslatedNotification = (item: Notification) => {
    const typeMap: Record<string, string> = {
      'Order Confirmed': 'notif-order-confirmed',
      'Order Being Prepared': 'notif-order-preparing',
      'Order Shipped': 'notif-order-shipped',
      'Out for Delivery': 'notif-order-out-for-delivery',
      'Order Delivered': 'notif-order-delivered',
      'Order Cancelled': 'notif-order-cancelled',
      'Payment Received': 'notif-payment-received',
      'Refund Processed': 'notif-refund-processed',
      'Promo Code Earned': 'notif-promo-code',
      'Special Discount!': 'notif-special-discount',
      'Free Shipping': 'notif-free-shipping',
      'Price Drop Alert': 'notif-price-drop',
      'Back in Stock': 'notif-back-in-stock',
    };

    const titleKey = typeMap[item.title];
    const messageKey = titleKey ? `${titleKey}-msg` : null;

    const title = titleKey ? l10n.getString(titleKey) : item.title;
    const message = messageKey
      ? l10n.getString(messageKey, item.metadata || {})
      : item.message;

    return { title, message };
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const iconConfig = getNotificationIcon(item.type);
    const { title, message } = getTranslatedNotification(item);

    return (
      <TouchableOpacity
        onPress={() => {
          if (!item.read) {
            markAsReadMutation.mutate(item.id);
          }
          if (item.metadata?.orderId) {
            navigation.navigate('OrderDetail', { id: item.metadata.orderId });
          }
        }}
        className={`mx-4 mb-3 rounded-2xl p-4 flex-row ${
          item.read ? 'bg-gray-50' : 'bg-white'
        }`}
        style={{ elevation: item.read ? 1 : 3, shadowColor: '#000', shadowOpacity: 0.1 }}
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${iconConfig.color}20` }}
        >
          <Icon name={iconConfig.name} size={24} color={iconConfig.color} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className={`text-base font-content-bold ${item.read ? 'text-gray-600' : 'text-gray-900'}`}>
              {title}
            </Text>
            {!item.read && (
              <View className="w-2 h-2 bg-red-500 rounded-full ml-2" />
            )}
          </View>
          <Text className={`text-sm mb-2 ${item.read ? 'text-gray-500' : 'text-gray-700'}`}>
            {message}
          </Text>
          <Text className="text-xs text-gray-400">
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View className="flex-1 bg-gray-50 p-safe">
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View className="px-4 pt-6 pb-4 bg-white flex-row items-center justify-between" style={{ elevation: 2 }}>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 w-10 h-10 items-center justify-center"
          >
            <Icon name="left" size={24} color="#000" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-content-bold text-gray-900">
              {l10n.getString('notifications')}
            </Text>
            {unreadCount > 0 && (
              <Text className="text-sm text-gray-500 mt-1">
                {l10n.getString('unread-notifications', { count: unreadCount })}
              </Text>
            )}
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <Text className="text-sm font-content-bold" style={{ color: '#8e6cef' }}>
              {l10n.getString('mark-all-as-read')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8e6cef" />
        </View>
      )}

      {!isLoading && notifications.length === 0 && (
        <View className="flex-1 items-center justify-center px-8">
          <Icon name="bell" size={64} color="#d1d5db" />
          <Text className="text-lg text-gray-500 mt-4 font-content text-center">
            {l10n.getString('no-notifications-yet')}
          </Text>
          <Text className="text-sm text-gray-400 mt-2 text-center">
            {l10n.getString('new-campaigns-and-order-updates')}
          </Text>
        </View>
      )}

      {!isLoading && notifications.length > 0 && (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        >
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default Notifications;
