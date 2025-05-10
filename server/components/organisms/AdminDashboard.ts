// deno-fmt-ignore-file
import {
DashboardCard,
  type ComponentType,
  type OrganismNameType,
  type DashboardDataType,
 } from "../mod.ts";

 export const AdminDashboard: ComponentType<
  OrganismNameType,
  (arg: DashboardDataType) => string
> = {
  name: "AdminDashboard",
  html: ({
    title,
    analytics,
    users,
    products,
    bookings,
  }: DashboardDataType,
  ) => {
    return `
    <div>
      <h1>${title}</h1>
    </div>
    <div class="admin-dashboard">
      <div class="card">
        ${DashboardCard.html(analytics)}
      </div>
      <div class="card">
        ${DashboardCard.html(users)}
      </div>
      <div class="card">
        ${DashboardCard.html(products)}
      </div>
      <div class="card">
        ${DashboardCard.html(bookings)}
      </div>
    </div>
    `;
  }
}