import React from "react";

import { HiOutlineBars3 } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../features/order/orderSlice";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  return (
    <nav>
      <div className="nav--items">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" width="70px" />
          </Link>
        </div>
        <div>
          {" "}
          <HiOutlineBars3
            onClick={() => {
              dispatch(toggleSidebar(true));
            }}
            color="#006da4"
            style={{
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;