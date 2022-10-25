import React, { useContext, useRef } from "react";
import Plot from "react-plotly.js";
import { useParams } from "react-router-dom";
import { GlobalContext } from "./GlobalProvider";
import Footer from "./Footer";
import Header from "./Header";
import Filter from "./Filter";
import ImportExcel from "./ImportExcel";
//Second commit
const Dashboard = () => {
  const dragItem = useRef();
  const {
    sheets,
    dashboards,
    setDashboards,
    sort,
    sortType,
    filterType,
    filterOperator,
    filterValue,
  } = useContext(GlobalContext);

  const dashboardParam = useParams().dashboard;

  const handleDrop = (index) => {
    const dragSheet = dragItem.current;
    const updatedDashboard = dashboards.find(
      (dashboard) => dashboard.name === dashboardParam
    );
    updatedDashboard.graphs[index] = dragSheet;
    const tempDashboards = dashboards.map((dashboard) =>
      dashboard.name === dashboardParam ? updatedDashboard : dashboard
    );
    setDashboards(tempDashboards);
  };
  function handlesheet() {}

  return (
    <>
      <Header />
      <div
        className="Dashboard"
        style={{ border: "5px solid blue", height: "88vh" }}
      >
        <div className="Sheets">
          <Filter />

          <p style={{ fontSize: "18px", padding: "8px", textAlign: "center" }}>
            Sheets
          </p>
          <hr></hr>
          <br></br>
          {sheets.map((sheet, index) => (
            <p
              key={index}
              className="sheetName"
              style={{
                width: "auto",
                height: "30px",
                padding: "5px",
                margin: "3px",
                background: "#5d6d7e",

                color: "white",
              }}
              draggable
              onDragStart={() => (dragItem.current = sheet)}
            >
              {sheet.name}
            </p>
          ))}
        </div>

        <div className="AllSheets">
          {dashboards
            .find((dashboard) => dashboard.name === dashboardParam)
            .graphs.map((sheet, index) => (
              <div
                droppable
                onDrop={() => handleDrop(index)}
                onDragOver={(e) => e.preventDefault()}
                className="graphDrop"
                style={{
                  border: "1px solid black",
                  width: "450px",
                  height: "323px",
                }}
              >
                <Plot
                  data={[
                    sheet.graph === "pie"
                      ? {
                          type: sheet?.graph,
                          values: sheet?.row?.values,
                          labels: sheet?.col?.values,
                        }
                      : sheet.graph === "donut"
                      ? {
                          type: "pie",
                          values: sheet?.row?.values,
                          labels: sheet?.col?.values,
                          hole: 0.4,
                        }
                      : sheet.graph === "box"
                      ? {
                          type: sheet?.graph,
                          x: sheet?.col?.values,
                          y: sheet?.row?.values,
                          transforms: [
                            {
                              type: "groupby",
                              groups: sheet?.groupby?.values,
                            },
                            {
                              type: filterType,
                              target: "y",
                              operation: filterOperator,
                              value: filterValue,
                            },
                          ],
                        }
                      : sheet.graph === "scatter"
                      ? {
                          type: sheet?.graph,
                          x: sheet?.col?.values,
                          y: sheet?.row?.values,
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
                              type: sort,
                              target: "y",
                              order: sortType,
                            },
                            {
                              type: "groupby",
                              groups: sheet?.groupby?.values,
                            },
                          ],
                        }
                      : sheet.graph === "table"
                      ? {
                          type: sheet?.graph,
                          header: {
                            values: [sheet?.col?.key, sheet?.row?.key],
                            align: "center",
                            font: {
                              family: "Roboto",
                              size: 15,
                              color: "Black",
                            },
                          },
                          cells: {
                            values: [sheet?.col?.values, sheet?.row?.values],
                            height: 20,
                            font: {
                              family: "Roboto",
                              size: 13,
                              color: "Black",
                            },
                          },
                        }
                      : {
                          type: sheet?.graph,
                          x: sheet?.col?.values,
                          y: sheet?.row?.values,
                          barmode: "stack",
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
                              type: sort,
                              target: "y",
                              order: sheet?.sort,
                            },
                            {
                              type: "groupby",
                              groups: sheet?.groupby?.values,
                            },
                          ],
                        },
                  ]}
                  layout={{
                    xaxis: { title: { text: sheet?.col?.key } },
                    yaxis: { title: { text: sheet?.row?.key } },
                    width: 400,
                    height: 300,
                    title: sheet.name,
                    barmode: "relative",
                  }}
                />
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Dashboard;
