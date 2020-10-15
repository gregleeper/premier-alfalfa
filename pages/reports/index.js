import Layout from "../../components/layout";
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
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
