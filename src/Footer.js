import React, { useEffect, useContext, useRef, useState } from "react";
import { FaCompress, FaAngleRight } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { GlobalContext } from "./GlobalProvider";
import Menu from "./Menu";
import "./App.css";
const Footer = () => {
  // const { x, y, showMenu } = useRightClickMenu();
  const {
    sheets,
    setSheets,
    dashboards,
    setDashboards,
    showMenu,
    setShowMenu,
    selectedSheet,
  } = useContext(GlobalContext);

  const handleAddSheet = () => {
    const newSheet = { name: `sheet${sheets.length}`, workbooks: [] };
    setSheets((prev) => [...prev, newSheet]);
  };

  const handleAddDashboard = () => {
    const newDashboard = {
      name: `dashboard${dashboards.length}`,
      graphs: [0, 1, 2, 3, 4, 5],
    };
    setDashboards((prev) => [...prev, newDashboard]);
  };
  const updateSheetname = (e) => {
    e.preventDefault();
    setShowMenu(true);
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
  };
  const handleClick = () => {
    showMenu && setShowMenu(false);
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
  return (
    <>
      <hr></hr>

      <div className="footer">
        <button>
          <Link to="/Datasource">Data Source</Link>
        </button>

        {sheets.map((sheet, idx) => (
          <button key={idx}>
            <Link
              to={`/Sheet/${sheet.name}`}
              onContextMenu={updateSheetname}
              contextmenu="mymenu"
            >
              {sheet.name}
            </Link>
          </button>
        ))}
        <button onClick={handleAddSheet}>
          <FaAngleRight />
        </button>
        {dashboards.map((dashboard, idx) => (
          <button key={idx}>
            <Link to={`/dashboard/${dashboard.name}`}>{dashboard.name}</Link>
          </button>
        ))}
        <button onClick={handleAddDashboard}>
          <FaCompress />
        </button>
      </div>
      <hr></hr>
    </>
  );
};

export default Footer;
