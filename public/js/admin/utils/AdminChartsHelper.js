import { PageBuilder } from "../../pages/Builder.js";
import { setLoadingAction } from "../../utils/_commonFunctions.js";
import * as Types from "../../types/types.js";

export class AdminChartsHelper {
  static #builder = new PageBuilder();

  /**
   * @param {Types.Users} users
   * @param {Types.Bookings} bookings
   */
  static setCharts = ({
    users,
    bookings,
  }) => {
    const container = document.querySelector(".analytics-details");

    if (globalThis.ApexCharts && container) {
      if (container.children.length > 0) {
        container.innerHTML = "";
      }

      const [
        usersCard,
        bookingsCard,
      ] = AdminChartsHelper.#builder.createHTMLElements("div", "div");

      AdminChartsHelper.#builder.insertChildren(
        container,
        usersCard,
        bookingsCard,
      );

      const {
        chartData: usersData,
        chartCategories: usersCategories,
      } = AdminChartsHelper.#filter(users, (data, user) => {
        if (user.role === "user") {
          let numberOfBooking = 0;

          for (const key of Object.keys(bookings)) {
            for (const booking of bookings[key]["bookings"]) {
              if (booking.userId === user._id) numberOfBooking++;
            }
          }

          data.chartData.push(numberOfBooking);
          data.chartCategories.push(user.firstname);
        }
      });

      const {
        chartData: bookingsData,
        chartCategories: bookingsCategories,
      } = AdminChartsHelper.#filter(bookings, (data, booking) => {
        data.chartData.push(booking.bookings.length);
        data.chartCategories.push(booking.productName);
      });

      AdminChartsHelper.#buildChart({
        data: usersData,
        name: "Réservations",
        title: "Utilisateurs",
        categories: usersCategories,
        element: usersCard,
        fillType: "gradient",
      });

      AdminChartsHelper.#buildChart({
        data: bookingsData,
        name: "Réservations",
        title: "Réservations",
        categories: bookingsCategories,
        element: bookingsCard,
        chartType: "bar",
      });

      container.classList.add("expanded");
      setLoadingAction("false");
    }
  };

  /**
   * @param {Types.Users | Types.Bookings} sources
   * @param {Types.FilterFunctionType} fn
   */
  static #filter = (sources, fn) => {
    /** @type {Types.ChartDataType} */
    const data = {
      chartData: [],
      chartCategories: [],
    };

    for (const key of Object.keys(sources)) {
      fn(data, sources[key]);
    }

    return data;
  };

  /**
   * @param {Types.ChartBuildType}
   */
  static #buildChart = ({
    element,
    name,
    categories,
    title,
    data,
    chartType = "area",
    fillType = "solid",
  }) => {
    const opts = {
      chart: {
        type: chartType,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "straight",
        width: 0,
      },
      series: [{
        name,
        data,
      }],
      title: {
        text: title,
        align: "left",
        margin: 20,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "20px",
          fontWeight: "700",
          fontFamily: "'Jost', sans-serif",
          color: "var(--primary-color)",
        },
      },
      fill: {
        type: fillType,
      },
      xaxis: {
        categories,
      },
    };

    const chart = new ApexCharts(
      element,
      opts,
    );

    chart.render();
  };
}
