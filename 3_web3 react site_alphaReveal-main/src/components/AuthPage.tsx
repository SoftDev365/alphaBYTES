import { useDisclosure } from "@chakra-ui/react";
import Check from './Check';
import AccountModal from './AccountModal';

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Check handleOpenModal={onOpen} />
      <AccountModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

export default Index;