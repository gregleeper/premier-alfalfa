import Link from "next/link";

const Nav = () => {
  return (
    <nav className="">
      <div className="py-4">
        <ul className="flex justify-around">
          <li>Dashboard</li>
          <li>
            <Link href="/tickets">
              <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline ">
                Tickets
              </a>
            </Link>
          </li>
          <li>
            <Link href="/payments">
              <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline ">
                Payments
              </a>
            </Link>
          </li>
          <li>
            <Link href="/vendors">
              <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline">
                Vendors
              </a>
            </Link>
          </li>
          <li>
            <Link href="/contracts">
              <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline">
                Contracts
              </a>
            </Link>
          </li>
          <li>
            <Link href="/commodities">
              <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline">
                Commodities
              </a>
            </Link>
          </li>
          <li>
            <Link href="/reports">
              <a className="text-blue-700 underline hover:text-blue-600 hover:no-underline">
                Reports
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
