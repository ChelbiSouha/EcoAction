import React, { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  disabled,
  loading,
  className,
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Since we're using NativeWind, adding animated classes for scale is harder without react-native-reanimated.
  // Instead, we can add simple React Native Animated events or just rely on a slightly softer touch reaction via activeOpacity

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const baseClasses = 'px-6 py-4 rounded-full items-center justify-center flex-row shadow-sm shadow-black/10';
  const variantClasses = {
    primary: 'bg-forest',
    secondary: 'bg-leaf',
    danger: 'bg-danger',
    outline: 'border-2 border-forest bg-transparent',
  };
  const textClasses = {
    primary: 'text-white font-extrabold text-lg tracking-wide',
    secondary: 'text-white font-extrabold text-lg tracking-wide',
    danger: 'text-white font-extrabold text-lg tracking-wide',
    outline: 'text-forest font-extrabold text-lg tracking-wide',
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        className={twMerge(
          baseClasses,
          variantClasses[variant],
          (disabled || loading) && 'opacity-60',
          className
        )}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? '#2E7D32' : 'white'} className="mr-3" />
        ) : null}
        <Text className={twMerge(textClasses[variant])}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
