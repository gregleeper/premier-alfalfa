import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { API, withSSRContext } from "aws-amplify";
import moment from "moment";
import Layout from "../../components/layout";
import DatePicker from "react-datepicker";
import { useCommodityAvgPrice } from "../../utils/hooks/useCommodityAvgPrice.ts";

const StatusReport = () => {
  let toPrint = useRef(null);

  const [endDate, setEndDate] = useState(new Date());
  const [days, setDays] = useState(30);

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleNumberOfDays = (event) => {
    event.preventDefault();
    if (!event.target) {
      setDays(event.target.value);
    } else {
      setDays(30);
    }
  };

  const { summary, status } = useCommodityAvgPrice(endDate, days);

  console.log(summary, status);

  return (
    <Layout>
      <div className="px-4">
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Purchase Costs</h3>
        </div>
        <div className="mb-2 py-4">
          <span>End Date</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => handleEndDateChange(date)}
            className="form-input w-full"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="days" className=" pr-2">
            Days
          </label>
          <input
            name="days"
            className="form-input"
            type="number"
            onChange={(event) => handleNumberOfDays(event)}
          />
        </div>

        <ReactToPrint
          trigger={() => (
            <a
              href="#"
              className="px-3 py-2 border border-gray-800 shadow hover:bg-gray-800 hover:text-white"
            >
              Print Report
            </a>
          )}
          content={() => toPrint}
        />
        <div
          ref={(el) => (toPrint = el)}
          className="mb-24 pt-12 w-11/12 mx-auto"
        >
          <div className="text-center">
            <h6 className="text-2xl">{`Costs for Commodity Purchases`}</h6>
            <h3 className="text-base font-light">{`${days} day average ending ${moment(
              endDate
            ).format("MM-DD-YYYY")} `}</h3>
          </div>
          {status !== "loading" ? (
            <div className="w-1/2 mx-auto mt-4">
              <table>
                <thead>
                  <tr>
                    <th className="py-2 px-4">Commodity</th>
                    <th className="py-2 px-4">Tons Hauled</th>
                    <th className="py-2 px-4">Total Paid</th>
                    <th className="py-2 px-4">Number of Loads</th>
                    <th className="py-2 px-4">Avg Price/Ton</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((commoaidy) => (
                    <tr>
                      <td className="py-2 px-4 ">{commoaidy.commodity}</td>
                      <td className="py-2 px-4 text-center ">
                        {commoaidy.tonsHauled}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {commoaidy.totalPaid}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {commoaidy.numberOfLoad}
                      </td>
                      <td className="py-2 px-4 text-center font-semibold">
                        {commoaidy.avgPricePerTon}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <p>Loading...</p>
            </div>
          )}
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

export default StatusReport;
