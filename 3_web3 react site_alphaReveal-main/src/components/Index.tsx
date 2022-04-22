import { useDisclosure } from "@chakra-ui/react";
import ConnectButton from './ConnectButton';
import AccountModal from './AccountModal';

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <ConnectButton handleOpenModal={onOpen} />
      <AccountModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

export default Index;