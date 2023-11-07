import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Modal, StyleSheet } from 'react-native';
import Animated, { Easing, interpolate, Layout, LayoutAnimation, LayoutAnimationFunction, LayoutAnimationsValues, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import ChildWrapper from './ChildWrapper';
import { CHILD_ANIM_DURATION, LAYOUT_ANIM_DURATION, MODAL_ANIM_DURATION } from './Constants';

const SHOW_GLOBAL_MODAL = 'show_global_modal';
const HIDE_GLOBAL_MODAL = "hide_global_modal"

export type GlobalModalProps = {
  skipQueue?: boolean;
  modalKey?: string,
  hideClose?: boolean,
  disableLayoutChangeAnimation?: boolean,
  Component: React.FC
};

export function showGlobalModal(prop: GlobalModalProps) {
  DeviceEventEmitter.emit(SHOW_GLOBAL_MODAL, prop);
}

export function hideGlobalModal(key: string) {
  DeviceEventEmitter.emit(HIDE_GLOBAL_MODAL, key)
}

const layoutAnimation = new Layout().delay(CHILD_ANIM_DURATION)
  .duration(LAYOUT_ANIM_DURATION)
  .build()

// Using duration of 1ms to disable the animation(sort of)
const disabledLayoutAnimation = new Layout().duration(-1).build()

const noDelayLayoutAnimation = new Layout().duration(LAYOUT_ANIM_DURATION).build()

enum LayoutChangeAnimationType {
  DISABLED,
  DEFAULT,
  NO_DELAY
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
  const layoutAnimationType = useSharedValue<LayoutChangeAnimationType>(LayoutChangeAnimationType.DEFAULT)
  const [modalVisible, setModalVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isFirstModalRef = useRef<boolean>(false)

  useEffect(() => {
    const showSub = DeviceEventEmitter.addListener(
      SHOW_GLOBAL_MODAL,
      (prop: GlobalModalProps) => {
        setModalProps((oldProps) => {
          isFirstModalRef.current = oldProps.length === 0
          layoutAnimationType.value = LayoutChangeAnimationType.DEFAULT
          setIsVisible(true)
          return [
            ...oldProps.filter((it) => !it.skipQueue),
            { ...prop, modalKey: prop.modalKey ?? Date.now().toString() },
          ]
        });
      }
    );
    const hideSub = DeviceEventEmitter.addListener(HIDE_GLOBAL_MODAL, (key: string) => {
      setModalProps((oldProps) => {
        layoutAnimationType.value = LayoutChangeAnimationType.DEFAULT
        if (oldProps.length === 1) {
          setIsVisible(false)
          return oldProps
        }
        return oldProps.filter((it) => it.modalKey !== key)
      })
    })
    return () => {
      showSub.remove();
      hideSub.remove()
    };
  }, []);

  const closeModal = () => {
    setModalProps((oldProps) => {
      layoutAnimationType.value = LayoutChangeAnimationType.DEFAULT
      if (oldProps.length === 1) {
        setIsVisible(false)
        return oldProps
      }
      return oldProps.slice(0, -1)
    });
  }

  const onModalHide = () => {
    setModalVisible(false)
    setModalProps([])
  }

  const CustomLayoutAnimation: LayoutAnimationFunction = (values: LayoutAnimationsValues): LayoutAnimation => {
    'worklet'
    switch(layoutAnimationType.value) {
      case LayoutChangeAnimationType.DISABLED:
        return disabledLayoutAnimation(values)
      case LayoutChangeAnimationType.NO_DELAY:
        return noDelayLayoutAnimation(values)
      default:
        return layoutAnimation(values)
    }
  }

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true)
      opacityValue.value = withTiming(1, {
        duration: MODAL_ANIM_DURATION,
        easing: Easing.ease,
      })
    } else {
      opacityValue.value = withTiming(0, {
        duration: MODAL_ANIM_DURATION,
        easing: Easing.ease,
      }, (finished) => {
        if (finished) {
          runOnJS(onModalHide)()
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
      <Animated.View style={[styles.backdrop, backdropOpacityStyle]} />
      <Animated.View
        style={[styles.centeredView, containerOpacityStyle]}
        needsOffscreenAlphaCompositing
      >
        <Animated.View
          style={styles.modalView}
          layout={CustomLayoutAnimation}
        >
          {modalProps.map((it, index) => (
            <ChildWrapper
              key={it.modalKey}
              ignoreDelay={isFirstModalRef.current}
              isEnabled={index === modalProps.length - 1}
              hideClose={it.hideClose}
              onClosePress={closeModal}
              onEnterAnimationFinished={() => layoutAnimationType.value = it.disableLayoutChangeAnimation ? LayoutChangeAnimationType.DISABLED : LayoutChangeAnimationType.NO_DELAY}>
              <it.Component />
            </ChildWrapper>
          ))}
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
    overflow: 'hidden',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
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
