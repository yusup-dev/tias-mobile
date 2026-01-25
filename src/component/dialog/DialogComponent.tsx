import {Text} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';

const DialogComponent = ({
  visible = false,
  onDismiss,
  onDone,
  desc = {
    title: 'This is simple dialog',
    buttonCancel: 'Cancel',
    buttonDone: 'Done',
  },
  title = 'Alert',
}: {
  visible: Boolean;
  onDismiss?: () => any;
  onDone?: () => any;

  desc?: {
    title: string;
    buttonDone?: string;
    buttonCancel?: string;
  };
  title: string;
}) => {
  //   const
  return (
    <Portal>
      <Dialog
        style={{
          backgroundColor: 'white',
        }}
        visible={visible ? true : false}
        onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{desc.title}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {desc.buttonCancel ? (
            <Button onPress={onDismiss}>{desc.buttonCancel}</Button>
          ) : (
            <></>
          )}
          {desc.buttonDone ? (
            <Button onPress={onDone}>{desc.buttonDone}</Button>
          ) : (
            <></>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogComponent;
