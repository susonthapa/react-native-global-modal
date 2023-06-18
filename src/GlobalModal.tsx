import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const SHOW_GLOBAL_MODAL = 'show_global_modal';

export type GlobalModalProps = {
  skipQueue?: boolean;
  Component: React.FC
};

export function showGlobalModal(prop: GlobalModalProps) {
  DeviceEventEmitter.emit(SHOW_GLOBAL_MODAL, prop);
}

function GlobalModal() {
  const [modalProps, setModalProps] = useState<GlobalModalProps[]>([]);

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

  const closeModal = () => {
    setModalProps((props) => props.slice(0, -1));
  }

  return (
    <Modal
      animationType='fade'
      visible={activeModalProp !== undefined}
      onRequestClose={closeModal}
      transparent
    >
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
