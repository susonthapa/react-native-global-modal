import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const SHOW_GLOBAL_MODAL = 'show_global_modal';

export type GlobalModalProps = {
  skipQueue?: boolean;
  Component: React.FC
};

export function showGlobalModal(prop: GlobalModalProps) {
  DeviceEventEmitter.emit(SHOW_GLOBAL_MODAL, prop);
}

function GlobalModal() {
  const opacityValue = useSharedValue(0)
  const opacityStyle = useAnimatedStyle(() => {
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
          prop,
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
      opacityValue.value = withTiming(0.5, {
        duration: 300,
        easing: Easing.ease,
      })
    } else {
      opacityValue.value = withTiming(0.0, {
        duration: 300,
        easing: Easing.linear,
      }, (finished, current) => {
        console.log(`TODO: `, finished, current);
        
        if (finished) {
          runOnJS(hideModal)()
        }
      })

    }
  }, [isVisible])

  console.log(`TODO: visible`, modalVisible);
  

  return (
    <Modal
      animationType='none'
      transparent
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <Animated.View style={[styles.backdrop, opacityStyle]}></Animated.View>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {activeModalProp?.Component && <activeModalProp.Component />}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={closeModal}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
