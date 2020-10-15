import Link from "next/link";

const Nav = () => {
  return (
    <nav className="">
      <div>
        <ul className="flex justify-around">
          <li>Dashboard</li>
          <li>
            <Link href="/tickets">
              <a>Tickets</a>
            </Link>
          </li>
          <li>
            <Link href="/vendors">
              <a>Vendors</a>
            </Link>
          </li>
          <li>
            <Link href="/contracts">
              <a>Contracts</a>
            </Link>
          </li>
          <li>
            <Link href="/commodities">
              <a>Commodities</a>
            </Link>
          </li>
          <li>
            <Link href="/reports">
              <a>Reports</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
