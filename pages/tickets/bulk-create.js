import { CSVReader } from "react-papaparse";
import Layout from "../../components/layout";
import { useRef, useState } from "react";
import { batchAddTickets } from "../../src/graphql/mutations.ts";
import moment from "moment";
import { API, withSSRContext } from "aws-amplify";
const BulkCreateTickets = () => {
  const buttonRef = useRef();
  const [dataArray, setDataArray] = useState([]);

  const batchTickets = async () => {
    const res = groupByN(25, dataArray);

    res.map((el) =>
      el.map(async (set) => {
        await API.graphql({
          query: batchAddTickets,
          variables: {
            tickets: [set],
          },
        });
      })
    );
  };

  let groupByN = (n, data) => {
    let result = [];
    for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
    return result;
  };

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    const length = data.length;
    let myArray = [];
    data.map((contract) => myArray.push(contract.data));
    myArray.map((i) => {
      findNonStringKeys(i);
      convertToDateTime(i);
    });
    setDataArray(myArray);
  };

  const convertToBoolean = (value) => {
    return value == "TRUE";
  };

  const convertToNumber = (value) => {
    return parseFloat(value);
  };

  const convertToDateTime = (obj) => {
    const dateTimeKeys = ["ticketDate"];
    Object.keys(obj).forEach((key) => {
      if (key === dateTimeKeys[0]) {
        const date = moment(obj[key]);
        obj[key] = date.toDate();
      }
    });
  };

  const findNonStringKeys = (obj) => {
    const nonStringKeys = [
      "baleCount",
      "grossWeight",
      "tareWeight",
      "netWeight",
      "netTons",
    ];
    Object.keys(obj).forEach((key) => {
      if (obj[key] === "") {
        delete obj[key];
      }
      // if (key === nonStringKeys[0]) {
      //   const bool = convertToBoolean(obj[key]);
      //   obj[key] = bool;
      // }
      if (key === nonStringKeys[1] || key === nonStringKeys[0]) {
        const num = convertToNumber(obj[key]);
        obj[key] = num;
      }
    });
  };

  console.log("data array: ", dataArray);

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log(data);
  };

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const replaceEmptyStringWithNull = (x) => {
    Object.values(x) === "" ? null : x;
    console.log(x);
  };
  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Bulk Upload Tickets</h3>
        </div>
        <div className="py-12 px-24 mx-auto">
          <CSVReader
            ref={buttonRef}
            onFileLoad={(data) => handleOnFileLoad(data)}
            onError={(err) => handleOnError(err)}
            noClick
            noDrag
            config={{ header: true }}
            onRemoveFile={(data) => handleOnRemoveFile(data)}
          >
            {({ file }) => (
              <div className="w-1/2 flex justify-items-center items-center h-12 mx-auto">
                <button
                  className="w-3/12 border border-gray-900 h-full"
                  type="button"
                  onClick={(e) => handleOpenDialog(e)}
                >
                  Browe file
                </button>
                <div className="w-8/12 h-full border border-gray-300 text-center">
                  <span>{file && file.name}</span>
                </div>
                <button
                  className="w-3/12 h-full border border-red-800"
                  onClick={(data) => handleRemoveFile(data)}
                >
                  Remove
                </button>
              </div>
            )}
          </CSVReader>
        </div>
        <div className="w-1/2 mx-auto text-2xl text-gray-900 text-center">
          <p>
            {dataArray.length > 0
              ? `Number of items in file: ${dataArray.length}`
              : "Please upload csv file"}
          </p>
          <button
            className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
            onClick={() => batchTickets()}
          >
            Process
          </button>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();

    return {
      props: {
        authenticated: true,
        username: user.username,
      },
    };
  } catch (err) {
    res.writeHead(302, { Location: "/sign-in" });
    res.end();
    return {
      props: {
        authenticated: false,
      },
    };
  }
}

export default BulkCreateTickets;
