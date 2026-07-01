import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, type StaticScreenProps } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';
import Text from '@components/common/text';
import apiClient from '@api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import { useLocalization } from '@fluent/react';

type Props = StaticScreenProps<{
  productId: string;
  productTitle: string;
}>;

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function ProductReviewsScreen({ route }: Props) {
  const { productId, productTitle } = route.params;
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { l10n } = useLocalization();
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch reviews (mock for now - will be replaced with backend API)
  const { data: reviewsData, isLoading } = useQuery({
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
            comment: 'Harika bir ürün, çok memnun kaldım! Kalitesi çok iyi ve hızlı kargo.',
            created_at: '2024-01-15',
          },
          {
            id: '2',
            user_name: 'Ayşe K.',
            rating: 4,
            comment: 'Kaliteli ama biraz pahalı. Yine de tavsiye ederim.',
            created_at: '2024-01-10',
          },
          {
            id: '3',
            user_name: 'Mehmet D.',
            rating: 5,
            comment: 'Mükemmel! Tam beklediğim gibi.',
            created_at: '2024-01-08',
          },
          {
            id: '4',
            user_name: 'Zeynep A.',
            rating: 3,
            comment: 'İdare eder, fiyatına göre iyi.',
            created_at: '2024-01-05',
          },
        ] as Review[],
        average_rating: 4.8,
        total_reviews: 150,
      };
    },
  });

  // Add review mutation (mock for now - will be replaced with backend API)
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      // TODO: Replace with actual backend API call
      // const response = await apiClient.store.product.reviews.create(productId, reviewData);
      // return response;

      // Mock implementation
      return {
        id: Date.now().toString(),
        user_name: 'Siz',
        rating: reviewData.rating,
        comment: reviewData.comment,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setShowAddReview(false);
      setNewRating(0);
      setNewComment('');
    },
  });

  const handleSubmitReview = () => {
    if (newRating > 0 && newComment.trim()) {
      addReviewMutation.mutate({
        rating: newRating,
        comment: newComment.trim(),
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.average_rating || 0;
  const totalReviews = reviewsData?.total_reviews || 0;

  const renderStars = (rating: number, size: number = 20, onPress?: (rating: number) => void) => {
    const displayRating = onPress ? (hoverRating || rating) : rating;

    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= displayRating;
          const isHalf = star - 0.5 <= displayRating && star > displayRating;

          return (
            <View key={star} style={{ position: 'relative', marginRight: 4 }}>
              {/* Half star button (left side) */}
              {onPress && (
                <TouchableOpacity
                  onPress={() => onPress(star - 0.5)}
                  onPressIn={() => setHoverRating(star - 0.5)}
                  onPressOut={() => setHoverRating(0)}
                  style={{ position: 'absolute', left: 0, width: size / 2, height: size, zIndex: 2 }}
                />
              )}

              {/* Full star button (right side) */}
              {onPress && (
                <TouchableOpacity
                  onPress={() => onPress(star)}
                  onPressIn={() => setHoverRating(star)}
                  onPressOut={() => setHoverRating(0)}
                  style={{ position: 'absolute', right: 0, width: size / 2, height: size, zIndex: 2 }}
                />
              )}

              {/* Background star (empty) */}
              <Icon name="star" size={size} color="#E5E7EB" />

              {/* Foreground star (filled) */}
              {(isFull || isHalf) && (
                <View style={{ position: 'absolute', overflow: 'hidden', width: isHalf ? size / 2 : size }}>
                  <Icon name="star" size={size} color="#FFD700" />
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-content-bold text-gray-900 text-base">
          {item.user_name}
        </Text>
        {renderStars(item.rating, 16)}
      </View>
      <Text className="text-sm text-gray-600 mb-2 leading-5">
        {item.comment}
      </Text>
      <Text className="text-xs text-gray-400">
        {new Date(item.created_at).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center mr-3"
          >
            <Icon name="left" size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-content-bold text-gray-900">
              {l10n.getString('reviews')}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {productTitle}
            </Text>
          </View>
        </View>

        {/* Rating Summary */}
        <View className="flex-row items-center justify-between bg-gray-50 rounded-lg p-4">
          <View className="items-center">
            <Text className="text-4xl font-content-bold text-gray-900">
              {averageRating.toFixed(1)}
            </Text>
            {renderStars(Math.round(averageRating), 18)}
            <Text className="text-sm text-gray-500 mt-1">
              {l10n.getString('review-count', { count: totalReviews })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddReview(!showAddReview)}
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: '#8e6cef' }}
          >
            <Text className="text-white font-content-bold">
              {showAddReview ? l10n.getString('cancel') : l10n.getString('add-review')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Review Form */}
      {showAddReview && (
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-lg font-content-bold text-gray-900 mb-3">
            {l10n.getString('share-your-review')}
          </Text>

          {/* Star Rating */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">{l10n.getString('your-rating')}:</Text>
            {renderStars(newRating, 32, setNewRating)}
          </View>

          {/* Comment Input */}
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">{l10n.getString('your-comment')}:</Text>
            <TextInput
              className="bg-gray-50 rounded-lg p-3 text-base text-gray-900 min-h-24"
              placeholder={l10n.getString('your-comment')}
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={newComment}
              onChangeText={setNewComment}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmitReview}
            disabled={newRating === 0 || !newComment.trim() || addReviewMutation.isPending}
            className="py-3 rounded-full items-center"
            style={{
              backgroundColor:
                newRating === 0 || !newComment.trim() ? '#d1d5db' : '#8e6cef',
            }}
          >
            <Text className="text-white font-content-bold text-base">
              {addReviewMutation.isPending ? l10n.getString('submitting') : l10n.getString('submit-review')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reviews List */}
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="bg-white rounded-lg p-8 items-center">
            <Icon name="staro" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">
              Henüz değerlendirme yok
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              İlk değerlendirmeyi siz yapın!
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

export default ProductReviewsScreen;
