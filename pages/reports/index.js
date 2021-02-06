import Layout from "../../components/layout";
import { withSSRContext } from "aws-amplify";
import Link from "next/link";
const Reports = () => {
  return (
    <Layout>
      <div>
        <div className="text-center w-1/2 mx-auto py-6 text-2xl font-bold">
          <h3>Reports</h3>
        </div>
        <div className="px-12  text-blue-700">
          <ul className="py-2">
            <h6 className="no-underline text-gray-900 font-semibold text-xl">
              Reports
            </h6>
            <li>
              <Link href="/reports/commodity-ton-totals">
                <a className="hover:text-blue-900">Commodity Ton Totals</a>
              </Link>
            </li>
            <li>
              <Link href="/reports/total-tons-hauled">
                <a className="hover:text-blue-900 transform transition-all ease-in-out duration-300">
                  Total Tons Hauled
                </a>
              </Link>
            </li>
            <li>
              <Link href="reports/active-contracts-list">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Active Contracts List
                </a>
              </Link>
            </li>
            <li>
              <Link href="reports/tickets-by-contract">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Tickets By Contract
                </a>
              </Link>
            </li>
            <li>
              <Link href="reports/margins">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Avg Cost Per Ton
                </a>
              </Link>
            </li>
          </ul>
          <ul className="py-2">
            <h6 className="no-underline text-gray-900 font-semibold text-xl">
              Purchases
            </h6>

            <li>
              <Link href="/reports/status-report-purchase">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Status Report Purchase
                </a>
              </Link>
            </li>

            <li>
              <Link href="reports/accounts-payable">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Accounts Payable
                </a>
              </Link>
            </li>
            <li>
              <Link href="reports/settlements">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Settlements
                </a>
              </Link>
            </li>
            <li>
              <Link href="reports/inventory-balance">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Inventory Balance
                </a>
              </Link>
            </li>
            <li>
              <Link href="reports/inventory-reduction">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Inventory Reduction
                </a>
              </Link>
            </li>
          </ul>
          <ul className="py-2">
            <h6 className="no-underline text-gray-900 font-semibold text-xl">
              Sales
            </h6>
            <li>
              <Link href="/reports/status-report-sold">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Status Report Sold
                </a>
              </Link>
            </li>
            <li>
              <Link href="/reports/invoices">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Invoices
                </a>
              </Link>
            </li>
            <li>
              <Link href="reports/accounts-receivable">
                <a className="hover:text-blue-900 transform transition-colors ease-in-out duration-300">
                  Accounts Receivable
                </a>
              </Link>
            </li>
          </ul>
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

export default Reports;
