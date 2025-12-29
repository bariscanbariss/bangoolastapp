import React, { useState } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import Text from '@components/common/text';
import Input from '@components/common/input';
import Button from '@components/common/button';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Icon from '@react-native-vector-icons/ant-design';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      // TODO: Implement forgot password API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Navigate to OTP screen
      navigation.navigate('EnterOTP', { email: data.email });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-safe">
      {/* Back Button */}
      <View className="px-6 pt-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <Icon name="left" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-content-bold text-gray-900 mb-3">
            Confirm your email
          </Text>
          <Text className="text-base text-gray-500 leading-6">
            Enter the email associated with your account and we'll send an
            email with code to reset your password.
          </Text>
        </View>

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Enter your email"
              placeholder="Email address"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email?.message}
              containerClassName="mb-6"
            />
          )}
        />

        {/* Send Code Button */}
        <Button
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          title={loading ? 'Sending...' : 'Send Code'}
        />
      </View>
    </View>
  );
};

export default ForgotPassword;
