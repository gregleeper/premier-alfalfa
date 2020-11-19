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
        <div className="px-12 underline text-blue-700">
          <ul>
            <li>
              <Link href="/reports/commodity-ton-totals">
                <a>Commodity Ton Totals</a>
              </Link>
            </li>
            <li>
              <Link href="/reports/total-tons-hauled">
                <a>Total Tons Hauled</a>
              </Link>
            </li>
            <li>
              <Link href="/reports/status-report-sold">
                <a>Status Report Sold</a>
              </Link>
            </li>
            <li>
              <Link href="/reports/status-report-purchase">
                <a>Status Report Purchase</a>
              </Link>
            </li>
            <li>
              <Link href="/reports/invoices">
                <a>Invoices</a>
              </Link>
            </li>
            <li>
              <Link href="reports/accounts-receivable">
                <a>Accounts Receivable</a>
              </Link>
            </li>
            <li>
              <Link href="reports/accounts-payable">
                <a>Accounts Payable</a>
              </Link>
            </li>
            <li>
              <Link href="reports/settlements">
                <a>Settlements</a>
              </Link>
            </li>
            <li>
              <Link href="reports/inventory-balance">
                <a>Inventory Balance</a>
              </Link>
            </li>
            <li>
              <Link href="reports/inventory-reduction">
                <a>Inventory Reduction</a>
              </Link>
            </li>
            <li>
              <Link href="reports/active-contracts-list">
                <a>Active Contracts List</a>
              </Link>
            </li>
            <li>
              <Link href="reports/tickets-by-contract">
                <a>Tickets By Contract</a>
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
