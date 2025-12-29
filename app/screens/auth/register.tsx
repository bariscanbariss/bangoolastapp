import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useLocalization } from '@fluent/react';
import Text from '@components/common/text';
import Input from '@components/common/input';
import Button from '@components/common/button';
import { useCustomer } from '@data/customer-context';
import { useFavorites } from '@data/favorites-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Icon from '@react-native-vector-icons/ant-design';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import { useColors } from '@styles/hooks';

const registerSchema = z
  .object({
    email: z.string().email('invalid-email-address'),
    password: z.string().min(6, 'password-must-be-at-least-n-characters'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'must-agree-to-terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwords-must-match',
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

const Register = () => {
  const { l10n } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const { register: registerCustomer } = useCustomer();
  const { syncFavoritesWithBackend } = useFavorites();
  const navigation = useNavigation();
  const colors = useColors();

  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: true,
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      await registerCustomer(
        data.email,
        data.password,
        'User', // Default first name
        'Name', // Default last name
      );

      // Sync favorites with backend after successful registration
      await syncFavoritesWithBackend();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                routes: [{ name: 'Home' }],
              },
            },
          ],
        }),
      );
    } catch (err) {
      setFormError('root', {
        type: 'manual',
        message:
          err instanceof Error
            ? err.message
            : 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login');
  };

  return (
    <View className="flex-1 bg-white p-safe">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-12 pb-6">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <MaterialIcon name="arrow-left" size={24} color={colors.content} />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-content-bold text-gray-900 mb-2">
              {l10n.getString('register-to-join-us')}
            </Text>
            <Text className="text-base text-gray-500">
              {l10n.getString('create-an-account-to-start-shopping')}
            </Text>
          </View>

          {/* Error Message */}
          {errors.root && (
            <View className="mb-4 p-3 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-center">
                {errors.root.message}
              </Text>
            </View>
          )}

          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={l10n.getString('email')}
                placeholder={l10n.getString('enter-your-email')}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                error={
                  errors.email?.message
                    ? l10n.getString(errors.email.message)
                    : undefined
                }
                containerClassName="mb-4"
              />
            )}
          />

          {/* Create Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label={l10n.getString('create-password')}
                placeholder={l10n.getString('enter-your-password')}
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={
                  errors.password?.message
                    ? l10n.getString(errors.password.message, { n: 6 })
                    : undefined
                }
                containerClassName="mb-4"
              />
            )}
          />

          {/* Confirm Password Input */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={l10n.getString('confirm-password')}
                placeholder={l10n.getString('re-enter-your-password')}
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={
                  errors.confirmPassword?.message
                    ? l10n.getString('passwords-must-match')
                    : undefined
                }
                containerClassName="mb-4"
              />
            )}
          />

          {/* Terms Agreement */}
          <TouchableOpacity
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            className="flex-row items-center mb-6"
          >
            <View
              className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                agreeToTerms ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
            >
              {agreeToTerms && <Icon name="check" size={12} color="white" />}
            </View>
            <Text className="text-sm text-gray-700">
              {l10n.getString('i-agree-to')}{' '}
              <Text className="text-primary">{l10n.getString('terms-and-conditions')}</Text>
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            title={loading ? l10n.getString('creating-account') : l10n.getString('register')}
            className="mb-6"
          />

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm">{l10n.getString('or')}</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            className="flex-row items-center justify-center py-3 px-4 bg-white border border-gray-300 rounded-lg mb-6"
          >
            <MaterialIcon name="google" size={20} color="#4285F4" />
            <Text className="text-base text-gray-700 font-content ml-2">
              {l10n.getString('continue-with-google')}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">{l10n.getString('have-an-account')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text className="text-primary font-content-bold">{l10n.getString('login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
