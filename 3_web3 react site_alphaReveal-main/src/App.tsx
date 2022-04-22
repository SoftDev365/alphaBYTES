import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import "@fontsource/inter";
import Main from './Main';



function App() {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Main />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
