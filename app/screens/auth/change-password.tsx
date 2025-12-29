import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Text from '@components/common/text';
import Input from '@components/common/input';
import Button from '@components/common/button';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Icon from '@react-native-vector-icons/ant-design';

const changePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPasswordValue] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const email = route.params?.email || '';
  const otp = route.params?.otp || '';

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  useEffect(() => {
    setPasswordValue(passwordValue || '');
  }, [passwordValue]);

  // Password validation checks
  const validations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      // TODO: Implement change password API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Navigate to login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        }),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({
    label,
    isValid,
  }: {
    label: string;
    isValid: boolean;
  }) => (
    <View className="flex-row items-center mb-2">
      <View
        className={`w-5 h-5 rounded-full mr-2 items-center justify-center ${
          isValid ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <Icon name="check" size={12} color="white" />
      </View>
      <Text className="text-sm text-gray-700">{label}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white p-safe">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-content-bold text-gray-900 mb-2">
              Create new password
            </Text>
            <Text className="text-base text-gray-500">
              Your new password must be different from previously used passwords.
            </Text>
          </View>

          {/* Create New Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Create new password"
                placeholder="Enter new password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
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
                label="Confirm password"
                placeholder="Re-enter new password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.confirmPassword?.message}
                containerClassName="mb-6"
              />
            )}
          />

          {/* Password Requirements */}
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-sm font-content-bold text-gray-900 mb-3">
              Password must have:
            </Text>
            <ValidationItem
              label="At least 8 characters"
              isValid={validations.minLength}
            />
            <ValidationItem
              label="At least one uppercase letter"
              isValid={validations.hasUpperCase}
            />
            <ValidationItem
              label="At least one lowercase letter"
              isValid={validations.hasLowerCase}
            />
            <ValidationItem
              label="At least one number"
              isValid={validations.hasNumber}
            />
          </View>

          {/* Submit Button */}
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            title={loading ? 'Updating...' : 'Reset Password'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;
