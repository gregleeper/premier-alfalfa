import "../styles/globals.css";
import Amplify from "aws-amplify";
import config from "../src/aws-exports";
import "react-datepicker/dist/react-datepicker.css";

Amplify.configure({ ...config, ssr: true });

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
