import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, interpolate, Layout, BounceIn, SequencedTransition, FadingTransition, runOnJS, useAnimatedStyle, useSharedValue, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';

const SHOW_GLOBAL_MODAL = 'show_global_modal';

export type GlobalModalProps = {
  skipQueue?: boolean;
  modalKey?: string,
  Component: React.FC
};

export function showGlobalModal(prop: GlobalModalProps) {
  DeviceEventEmitter.emit(SHOW_GLOBAL_MODAL, prop);
}

function GlobalModal() {
  const opacityValue = useSharedValue(0)
  const backdropOpacityStyle = useAnimatedStyle(() => {
    return { opacity: interpolate(opacityValue.value, [0, 1], [0, 0.5]) }
  })
  const containerOpacityStyle = useAnimatedStyle(() => {
    return { opacity: opacityValue.value }
  })

  const [modalProps, setModalProps] = useState<GlobalModalProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      SHOW_GLOBAL_MODAL,
      (prop: GlobalModalProps) => {
        setModalProps((props) => [
          ...props.filter((it) => !it.skipQueue),
          { ...prop, modalKey: prop.modalKey ?? Date.now().toString() },
        ]);
      }
    );
    return () => {
      sub.remove();
    };
  }, []);

  const activeModalProp = modalProps.slice(-1)[0]
  const isVisible = activeModalProp !== undefined

  const closeModal = () => {
    setModalProps((props) => props.slice(0, -1));
  }

  const hideModal = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true)
      opacityValue.value = withTiming(1, {
        duration: 300,
        easing: Easing.ease,
      })
    } else {
      opacityValue.value = withTiming(0, {
        duration: 300,
        easing: Easing.linear,
      }, (finished) => {
        if (finished) {
          runOnJS(hideModal)()
        }
      })

    }
  }, [isVisible])

  return (
    <Modal
      animationType='none'
      transparent
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <Animated.View style={[styles.backdrop, backdropOpacityStyle]}></Animated.View>
      <Animated.View style={[styles.centeredView, containerOpacityStyle]}>
        <Animated.View needsOffscreenAlphaCompositing style={styles.modalView} layout={Layout.duration(300)}>
          {activeModalProp?.Component && (
            <Animated.View key={activeModalProp?.modalKey} exiting={FadeOut} entering={FadeIn.delay(300).duration(250)}>
              <activeModalProp.Component />
            </Animated.View>
          )}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={closeModal}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
    backgroundColor: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default GlobalModal;
