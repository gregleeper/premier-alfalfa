import Link from "next/link";
import { useRouter } from "next/router";
import NavItem from "./navItem";
import SvgRetroSun1 from "./retroSun";

const Nav = () => {
  const router = useRouter();
  const activePage = router.pathname;

  return (
    <nav className="border-b-2 border-gray-800 bg-gray-800 shadow">
      <div className="py-4">
        <ul className="flex justify-around">
          <SvgRetroSun1 width="1.75em" height="1.75em" />
          <NavItem href="/tickets" current={activePage}>
            Tickets
          </NavItem>
          <NavItem href="/payments" current={activePage}>
            Payments
          </NavItem>
          <NavItem href="/vendors" current={activePage}>
            Vendors
          </NavItem>
          <NavItem href="/contracts" current={activePage}>
            Contracts
          </NavItem>
          <NavItem href="/commodities" current={activePage}>
            Commodities
          </NavItem>
          <NavItem href="/reports" current={activePage}>
            Reports
          </NavItem>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
