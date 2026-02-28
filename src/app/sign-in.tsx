import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, Mail, Lock, User as UserIcon } from 'lucide-react-native';

export default function SignInScreen() {
  const { signIn, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string, email?: string, password?: string }>({});
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    let newErrors: { name?: string, email?: string, password?: string } = {};

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsAuthLoading(true);
    try {
      await register(name, email, password);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsAuthLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-sand" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 32, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <View className="bg-forest/10 p-5 rounded-full mb-4 border-2 border-forest/20">
              <Leaf size={56} color="#2E7D32" />
            </View>
            <Text className="text-4xl font-extrabold text-forest mb-2">EcoAction</Text>
            <Text className="text-earth text-center text-base font-medium">
              Join the movement. Make an impact.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-[24px] shadow-lg shadow-black/5 border border-white/50 space-y-4">
            {!isLogin && (
              <View className="mb-4">
                <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</Text>
                <View className={`flex-row items-center bg-sand/30 border ${errors.name ? 'border-danger' : 'border-sand/50'} rounded-2xl px-4 py-3`}>
                  <UserIcon size={20} color={errors.name ? '#dc2626' : '#8D6E63'} className="mr-3" />
                  <TextInput
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={(t) => { setName(t); setErrors({ ...errors, name: undefined }); }}
                    className="flex-1 text-base text-gray-800"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.name && <Text className="text-danger text-xs mt-1 ml-2">{errors.name}</Text>}
              </View>
            )}

            <View className="mb-4">
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</Text>
              <View className={`flex-row items-center bg-sand/30 border ${errors.email ? 'border-danger' : 'border-sand/50'} rounded-2xl px-4 py-3`}>
                <Mail size={20} color={errors.email ? '#dc2626' : '#8D6E63'} className="mr-3" />
                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setErrors({ ...errors, email: undefined }); }}
                  className="flex-1 text-base text-gray-800"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              {errors.email && <Text className="text-danger text-xs mt-1 ml-2">{errors.email}</Text>}
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">Password</Text>
              <View className={`flex-row items-center bg-sand/30 border ${errors.password ? 'border-danger' : 'border-sand/50'} rounded-2xl px-4 py-3`}>
                <Lock size={20} color={errors.password ? '#dc2626' : '#8D6E63'} className="mr-3" />
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setErrors({ ...errors, password: undefined }); }}
                  className="flex-1 text-base text-gray-800"
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                />
              </View>
              {errors.password && <Text className="text-danger text-xs mt-1 ml-2">{errors.password}</Text>}
            </View>

            <View className="space-y-4">
              {isLogin ? (
                <>
                  <Button
                    title="Sign In"
                    onPress={handleSignIn}
                    loading={isAuthLoading || isLoading}
                    variant="primary"
                    className="w-full"
                  />
                  <Button
                    title="Create Account"
                    onPress={() => {
                      setIsLogin(false);
                      setErrors({});
                    }}
                    variant="outline"
                    className="w-full mt-3"
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Register"
                    onPress={handleRegister}
                    loading={isAuthLoading || isLoading}
                    variant="primary"
                    className="w-full"
                  />
                  <Button
                    title="Back to Sign In"
                    onPress={() => {
                      setIsLogin(true);
                      setErrors({});
                    }}
                    variant="outline"
                    className="w-full mt-3"
                  />
                </>
              )}
            </View>
          </View>

          <Text className="text-earth text-sm mt-8 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
