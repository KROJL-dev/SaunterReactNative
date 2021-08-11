import { Animated } from 'react-native';
export const toggleStartedAnimation = (
  value: number,
  ref: Animated.Value,
  duration: number = 200
) => {
  Animated.timing(ref, {
    toValue: value,
    duration: duration,
    easing: (v) => v,
    useNativeDriver: true,
  }).start();
};
