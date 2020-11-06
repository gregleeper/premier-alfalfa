import "../styles/globals.css";
import Amplify from "aws-amplify";
import config from "../src/aws-exports";
import "react-datepicker/dist/react-datepicker.css";
import { ReactQueryCacheProvider, QueryCache } from "react-query";

Amplify.configure({ ...config, ssr: true });

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Component {...pageProps} />
    </ReactQueryCacheProvider>
  );
}

export default MyApp;
