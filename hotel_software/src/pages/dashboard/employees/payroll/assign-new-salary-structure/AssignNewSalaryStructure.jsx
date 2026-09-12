import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const AssignNewSalaryStructure = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      basicSalary: 0,
      hra: 0,
      medicalAllowance: 0,
      academicAllowance: 0,
      transportAllowance: 0,
      festivalBonus: 0,
      effectiveDate: new Date().toISOString().split("T")[0],
    },
  });

  // Watch all salary fields for live calculation
  const basicSalary = Number(watch("basicSalary") || 0);
  const hra = Number(watch("hra") || 0);
  const medicalAllowance = Number(watch("medicalAllowance") || 0);
  const academicAllowance = Number(watch("academicAllowance") || 0);
  const transportAllowance = Number(watch("transportAllowance") || 0);
  const festivalBonus = Number(watch("festivalBonus") || 0);

  const grossPay =
    basicSalary +
    hra +
    medicalAllowance +
    academicAllowance +
    transportAllowance +
    festivalBonus;

  // Fetch active employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees-active"],
    queryFn: async () => {
      const res = await axiosInstance.get("/employees/active");
      return res.data;
    },
  });

  const selectedEmployeeId = watch("employeeId");
  const selectedEmployee = employees.find(
    (emp) => emp._id === selectedEmployeeId,
  );

  const onSubmit = async (data) => {
    const salaryData = {
      employeeId: data.employeeId,
      employeeName: selectedEmployee?.FullName || "",
      employeeID: selectedEmployee?.EmployeeID || "",
      designation: selectedEmployee?.Designation || "",
      department: selectedEmployee?.Department || "",
      effectiveDate: data.effectiveDate,
      basicSalary: Number(data.basicSalary),
      hra: Number(data.hra),
      medicalAllowance: Number(data.medicalAllowance),
      academicAllowance: Number(data.academicAllowance),
      transportAllowance: Number(data.transportAllowance),
      festivalBonus: Number(data.festivalBonus),
      grossMonthlyPay: grossPay,
    };

    try {
      const res = await axiosInstance.post("/salary-structures", salaryData);

      if (res.data.insertedId) {
        await Swal.fire({
          title: "Success!",
          text: "Salary structure assigned successfully.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
        navigate("/dashboard/employees/payroll");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not save salary structure. Please try again.",
      });
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <FaMoneyCheckAlt className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">
              Assign New Salary Structure
            </h1>
          </div>
          <p className="text-gray-500 ml-12">
            Create and assign salary structure for staff members.
          </p>
        </div>

        <Link to="/dashboard/employees/payroll">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <IoArrowBackCircleSharp className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Select Staff Member */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Select Staff Member
              </span>
            </label>
            <select
              {...register("employeeId", {
                required: "Please select a staff member",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
              disabled={isLoading}
            >
              <option value="" disabled>
                {isLoading ? "Loading staff..." : "-- Select a Staff Member --"}
              </option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.FullName} ({emp.EmployeeID})
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          {/* Designation (Role) */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Designation (Role)</span>
            </label>
            <input
              type="text"
              value={selectedEmployee?.Designation || "N/A"}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Effective Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Effective Date</span>
            </label>
            <input
              type="date"
              {...register("effectiveDate", {
                required: "Effective date is required",
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.effectiveDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.effectiveDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Salary Components */}
        <h3 className="text-base font-semibold text-rose-700 mb-4">
          Salary Components (Enter Round Amounts)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Salary */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Basic Salary <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="number"
              min="0"
              {...register("basicSalary", {
                required: "Basic salary is required",
                min: { value: 0, message: "Cannot be negative" },
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.basicSalary && (
              <p className="text-red-500 text-sm mt-1">
                {errors.basicSalary.message}
              </p>
            )}
          </div>

          {/* HRA */}
          <div>
            <label className="label">
              <span className="label-text font-medium">HRA (House Rent)</span>
            </label>
            <input
              type="number"
              min="0"
              {...register("hra")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Medical Allowance */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Medical Allowance</span>
            </label>
            <input
              type="number"
              min="0"
              {...register("medicalAllowance")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Academic Allowance */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Academic Allowance</span>
            </label>
            <input
              type="number"
              min="0"
              {...register("academicAllowance")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Transport Allowance */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Transport Allowance
              </span>
            </label>
            <input
              type="number"
              min="0"
              {...register("transportAllowance")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Festival Bonus */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Festival Bonus</span>
            </label>
            <input
              type="number"
              min="0"
              {...register("festivalBonus")}
              className="input input-bordered w-full bg-white"
            />
          </div>
        </div>

        {/* Estimated Gross Pay */}
        <div className="mt-8 p-5 bg-rose-50 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-semibold text-rose-800">
              Estimated Gross Monthly Pay:
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This is the sum of all components and does not include any
              deductions or taxes.
            </p>
          </div>
          <p className="text-2xl font-bold text-green-600">
            BDT {grossPay.toLocaleString()}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset Form
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Confirm & Save Salary
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignNewSalaryStructure;
