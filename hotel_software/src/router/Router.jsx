import { createBrowserRouter } from "react-router";
import Login from "../pages/login/Login";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../pages/signup/Signup";
import Root from "../pages/dashboard/root/Root";
import DashboardLayout from "../layouts/DashboardLayout";
import Rooms from "../pages/dashboard/rooms/Rooms";
import Services from "../pages/dashboard/services/Services";
import Billing_and_Payments from "../pages/dashboard/billing_and_payments/Billing_and_Payments";
import Check_in_Out from "../pages/dashboard/check_in_out/Check_in_Out";
import Employees from "../pages/dashboard/employees/Employees";
import Guests from "../pages/dashboard/guests/Guests";
import Reservations from "../pages/dashboard/reservations/Reservations";
import Settings from "../pages/dashboard/settings/Settings";
import RoomService from "../pages/dashboard/services/room_service/RoomService";
import RestaurantOrders from "../pages/dashboard/services/restaurant_orders/RestaurantOrders";
import LaundryService from "../pages/dashboard/services/laundry_service/LaundryService";
import TransportService from "../pages/dashboard/services/transport_service/TransportService";
import CheckIn from "../pages/dashboard/check_in_out/check_in/CheckIn";
import CheckOut from "../pages/dashboard/check_in_out/check_out/CheckOut";
import AddEmployee from "../pages/dashboard/employees/add_employee/AddEmployee";
import CurrentEmployees from "../pages/dashboard/employees/current_employees/CurrentEmployees";
import EditEmployee from "../pages/dashboard/employees/edit_employee_info/EditEmployee";
import PastEmployees from "../pages/dashboard/employees/past_employees/PastEmployees";
import Payroll from "../pages/dashboard/employees/payroll/Payroll";
import Maintenance from "../pages/dashboard/rooms/maintenance/Maintenance";
import EditMaintenance from "../pages/dashboard/rooms/maintenance/edit_maintenance/EditMaintenance";
import MaintenanceHistory from "../pages/dashboard/rooms/maintenance/maintenance_history/MaintenanceHistory";
import EditMaintenanceHistory from "../pages/dashboard/rooms/maintenance/edit_maintenance_history/EditMaintenanceHistory";
import AddRoomVariant from "../pages/dashboard/rooms/add_room_variant/AddRoomVariant";
import RoomOverview from "../pages/dashboard/rooms/room_overview/RoomOverview";
import EditRoomVariant from "../pages/dashboard/rooms/room_overview/edit_room_variant/EditRoomVariant";
import AddRoom from "../pages/dashboard/rooms/room_overview/add_room/AddRoom";
import ViewRooms from "../pages/dashboard/rooms/room_status/ViewRooms";
import RoomStatus from "../pages/dashboard/rooms/room_status/RoomStatus";
import PresentGuestList from "../pages/dashboard/guests/present_guest_list/PresentGuestList";
import EditGuestInfo from "../pages/dashboard/guests/present_guest_list/edit_guest_info/EditGuestInfo";
import BlackListedGuests from "../pages/dashboard/guests/black_listed_guests/BlackListedGuests";
import FoodMenu from "../pages/dashboard/services/restaurant_orders/food_menu/FoodMenu";
import RoomServiceHistory from "../pages/dashboard/services/room_service/RoomServiceHistory";
import RestaurantOrdersHistory from "../pages/dashboard/services/restaurant_orders/RestaurantOrdersHistory";
import LaundryServiceHistory from "../pages/dashboard/services/laundry_service/LaundryServiceHistory";
import TransportServiceHistory from "../pages/dashboard/services/transport_service/TransportServiceHistory";
import EditRestaurantHistory from "../pages/dashboard/services/restaurant_orders/edit_restaurant_history/EditRestaurantHistory";
import RestaurantInvoice from "../pages/dashboard/services/restaurant_orders/restaurant_invoice/RestaurantInvoice";
import Dues from "../pages/dashboard/billing_and_payments/dues/Dues";
import ReservationsHistory from "../pages/dashboard/reservations/ReservationsHistory";
import AssignNewSalaryStructure from "../pages/dashboard/employees/payroll/assign-new-salary-structure/AssignNewSalaryStructure";
import PayrollHistory from "../pages/dashboard/employees/payroll/payroll-history/PayrollHistory";
import MakeSalary from "../pages/dashboard/employees/payroll/make salary/MakeSalary";
import Hotels from "../pages/dashboard/settings/hotels/Hotels";
import Reports from "../pages/dashboard/reports/Reports";
import SalesReport from "../pages/dashboard/reports/sales_report/SalesReport";
import RoomReport from "../pages/dashboard/reports/room_report/RoomReport";
import TransportationSales from "../pages/dashboard/reports/sales_report/transportation_sales/TransportationSales";
import RestaurantSales from "../pages/dashboard/reports/sales_report/restaurant_sales/RestaurantSales";
import LaundrySales from "../pages/dashboard/reports/sales_report/laundry_sales/LaundrySales";
import SalaryReport from "../pages/dashboard/reports/salary_report/SalaryReport";
import ExpenseReport from "../pages/dashboard/reports/expense_report/ExpenseReport";
import EntryReport from "../pages/dashboard/reports/expense_report/entry_report/EntryReport";
import ExpenseOverview from "../pages/dashboard/reports/expense_report/expense_overview/ExpenseOverview";
import MainCheckout from "../pages/dashboard/check_in_out/check_out/main_checkout/MainCheckout";
import PaymentHistory from "../pages/dashboard/billing_and_payments/payment_history/PaymentHistory";
import CheckoutDetails from "../pages/dashboard/billing_and_payments/payment_history/CheckoutDetails";
import GuestHistory from "../pages/dashboard/guests/guest_history/GuestHistory";
import Refunds from "../pages/dashboard/billing_and_payments/refunds/Refunds";
import HotelInformation from "../pages/dashboard/settings/hotel_information/HotelInformation";
import Security from "../pages/dashboard/settings/security/Security";
import UnderPreview from "../pages/error_pages/UnderPreview";
import UnderDue from "../pages/error_pages/UnderDue";
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
const Router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "signup",
        Component: Signup,
      },
      { path: "under_preview", Component: UnderPreview },
      { path: "under_due", Component: UnderDue },
    ],
  },

  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      // Protected routes
      {
        index: true,
        element: (
          <PrivateRoute>
            <Root />
          </PrivateRoute>
        ),
      },
      {
        path: "billing_and_payments",
        element: (
          <PrivateRoute>
            <Billing_and_Payments />
          </PrivateRoute>
        ),
      },
      {
        path: "billing_and_payments/dues",
        element: (
          <PrivateRoute>
            <Dues />
          </PrivateRoute>
        ),
      },
      {
        path: "billing_and_payments/refunds",
        element: (
          <PrivateRoute>
            <Refunds />
          </PrivateRoute>
        ),
      },
      {
        path: "billing_and_payments/payment_history",
        element: (
          <PrivateRoute>
            <PaymentHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "billing_and_payments/checkout_details/:id",
        element: (
          <PrivateRoute>
            <CheckoutDetails />
          </PrivateRoute>
        ),
      },

      // Rooms
      {
        path: "rooms",
        element: (
          <PrivateRoute>
            <Rooms />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/add_room_variant",
        element: (
          <PrivateRoute>
            <AddRoomVariant />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/room_status",
        element: (
          <PrivateRoute>
            <RoomStatus />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/room_overview",
        element: (
          <PrivateRoute>
            <RoomOverview />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/edit_room_variant/:id",
        element: (
          <PrivateRoute>
            <EditRoomVariant />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/add_room/:id",
        element: (
          <PrivateRoute>
            <AddRoom />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/maintenance",
        element: (
          <PrivateRoute>
            <Maintenance />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/edit_maintenance/:id",
        element: (
          <PrivateRoute>
            <EditMaintenance />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/maintenance_history",
        element: (
          <PrivateRoute>
            <MaintenanceHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/view_rooms/:id",
        element: (
          <PrivateRoute>
            <ViewRooms />
          </PrivateRoute>
        ),
      },
      {
        path: "rooms/edit_maintenance_history/:id",
        element: (
          <PrivateRoute>
            <EditMaintenanceHistory />
          </PrivateRoute>
        ),
      },

      // Services
      {
        path: "services",
        element: (
          <PrivateRoute>
            <Services />
          </PrivateRoute>
        ),
      },
      {
        path: "services/room_service",
        element: (
          <PrivateRoute>
            <RoomService />
          </PrivateRoute>
        ),
      },
      {
        path: "services/room_service/room_service_history",
        element: (
          <PrivateRoute>
            <RoomServiceHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "services/restaurant_orders",
        element: (
          <PrivateRoute>
            <RestaurantOrders />
          </PrivateRoute>
        ),
      },
      {
        path: "services/restaurant_orders/restaurant_orders_history",
        element: (
          <PrivateRoute>
            <RestaurantOrdersHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "services/restaurant_orders/edit_restaurant_history/:id",
        element: (
          <PrivateRoute>
            <EditRestaurantHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "services/restaurant_orders/invoice/:id",
        element: (
          <PrivateRoute>
            <RestaurantInvoice />
          </PrivateRoute>
        ),
      },
      {
        path: "services/restaurant_orders/food_menu",
        element: (
          <PrivateRoute>
            <FoodMenu />
          </PrivateRoute>
        ),
      },
      {
        path: "services/laundry_service",
        element: (
          <PrivateRoute>
            <LaundryService />
          </PrivateRoute>
        ),
      },
      {
        path: "services/laundry_service/laundry_service_history",
        element: (
          <PrivateRoute>
            <LaundryServiceHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "services/transport_service",
        element: (
          <PrivateRoute>
            <TransportService />
          </PrivateRoute>
        ),
      },
      {
        path: "services/transport_service/transport_service_history",
        element: (
          <PrivateRoute>
            <TransportServiceHistory />
          </PrivateRoute>
        ),
      },

      // Check In / Out
      {
        path: "check_in_out",
        element: (
          <PrivateRoute>
            <Check_in_Out />
          </PrivateRoute>
        ),
      },
      {
        path: "check_in_out/check_in",
        element: (
          <PrivateRoute>
            <CheckIn />
          </PrivateRoute>
        ),
      },
      {
        path: "check_in_out/check_out",
        element: (
          <PrivateRoute>
            <CheckOut />
          </PrivateRoute>
        ),
      },
      {
        path: "check_in_out/check_out/:id",
        element: (
          <PrivateRoute>
            <MainCheckout />
          </PrivateRoute>
        ),
      },

      // Employees
      {
        path: "employees",
        element: (
          <PrivateRoute>
            <Employees />
          </PrivateRoute>
        ),
      },
      {
        path: "employees/add_employee",
        element: (
          <PrivateRoute>
            <AddEmployee />
          </PrivateRoute>
        ),
      },
      {
        path: "employees/current_employees",
        element: (
          <PrivateRoute>
            <CurrentEmployees />
          </PrivateRoute>
        ),
      },
      {
        path: "employees/past_employees",
        element: (
          <PrivateRoute>
            <PastEmployees />
          </PrivateRoute>
        ),
      },
      {
        path: "employees/payroll",
        element: (
          <PrivateRoute>
            <Payroll />
          </PrivateRoute>
        ),
      },
      {
        path: "employees/payroll/assign-new-salary-structure",
        element: (
          <PrivateRoute>
            <AssignNewSalaryStructure />
          </PrivateRoute>
        ),
      },
      {
        path: "employees/payroll/payroll-history",
        element: (
          <PrivateRoute>
            <PayrollHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "payroll/make-salary/:employeeId",
        element: (
          <PrivateRoute>
            <MakeSalary />
          </PrivateRoute>
        ),
      },
      {
        path: "employees/edit/:id",
        element: (
          <PrivateRoute>
            <EditEmployee />
          </PrivateRoute>
        ),
      },

      // Guests
      {
        path: "guests",
        element: (
          <PrivateRoute>
            <Guests />
          </PrivateRoute>
        ),
      },
      {
        path: "guests/present_guest_list",
        element: (
          <PrivateRoute>
            <PresentGuestList />
          </PrivateRoute>
        ),
      },
      {
        path: "guests/guest_history",
        element: (
          <PrivateRoute>
            <GuestHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "guests/edit_guest_info/:id",
        element: (
          <PrivateRoute>
            <EditGuestInfo />
          </PrivateRoute>
        ),
      },
      {
        path: "guests/black_listed_guests",
        element: (
          <PrivateRoute>
            <BlackListedGuests />
          </PrivateRoute>
        ),
      },

      // Reservations
      {
        path: "reservations",
        element: (
          <PrivateRoute>
            <Reservations />
          </PrivateRoute>
        ),
      },
      {
        path: "reservations/reservation_history",
        element: (
          <PrivateRoute>
            <ReservationsHistory />
          </PrivateRoute>
        ),
      },

      // Reports
      {
        path: "reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/sales_report",
        element: (
          <PrivateRoute>
            <SalesReport />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/sales_report/transportation_sales",
        element: (
          <PrivateRoute>
            <TransportationSales />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/sales_report/restaurant_sales",
        element: (
          <PrivateRoute>
            <RestaurantSales />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/sales_report/laundry_sales",
        element: (
          <PrivateRoute>
            <LaundrySales />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/room_report",
        element: (
          <PrivateRoute>
            <RoomReport />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/salary_report",
        element: (
          <PrivateRoute>
            <SalaryReport />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/expense_report",
        element: (
          <PrivateRoute>
            <ExpenseReport />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/expenses/entry-report",
        element: (
          <PrivateRoute>
            <EntryReport />
          </PrivateRoute>
        ),
      },
      {
        path: "reports/expenses/expense_overview",
        element: (
          <PrivateRoute>
            <ExpenseOverview />
          </PrivateRoute>
        ),
      },

      // Settings
      {
        path: "settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "settings/hotels",
        element: (
          <AdminRoute>
            <Hotels />
          </AdminRoute>
        ),
      },
      {
        path: "settings/hotel_information",
        element: (
          <PrivateRoute>
            <HotelInformation />
          </PrivateRoute>
        ),
      },
      {
        path: "settings/security",
        element: (
          <PrivateRoute>
            <Security />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default Router;
