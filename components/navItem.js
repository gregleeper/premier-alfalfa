import Link from "next/link";

const NavItem = ({ children, href, current }) => {
  return (
    <li>
      <Link href={href}>
        {current === href ? (
          <a className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ">
            {children}
          </a>
        ) : (
          <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ">
            {children}
          </a>
        )}
      </Link>
    </li>
  );
};
export default NavItem;
