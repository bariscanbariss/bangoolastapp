import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import Text from '@components/common/text';
import Button from '@components/common/button';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ant-design';

const EnterOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(57);
  const navigation = useNavigation();
  const route = useRoute();
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const email = route.params?.email || '';

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // If pasted, split and fill
      const values = value.split('').slice(0, 4);
      const newOtp = [...otp];
      values.forEach((val, i) => {
        if (index + i < 4) {
          newOtp[index + i] = val;
        }
      });
      setOtp(newOtp);
      // Focus last filled input
      const lastIndex = Math.min(index + values.length, 3);
      inputRefs[lastIndex].current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      const otpCode = otp.join('');
      // TODO: Implement OTP verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Navigate to Change Password screen
      navigation.navigate('ChangePassword', { email, otp: otpCode });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(57);
    // TODO: Implement resend OTP API call
    console.log('Resend OTP');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            Verify OTP
          </Text>
          <Text className="text-base text-gray-500 leading-6">
            Enter the 4-digit code we sent to your email address.
          </Text>
        </View>

        {/* OTP Input */}
        <View className="flex-row justify-between mb-6">
          {otp.map((digit, index) => (
            <View
              key={index}
              className="w-16 h-16 border-2 border-gray-300 rounded-lg items-center justify-center"
              style={{
                borderColor: digit ? '#8e6cef' : '#d1d5db',
              }}
            >
              <TextInput
                ref={inputRefs[index]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                className="text-2xl font-content-bold text-gray-900 text-center w-full"
                selectTextOnFocus
              />
            </View>
          ))}
        </View>

        {/* Info Text */}
        <Text className="text-sm text-gray-500 text-center mb-2">
          A code has been sent to your phone
        </Text>

        {/* Resend Timer */}
        <View className="flex-row justify-center mb-8">
          {timer > 0 ? (
            <Text className="text-sm text-gray-700">
              Resend in{' '}
              <Text className="text-primary font-content-bold">
                {formatTime(timer)}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-sm text-primary font-content-bold">
                Resend Code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Continue Button */}
        <Button
          onPress={handleSubmit}
          loading={loading}
          disabled={otp.some((d) => !d)}
          title={loading ? 'Verifying...' : 'Continue'}
        />
      </View>
    </View>
  );
};

export default EnterOTP;
