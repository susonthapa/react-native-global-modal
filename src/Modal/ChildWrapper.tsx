import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Easing, FadeOut, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

type ChildWrapperProps = {
  isEnabled: boolean,
  hideClose?: boolean,
  onClosePress: () => void,
  children: React.ReactNode,
}

function ChildWrapper({ isEnabled, hideClose, onClosePress, children }: ChildWrapperProps) {
  const opacityValue = useSharedValue(0)
  const viewStyle = useAnimatedStyle(() => {
    return { opacity: opacityValue.value }
  }, [isEnabled])

  useEffect(() => {
    if (isEnabled) {
      opacityValue.value = withDelay(500, withTiming(1, {
        duration: 250,
        easing: Easing.ease,
      }))
    } else {
      opacityValue.value = withTiming(0, {
        duration: 250,
        easing: Easing.ease,
      })
    }
  }, [isEnabled])

  console.log(`ViewStyle: `, viewStyle);


  return (
    <Animated.View
      style={[viewStyle, {
        position: isEnabled ? 'relative' : 'absolute',
        borderColor: 'red',
        borderWidth: 1,
        margin: 32,
      }]}
      exiting={FadeOut.duration(250)}
    >
      {children}
      {!hideClose && <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={onClosePress}>
        <Text style={styles.textStyle}>Close Modal</Text>
      </Pressable>
      }
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 10,
    elevation: 2,
    marginTop: 16,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChildWrapper