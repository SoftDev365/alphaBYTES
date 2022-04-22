import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import "../assets/css/layout.css";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';


type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  const navigate = useNavigate();

  const home = ()=> {
    navigate('/');
  }
  const authpage = () => {
    navigate('/authpage');
  }
  return (
    <div>
      <div className="layout">
      
      </div>
      <div style={{ position: "relative" }}>
     
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          padding="20px"
          
        >
           <Tabs variant='soft-rounded' 
            position="absolute"
            top="70px"
            colorScheme='yellow'>
              <TabList
              >
                <Tab onClick={home}
                fontSize={"20px"}
                
                _selected={{
                  color: "#dfc062",
                  boxShadow: "var(--chakra-shadows-outline)"}}
                  >
                  Inventory</Tab>
                <Tab onClick={authpage}
                fontSize={"20px"}
                _selected={{
                  color: "#dfc062",
                  boxShadow: "var(--chakra-shadows-outline)"}}
                  >
                Verify if claimed</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                </TabPanel>
                <TabPanel>
                </TabPanel>
              </TabPanels>
            </Tabs>
          {children}
        </Flex>
      </div>
    </div>
  );
}
