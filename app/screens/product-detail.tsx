import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { useNavigation, type StaticScreenProps } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@react-native-vector-icons/ant-design';
import Text from '@components/common/text';
import apiClient from '@api/client';
import { useQuery } from '@tanstack/react-query';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import { useRegion } from '@data/region-context';
import { useCart } from '@data/cart-context';
import WishlistButton from '@components/product/wishlist-button';
import { useLocalization } from '@fluent/react';
import Toast from '@components/common/toast';

const RECENT_PRODUCTS_KEY = '@recent_products';
const MAX_RECENT_PRODUCTS = 10;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = StaticScreenProps<{
  id?: string;
  productId?: string;
}>;

// Mock review data structure - will be replaced with backend API
interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function ProductScreen({ route }: Props) {
  // Support both 'id' and 'productId' parameter names for compatibility
  const productId = route.params?.id || route.params?.productId;

  console.log('ProductScreen params:', route.params);
  console.log('ProductId:', productId);

  // Call all hooks unconditionally first
  const { region } = useRegion();
  const navigation = useNavigation();
  const { l10n } = useLocalization();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();
  const scrollViewRef = useRef<ScrollView>(null);
  const modalFlatListRef = useRef<FlatList>(null);

  // Fetch product data (conditionally enabled)
  const { data, error, isPending } = useQuery({
    queryKey: ['product', productId],
    queryFn: () =>
      apiClient.store.product.retrieve(productId!, {
        region_id: region?.id,
        fields: '*variants.calculated_price,*variants.inventory_quantity',
      }),
    enabled: !!productId,
  });

  // Fetch reviews (mock for now - will be replaced with backend API)
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      // TODO: Replace with actual backend API call
      // const response = await apiClient.store.product.reviews.list(productId);
      // return response;

      // Mock data for now
      return {
        reviews: [
          {
            id: '1',
            user_name: 'Ahmet Y.',
            rating: 5,
            comment: 'Harika bir ürün, çok memnun kaldım!',
            created_at: '2024-01-15',
          },
          {
            id: '2',
            user_name: 'Ayşe K.',
            rating: 4,
            comment: 'Kaliteli ama biraz pahalı.',
            created_at: '2024-01-10',
          },
        ] as Review[],
        average_rating: 4.8,
        total_reviews: 150,
      };
    },
    enabled: !!productId,
  });

  // Save product to recent searches when viewed
  useEffect(() => {
    const saveRecentProduct = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_PRODUCTS_KEY);
        const recentProducts = stored ? JSON.parse(stored) : [];

        const updated = [
          productId,
          ...recentProducts.filter((id: string) => id !== productId),
        ].slice(0, MAX_RECENT_PRODUCTS);

        await AsyncStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent product:', error);
      }
    };

    if (productId) {
      saveRecentProduct();
    }
  }, [productId]);

  // Now handle early returns AFTER all hooks
  if (!productId) {
    console.error('No productId provided in route params');
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Icon name="frowno" size={64} color="#ef4444" />
        <Text className="text-lg text-gray-900 mt-4">Ürün bulunamadı</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 px-6 py-3 bg-purple-600 rounded-full"
        >
          <Text className="text-white font-content-bold">Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    console.error('Product fetch error:', error);
    return <ErrorUI />;
  }

  if (!data?.product) {
    console.error('No product data found');
    return <ErrorUI />;
  }

  const product = data.product;
  const images = product.images || [];
  const mainImage = images[selectedImageIndex]?.url || product.thumbnail;
  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.average_rating || 0;
  const totalReviews = reviewsData?.total_reviews || 0;

  // Get product options (size, color, etc.)
  const productOptions = product.options || [];

  // Sort size values in the correct order
  const sortSizeValues = (values: any[]) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    return [...values].sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a.value.toUpperCase());
      const bIndex = sizeOrder.indexOf(b.value.toUpperCase());
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  // Find selected variant based on selected options
  const selectedVariant = product.variants?.find((variant) => {
    if (!variant.options) return false;
    return variant.options.every((option: any) => {
      return selectedOptions[option.option_id] === option.value;
    });
  });

  // Use selected variant price or cheapest variant price
  const rawPrice = selectedVariant?.calculated_price?.calculated_amount ||
                   product.variants?.[0]?.calculated_price?.calculated_amount || 0;

  // Price is already in the correct format from Medusa v2 backend (decimal values)
  const price = rawPrice;
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: selectedVariant?.calculated_price?.currency_code ||
              product.variants?.[0]?.calculated_price?.currency_code || 'TRY',
  }).format(price);

  // Check if all options are selected
  const allOptionsSelected = productOptions.every(
    (option) => selectedOptions[option.id]
  );

  // Check stock availability
  const inStock = selectedVariant
    ? !selectedVariant.manage_inventory ||
      selectedVariant.allow_backorder ||
      (selectedVariant.inventory_quantity || 0) > 0
    : true;

  console.log('Product loaded:', {
    id: product.id,
    title: product.title,
    imagesCount: images.length,
    price,
    options: productOptions.length,
    selectedVariant: selectedVariant?.id,
    allOptionsSelected,
    inStock,
  });

  const handleAddToCart = async () => {
    try {
      const variantId = selectedVariant?.id || product.variants?.[0]?.id;
      if (variantId) {
        await addToCart(variantId, quantity);
        setShowToast(true);
        console.log('Item added to cart successfully');
      } else {
        console.error('No variant ID found');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleOptionSelect = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-4 pt-12 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-12 h-12 bg-white rounded-full items-center justify-center"
          style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 }}
        >
          <Icon name="left" size={20} color="#000" />
        </TouchableOpacity>
        <View className="w-12 h-12 bg-white rounded-full items-center justify-center"
          style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 }}>
          <WishlistButton product={product} />
        </View>
      </View>

      <ScrollView ref={scrollViewRef} className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Swipeable Product Images */}
        <View style={{ width: '100%', height: 400 }}>
          {images.length > 0 ? (
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setSelectedImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setImageModalVisible(true)}
                  style={{ width: SCREEN_WIDTH }}
                >
                  <View style={{ width: SCREEN_WIDTH, height: 400 }} className="bg-gray-100">
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: SCREEN_WIDTH, height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View className="w-full h-full bg-gray-100 items-center justify-center">
              <Icon name="picture" size={64} color="#d1d5db" />
            </View>
          )}
          {/* Image indicator */}
          {images.length > 1 && (
            <View className="absolute bottom-4 left-0 right-0 items-center">
              <View className="bg-black/50 px-3 py-1 rounded-full">
                <Text className="text-white text-sm">
                  {selectedImageIndex + 1}/{images.length}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="px-4 py-4">
          {/* Title and Rating */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
              <Text className="text-2xl font-content-bold text-gray-900">
                {product.title}
              </Text>
            </View>
          </View>

          {/* Rating */}
          <TouchableOpacity className="flex-row items-center mb-3">
            <Icon name="star" size={20} color="#FFD700" />
            <Text className="text-lg font-content-bold text-gray-900 ml-1">
              {averageRating.toFixed(1)}
            </Text>
            <Text className="text-sm text-gray-500 ml-1">
              ({l10n.getString('review-count', { count: totalReviews })})
            </Text>
          </TouchableOpacity>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-base text-gray-600 leading-6">
              {isDescriptionExpanded
                ? product.description
                : product.description && product.description.length > 150
                ? `${product.description.substring(0, 150)}...`
                : product.description}
            </Text>
            {product.description && product.description.length > 150 && (
              <TouchableOpacity
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2"
              >
                <Text className="font-content-bold text-purple-600">
                  {isDescriptionExpanded ? 'Daha az göster' : 'Devamını oku'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Product Options (Size, Color, etc.) */}
          {productOptions.length > 0 && (
            <View className="mb-4">
              {productOptions.map((option) => (
                <View key={option.id} className="mb-4">
                  <Text className="text-base font-content-bold text-gray-900 mb-3">
                    {option.title === 'Size' ? l10n.getString('select-size') :
                     option.title === 'Color' ? l10n.getString('select-color') :
                     option.title} :
                  </Text>

                  {option.title === 'Color' || option.title === 'Renk' ? (
                    // Color selector with color circles
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 16 }}
                    >
                      {option.values?.map((value) => {
                        const isSelected = selectedOptions[option.id] === value.value;
                        const colorMap: Record<string, string> = {
                          'Black': '#000000',
                          'White': '#FFFFFF',
                          'Red': '#EF4444',
                          'Blue': '#3B82F6',
                          'Green': '#10B981',
                          'Yellow': '#F59E0B',
                          'Pink': '#EC4899',
                          'Purple': '#8B5CF6',
                          'Gray': '#6B7280',
                          'Brown': '#92400E',
                          'Siyah': '#000000',
                          'Beyaz': '#FFFFFF',
                          'Kırmızı': '#EF4444',
                          'Mavi': '#3B82F6',
                          'Yeşil': '#10B981',
                          'Sarı': '#F59E0B',
                          'Pembe': '#EC4899',
                          'Mor': '#8B5CF6',
                          'Gri': '#6B7280',
                          'Kahverengi': '#92400E',
                        };
                        const colorCode = colorMap[value.value] || '#8e6cef';

                        return (
                          <TouchableOpacity
                            key={value.id}
                            onPress={() => handleOptionSelect(option.id, value.value)}
                            className="mr-3 items-center"
                          >
                            <View
                              className="w-12 h-12 rounded-full items-center justify-center"
                              style={{
                                backgroundColor: colorCode,
                                borderWidth: isSelected ? 3 : 2,
                                borderColor: isSelected ? '#8e6cef' : '#e5e7eb',
                              }}
                            >
                              {isSelected && (
                                <Icon name="check" size={20} color={colorCode === '#FFFFFF' ? '#000' : '#fff'} />
                              )}
                            </View>
                            <Text className="text-xs text-gray-600 mt-1">
                              {value.value}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    // Size or other options selector with boxes
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 16 }}
                    >
                      {(option.title === 'Size' || option.title === 'Beden'
                        ? sortSizeValues(option.values || [])
                        : option.values || []
                      ).map((value) => {
                        const isSelected = selectedOptions[option.id] === value.value;
                        return (
                          <TouchableOpacity
                            key={value.id}
                            onPress={() => handleOptionSelect(option.id, value.value)}
                            className="mr-3 px-6 py-3 rounded-lg"
                            style={{
                              backgroundColor: isSelected ? '#8e6cef' : '#f3f4f6',
                              borderWidth: 1,
                              borderColor: isSelected ? '#8e6cef' : '#e5e7eb',
                            }}
                          >
                            <Text
                              className="text-base font-content-bold"
                              style={{ color: isSelected ? '#fff' : '#374151' }}
                            >
                              {value.value}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Quantity Selector */}
          <View className="mb-4">
            <Text className="text-base font-content-bold text-gray-900 mb-2">
              {l10n.getString('select-quantity')} :
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={decrementQuantity}
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              >
                <Icon name="minus" size={16} color="#000" />
              </TouchableOpacity>
              <Text className="text-lg font-content-bold mx-6">{quantity}</Text>
              <TouchableOpacity
                onPress={incrementQuantity}
                className="w-10 h-10 bg-black rounded-full items-center justify-center"
              >
                <Icon name="plus" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reviews Section */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xl font-content-bold text-gray-900">
                {l10n.getString('reviews')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  try {
                    navigation.navigate('ProductReviews' as never, {
                      productId: product.id,
                      productTitle: product.title,
                    } as never);
                  } catch (error) {
                    console.log('Navigation error:', error);
                  }
                }}
              >
                <Text className="text-sm text-purple-600">{l10n.getString('view-all-reviews')}</Text>
              </TouchableOpacity>
            </View>

            {reviews.length > 0 ? (
              <View>
                {reviews.slice(0, 3).map((review) => (
                  <View
                    key={review.id}
                    className="bg-gray-50 rounded-lg p-4 mb-3"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-content-bold text-gray-900">
                        {review.user_name}
                      </Text>
                      <View className="flex-row items-center">
                        <Icon name="star" size={14} color="#FFD700" />
                        <Text className="text-sm text-gray-600 ml-1">
                          {review.rating.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-600 mb-1">
                      {review.comment}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-gray-50 rounded-lg p-4 items-center">
                <Text className="text-gray-500">Henüz değerlendirme yok</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar - Price and Add to Cart */}
      <View
        className="px-4 py-4 bg-white border-t border-gray-200"
        style={{ elevation: 8, shadowColor: '#000', shadowOpacity: 0.1 }}
      >
        {/* Warning if options not selected */}
        {productOptions.length > 0 && !allOptionsSelected && (
          <View className="mb-3 bg-yellow-50 px-3 py-2 rounded-lg flex-row items-center">
            <Icon name="warning" size={16} color="#F59E0B" />
            <Text className="text-sm text-yellow-800 ml-2 flex-1">
              {l10n.getString('please-select-all-options')}
            </Text>
          </View>
        )}

        {/* Stock warning */}
        {!inStock && allOptionsSelected && (
          <View className="mb-3 bg-red-50 px-3 py-2 rounded-lg flex-row items-center">
            <Icon name="warning" size={16} color="#EF4444" />
            <Text className="text-sm text-red-800 ml-2 flex-1">
              {l10n.getString('out-of-stock-message')}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-gray-500">Toplam Fiyat</Text>
            <Text className="text-2xl font-content-bold text-gray-900">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: selectedVariant?.calculated_price?.currency_code ||
                          product.variants?.[0]?.calculated_price?.currency_code || 'TRY',
              }).format(price * quantity)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={!allOptionsSelected || !inStock}
            className="flex-row items-center justify-center px-8 py-4 rounded-full"
            style={{
              backgroundColor: !allOptionsSelected || !inStock ? '#d1d5db' : '#8e6cef',
            }}
          >
            <Icon name="shopping" size={20} color="white" />
            <Text className="text-white font-content-bold text-base ml-2">
              {l10n.getString('add-to-cart')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Notification */}
      <Toast
        message={l10n.getString('added-to-cart')}
        visible={showToast}
        onHide={() => setShowToast(false)}
        duration={2000}
      />

      {/* Full Screen Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 bg-white">
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setImageModalVisible(false)}
            className="absolute top-12 left-4 z-20 w-10 h-10 bg-black/20 rounded-full items-center justify-center"
          >
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>

          {/* Image Counter */}
          <View className="absolute top-12 right-4 z-20 bg-black/50 px-3 py-2 rounded-full">
            <Text className="text-white text-sm font-content-bold">
              {selectedImageIndex + 1}/{images.length}
            </Text>
          </View>

          {/* Main Image Gallery */}
          <FlatList
            ref={modalFlatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setSelectedImageIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={{ width: SCREEN_WIDTH, height: '100%' }} className="bg-white items-center justify-center">
                <Image
                  source={{ uri: item.url }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Thumbnail Gallery at Bottom */}
          {images.length > 1 && (
            <View className="absolute bottom-0 left-0 right-0 bg-white/95 py-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {images.map((image, index) => (
                  <TouchableOpacity
                    key={image.id}
                    onPress={() => {
                      setSelectedImageIndex(index);
                      modalFlatListRef.current?.scrollToIndex({
                        index,
                        animated: true,
                      });
                    }}
                    className="mr-3"
                    style={{
                      borderWidth: selectedImageIndex === index ? 3 : 2,
                      borderColor: selectedImageIndex === index ? '#8e6cef' : '#e5e7eb',
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      source={{ uri: image.url }}
                      style={{ width: 120, height: 120 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

export default ProductScreen;
