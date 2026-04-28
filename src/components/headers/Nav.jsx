import { menuItems } from "@/data/menu";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <>
      {menuItems.map((item, index) => (
        <li
          key={index}
          className={`dropdown2 p-0 ${
            item.links.some(
              (el) => el.href.split("/")[1] === pathname.split("/")[1]
            )
              ? "current"
              : ""
          } ${item.hasDropdown === false ? "no-dropdown" : ""} `}
        >
          {/* If hasDropdown is false, use Link directly */}
          {item.hasDropdown === false ? (
            <Link to={item.links[0].href}>{item.title}</Link>
          ) : (
            <>
              <a>{item.title}</a>
              <ul>
                {item.links.map((link, linkIndex) => (
                  <li
                    style={{ textAlign: "right" }}
                    key={linkIndex}
                    className={
                      link.href.split("/")[1] === pathname.split("/")[1]
                        ? "current"
                        : ""
                    }
                  >
                    <Link to={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
      ))}
    </>
  );
}
