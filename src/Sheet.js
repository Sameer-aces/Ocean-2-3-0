import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { isEmpty } from "lodash";
import Plot from "react-plotly.js";
import { FaTrash } from "react-icons/fa";
import { GlobalContext } from "./GlobalProvider";
import Header from "./Header";
import Footer from "./Footer";
import ImportExcel from "./ImportExcel";
import { Scrollbars } from "react-custom-scrollbars";
import Granularity from "./Granularity";
import Filter from "./Filter";
import Condition from "./Condition";
import Menu from "./Menu";
// import ReactWordcloud from "react-wordcloud";

const Sheet = () => {
  const [sheetParams, setSheetParam] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();

  const {
    sheets,
    setSheets,
    selectedSheet,
    setSelectedSheet,
    selectedWB,
    setSelectedWB,
    selectedWBSheet,
    setSelectedWBSheet,
    filterValue,
    filterOperator,
    filterType,
    sortType,
    setSortType,
    sort,
    setSort,
    showMenu,
    setShowMenu,
    dropValue,
  } = useContext(GlobalContext);
  const dragItem = useRef();
  const sheetParam = useParams().sheet;
  const navigate = useNavigate();
  // Navigate to Home Page
  async function homehandler(event) {
    event.preventDefault();
    navigate("/", { replace: true });
  }
  //sheet based on checkbox
  const handleSheetChange = (event) => {
    setSelectedWBSheet(event.target.value);
  };

  // to get particular row/column data
  const processCsv = (jsonData) => {
    const head = jsonData[0];
    const rows = jsonData.slice(1);
    const newArray = rows.map((row) => {
      const values = row;
      const eachObject = head.reduce((obj, header, i) => {
        obj[header] = values[i];

        return obj;
      }, {});
      return eachObject;
    });

    return newArray;
  };
  const handleDrop = (event) => {
    const dragValue = dragItem.current;
    const field = event.currentTarget.id;
    const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
      (record) => record[dragValue]
    );
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? { ...s, [field]: { key: dragValue, values: plotValue } }
        : s
    );
    setSheets(tempSheets);
  };
  //Graph Selection
  const selectGraph = (event) => {
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? {
            ...s,
            graph: event.target.value,
          }
        : s
    );
    setSheets(tempSheets);
  };

  const wordCloud = () => {
    var x = document.getElementById("wordCloud");

    if (x.style.display === "none") {
      x.style.display = "flex";
    } else {
      x.style.display = "none";
    }
  };

  //Delete Values
  const deleteValues = (e) => {
    if (e.currentTarget.id === "row") {
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam ? { ...s, row: {} } : s
      );
      setSheets(tempSheets);
    }
    if (e.currentTarget.id === "col") {
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam ? { ...s, col: {} } : s
      );
      setSheets(tempSheets);
    }
    if (e.currentTarget.id === "groupby") {
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam ? { ...s, groupby: {} } : s
      );
      setSheets(tempSheets);
    }
    if (e.currentTarget.id === "text") {
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam ? { ...s, text: {} } : s
      );
      setSheets(tempSheets);
    }
    if (e.currentTarget.id === "sort") {
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam ? { ...s, sort: {} } : s
      );
      setSheets(tempSheets);
    }
  };

  useEffect(() => {
    setSelectedSheet(sheets.find((s) => s.name === sheetParam));
    // const sheet = sheets.find((s) => s.name === sheetParam);
    // console.log(sheet);
    // if (!isEmpty(sheet.workbooks)) {
    //   const wb = sheet.workbooks[0].workbook;
    //   setSelectedSheet((prev) => ({ ...prev, workbooks: sheet.workbooks }));
    //   setSelectedWB(wb);
    //   setSelectedWBSheet(Object.keys(wb)[0]);
    // } else {
    //   // setSelectedWB(null);
    //   // setSelectedWBSheet(null);
    // }
  }, [sheets, sheetParam, setSelectedSheet, setSelectedWB, setSelectedWBSheet]);

  //Sorting Fucntions <>
  function handleSorting(e) {
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? {
            ...s,
            sort: e.target.value,
          }
        : s
    );
    setSheets(tempSheets);
    if (e.target.value === "ascending") {
      setSortType("ascending");
      setSort("sort");
    } else {
      setSortType("descending");
      setSort("sort");
    }
    if (e.target.value === "null") {
      setSortType(null);
      setSort(null);
    }
  }

  // Sorting </>
  return (
    <>
      <Header />
      <div className="Second-line">
        <h3 onClick={homehandler}>Home</h3>
      </div>
      <hr></hr>
      <div className="third-line">
        <div className="field">
          <ImportExcel />
          {!isEmpty(selectedWB) && (
            <div className="fileName" style={{ display: "block" }}>
              {Object.keys(selectedWB).map((sheet, idx) => (
                <div key={idx}>
                  <input
                    type="checkBox"
                    checked={sheet === selectedWBSheet}
                    name="sheetName"
                    value={sheet}
                    onChange={handleSheetChange}
                  ></input>
                  <span
                    draggable
                    onDragStart={() => (dragItem.current = sheet)}
                  >
                    {sheet}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Scrollbars style={{ height: "300px" }}>
            <div
              className="display"
              style={{ height: "auto", fontSize: "15px" }}
            >
              {selectedWB && selectedWB[selectedWBSheet] && (
                <div>
                  {selectedWB[selectedWBSheet][0].map((column, idx) => (
                    <div
                      draggable
                      onDragStart={() => (dragItem.current = column)}
                    >
                      {column}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Scrollbars>
          <div className="all3Components">
            <Filter />
            <Condition />
            <select id="sort" onChange={handleSorting}>
              <option value="null">Sort</option>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
            {/* <Conditions /> */}
          </div>
          <Granularity drop={handleDrop} deleteValues={deleteValues} />
        </div>
        {/* <div className="filter"> */}
        {/* </div> */}
        <div className="graph">
          <div
            droppable
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            id="row"
          >
            Row : {selectedSheet?.row?.key}
            <FaTrash
              onClick={deleteValues}
              id="row"
              style={{ cursor: "pointer" }}
            />
          </div>
          <br></br>
          <hr style={{ width: "100%", background: "blue" }}></hr>
          <div
            droppable
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            id="col"
          >
            Column: {selectedSheet?.col?.key}
            <FaTrash
              onClick={deleteValues}
              id="col"
              style={{ cursor: "pointer" }}
            />
          </div>
          <br></br>
          <select className="selectGraph" onChange={selectGraph} id="graph">
            <option value="">Graph</option>
            <option value="line">Line-Graph</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie-Chart</option>
            <option value="donut">Donut Chart</option>
            <option value="box">Box-Chart</option>
            <option value="scatter">Scatter chart</option>
            <option value="scattermapbox">Map</option>
            <option value="scattergeo">Geo Map</option>

            <option value="table">Table</option>
          </select>
          <input
            value={sheetParam}
            className="sheetName"
            onChange={(e) => setSheetParam(e.target.value)}
          />
          <div
            id="wordCloud"
            style={{
              width: "540px",
              height: "360px",
              display: "none",
              border: " 1px solid black",
              fontColor: "10px",
            }}
          >
            <button
              onClick={wordCloud}
              style={{
                width: "70px",
                height: "30px",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              x
            </button>

            {/* <ReactWordcloud words={words} /> */}
          </div>
          <div id="plots">
            {selectedSheet?.graph && (
              <Plot
                data={[
                  selectedSheet.graph === "pie"
                    ? {
                        type: selectedSheet?.graph,
                        values: selectedSheet?.row?.values,
                        labels: selectedSheet?.col?.values,
                      }
                    : selectedSheet.graph === "donut"
                    ? {
                        type: "pie",
                        values: selectedSheet?.row?.values,
                        labels: selectedSheet?.col?.values,
                        hole: 0.4,
                      }
                    : selectedSheet.graph === "box"
                    ? {
                        type: selectedSheet?.graph,
                        x: selectedSheet?.col?.values,
                        y: selectedSheet?.row?.values,
                        transforms: [
                          {
                            type: "groupby",
                            groups: selectedSheet?.groupby?.values,
                          },
                          {
                            type: filterType,
                            target: "y",
                            operation: filterOperator,
                            value: filterValue,
                          },
                        ],
                      }
                    : selectedSheet.graph === "scatter"
                    ? {
                        type: selectedSheet?.graph,
                        x: selectedSheet?.col?.values,
                        y: selectedSheet?.row?.values,
                        mode: "markers", //only for the mode scatter has to be written in a diffrent object.
                        transforms: [
                          {
                            type: "aggregate",
                            aggregations: [
                              {
                                target: "y",
                                func: "Sum",
                              },
                            ],
                          },
                          {
                            type: filterType,
                            target: "y",
                            operation: filterOperator,
                            value: filterValue,
                          },

                          {
                            type: "groupby",
                            groups: selectedSheet?.groupby?.values,
                          },
                        ],
                      }
                    : selectedSheet.graph === "table"
                    ? {
                        type: selectedSheet?.graph,
                        columnorder: [1, 9],
                        columnwidth: [40, 40],
                        header: {
                          values: [
                            selectedSheet?.col?.key,
                            selectedSheet?.row?.key,
                          ],
                          align: "center",
                          font: { family: "Roboto", size: 15, color: "Black" },
                        },
                        cells: {
                          values: [
                            selectedSheet?.col?.values,
                            selectedSheet?.row?.values,
                          ],
                          height: 20,
                          font: { family: "Roboto", size: 13, color: "Black" },
                        },
                      }
                    : selectedSheet.graph === "scattermapbox"
                    ? {
                        type: selectedSheet?.graph,
                        lon: selectedSheet?.col?.values,
                        lat: selectedSheet?.row?.values,
                        mode: "markers",
                        marker: {
                          size: 12,
                        },
                        text: selectedSheet?.text?.values,
                        transforms: [
                          {
                            type: "groupby",
                            groups: selectedSheet?.groupby?.values,
                          },
                        ],
                      }
                    : selectedSheet.graph === "scattergeo"
                    ? {
                        type: selectedSheet?.graph,
                        lon: selectedSheet?.col?.values,
                        lat: selectedSheet?.row?.values,
                        locationmode: "USA-states",
                        mode: "markers",
                        marker: {
                          size: 12,
                        },
                        text: selectedSheet?.text?.values,
                        transforms: [
                          {
                            type: "groupby",
                            groups: selectedSheet?.groupby?.values,
                          },
                        ],
                      }
                    : {
                        type: selectedSheet?.graph,
                        x: selectedSheet?.col?.values,
                        y: selectedSheet?.row?.values,
                        barmode: "stack",
                        transforms: [
                          {
                            type: "aggregate",
                            aggregations: [
                              {
                                target: "y",
                                func: "sum",
                                enabled: true,
                              },
                            ],
                          },

                          {
                            type: filterType,
                            target: "y",
                            operation: filterOperator,
                            value: filterValue,
                          },
                          {
                            type: sort,
                            target: selectedSheet?.row?.values,
                            order: sortType,
                          },
                          {
                            type: "groupby",
                            groups: selectedSheet?.groupby?.values,
                          },
                        ],
                      },
                ]}
                layout={{
                  // autosize: false,
                  xaxis: { title: { text: selectedSheet?.col?.key } },
                  yaxis: { title: { text: selectedSheet?.row?.key } },
                  width: 840,
                  height: 440,
                  fontSize: 2,
                  mapbox: { style: "open-street-map" },
                  barmode: "relative",
                  hovermode: "closest",
                  geo: {
                    projection: {
                      type: "orthographic",
                      rotation: {
                        lon: -100,
                        lat: 40,
                      },
                    },
                    showocean: true,
                    oceancolor: "rgb(0, 255, 255)",
                    showland: true,
                    landcolor: "rgb(230, 145, 56)",
                    showlakes: true,
                    lakecolor: "rgb(0, 255, 255)",
                    showcountries: true,
                    lonaxis: {
                      showgrid: true,
                      gridcolor: "rgb(102, 102, 102)",
                    },
                    lataxis: {
                      showgrid: true,
                      gridcolor: "rgb(102, 102, 102)",
                    },
                  },

                  updatemenus: [
                    {
                      x: 0.85,
                      y: 1.05,
                      showactive: true,
                      buttons: [
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "sum"],
                          label: "Sum",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "avg"],
                          label: "Avg",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "min"],
                          label: "Min",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "max"],
                          label: "Max",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "mode"],
                          label: "Mode",
                        },
                        {
                          method: "restyle",
                          args: [
                            "transforms[0].aggregations[0].func",
                            "median",
                          ],
                          label: "Median",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "count"],
                          label: "Count",
                        },
                        {
                          method: "restyle",
                          args: [
                            "transforms[0].aggregations[0].func",
                            "stddev",
                          ],
                          label: "Std.Dev",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "first"],
                          label: "First",
                        },
                        {
                          method: "restyle",
                          args: ["transforms[0].aggregations[0].func", "last"],
                          label: "Last",
                        },
                      ],
                    },
                  ],
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* Renaming sheet Box */}
      <Menu showMenu={showMenu} />
      <Footer />
    </>
  );
};

export default Sheet;
