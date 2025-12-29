import { Localization } from '@fluent/react';

export type NotificationType =
  | 'order_confirmed'
  | 'order_preparing'
  | 'order_shipped'
  | 'order_out_for_delivery'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_received'
  | 'refund_processed'
  | 'promo_code'
  | 'special_discount'
  | 'free_shipping'
  | 'price_drop'
  | 'back_in_stock';

interface NotificationData {
  orderId?: string;
  trackingNumber?: string;
  discount?: string;
  code?: string;
  amount?: string;
  productName?: string;
}

export const generateNotification = (
  type: NotificationType,
  l10n: Localization,
  data?: NotificationData
) => {
  switch (type) {
    case 'order_confirmed':
      return {
        title: l10n.getString('notif-order-confirmed'),
        message: l10n.getString('notif-order-confirmed-msg'),
        type: 'order' as const,
        metadata: { orderId: data?.orderId },
      };

    case 'order_preparing':
      return {
        title: l10n.getString('notif-order-preparing'),
        message: l10n.getString('notif-order-preparing-msg'),
        type: 'order' as const,
        metadata: { orderId: data?.orderId },
      };

    case 'order_shipped':
      return {
        title: l10n.getString('notif-order-shipped'),
        message: l10n.getString('notif-order-shipped-msg', {
          trackingNumber: data?.trackingNumber || '',
        }),
        type: 'shipping' as const,
        metadata: {
          orderId: data?.orderId,
          trackingNumber: data?.trackingNumber,
        },
      };

    case 'order_out_for_delivery':
      return {
        title: l10n.getString('notif-order-out-for-delivery'),
        message: l10n.getString('notif-order-out-for-delivery-msg'),
        type: 'shipping' as const,
        metadata: { orderId: data?.orderId },
      };

    case 'order_delivered':
      return {
        title: l10n.getString('notif-order-delivered'),
        message: l10n.getString('notif-order-delivered-msg'),
        type: 'order' as const,
        metadata: { orderId: data?.orderId },
      };

    case 'order_cancelled':
      return {
        title: l10n.getString('notif-order-cancelled'),
        message: l10n.getString('notif-order-cancelled-msg'),
        type: 'order' as const,
        metadata: { orderId: data?.orderId },
      };

    case 'payment_received':
      return {
        title: l10n.getString('notif-payment-received'),
        message: l10n.getString('notif-payment-received-msg'),
        type: 'order' as const,
        metadata: { orderId: data?.orderId },
      };

    case 'refund_processed':
      return {
        title: l10n.getString('notif-refund-processed'),
        message: l10n.getString('notif-refund-processed-msg', {
          amount: data?.amount || '',
        }),
        type: 'order' as const,
        metadata: { orderId: data?.orderId, amount: data?.amount },
      };

    case 'promo_code':
      return {
        title: l10n.getString('notif-promo-code'),
        message: l10n.getString('notif-promo-code-msg', {
          discount: data?.discount || '',
          code: data?.code || '',
        }),
        type: 'promo' as const,
        metadata: { promoCode: data?.code, discount: data?.discount },
      };

    case 'special_discount':
      return {
        title: l10n.getString('notif-special-discount'),
        message: l10n.getString('notif-special-discount-msg', {
          discount: data?.discount || '',
        }),
        type: 'campaign' as const,
        metadata: { discount: data?.discount },
      };

    case 'free_shipping':
      return {
        title: l10n.getString('notif-free-shipping'),
        message: l10n.getString('notif-free-shipping-msg', {
          amount: data?.amount || '',
        }),
        type: 'campaign' as const,
        metadata: { amount: data?.amount },
      };

    case 'price_drop':
      return {
        title: l10n.getString('notif-price-drop'),
        message: l10n.getString('notif-price-drop-msg', {
          productName: data?.productName || '',
          discount: data?.discount || '',
        }),
        type: 'price_drop' as const,
        metadata: { productName: data?.productName, discount: data?.discount },
      };

    case 'back_in_stock':
      return {
        title: l10n.getString('notif-back-in-stock'),
        message: l10n.getString('notif-back-in-stock-msg', {
          productName: data?.productName || '',
        }),
        type: 'stock' as const,
        metadata: { productName: data?.productName },
      };

    default:
      return {
        title: '',
        message: '',
        type: 'general' as const,
        metadata: {},
      };
  }
};
