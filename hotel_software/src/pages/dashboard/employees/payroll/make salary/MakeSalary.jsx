import { useParams, Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";

const MakeSalary = () => {
  const { employeeId } = useParams();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      deductionPercent: 0,
      absentCut: 0,
      includeFestivalBonus: false,
    },
  });

  // Watch fields for live calculation
  const includeFestivalBonus = watch("includeFestivalBonus");
  const deductionPercent = Number(watch("deductionPercent") || 0);
  const absentCut = Number(watch("absentCut") || 0);
  const month = watch("month");
  const year = watch("year");

  // Fetch employee
  const { data: employee, isLoading: empLoading } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/employees/${employeeId}`);
      return res.data;
    },
    enabled: !!employeeId,
  });

  // Fetch salary structure of this employee
  const { data: structures = [], isLoading: structureLoading } = useQuery({
    queryKey: ["salary-structure", employeeId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/salary-structures/employee/${employeeId}`,
      );
      return res.data;
    },
    enabled: !!employeeId,
  });

  // Latest structure
  const structure = structures[0] || null;

  const isLoading = empLoading || structureLoading;

  // Calculations
  const basic = structure?.basicSalary || 0;
  const hra = structure?.hra || 0;
  const medical = structure?.medicalAllowance || 0;
  const academic = structure?.academicAllowance || 0;
  const transport = structure?.transportAllowance || 0;
  const festivalBonus = structure?.festivalBonus || 0;

  const festivalThisMonth = includeFestivalBonus ? festivalBonus : 0;

  const grossPay =
    basic + hra + medical + academic + transport + festivalThisMonth;

  const deductionAmount = (grossPay * deductionPercent) / 100;
  const netPay = grossPay - deductionAmount - absentCut;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const onSubmit = async (data) => {
    if (!structure) {
      Swal.fire({
        icon: "error",
        title: "No Salary Structure",
        text: "Please assign a salary structure first.",
      });
      return;
    }

    const payrollData = {
      employeeId: employeeId,
      employeeName: employee?.FullName || structure.employeeName,
      employeeID: employee?.EmployeeID || structure.employeeID,
      designation: employee?.Designation || structure.designation,
      department: employee?.Department || structure.department,

      salaryStructureId: structure._id,

      month: Number(data.month),
      year: Number(data.year),
      periodLabel: `${monthNames[Number(data.month) - 1]} ${data.year}`,

      basicSalary: basic,
      hra: hra,
      medicalAllowance: medical,
      academicAllowance: academic,
      transportAllowance: transport,
      festivalBonus: festivalThisMonth,

      grossPay: grossPay,
      deductionPercent: deductionPercent,
      deductionAmount: deductionAmount,
      absentCut: absentCut,
      netPay: netPay,

      paymentStatus: "Paid",
      paidAt: new Date(),
    };

    try {
      const res = await axiosInstance.post("/payrolls", payrollData);

      if (res.data.insertedId) {
        await Swal.fire({
          title: "Success!",
          text: "Salary generated successfully.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
        navigate("/dashboard/employees/current_employees");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not generate salary. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <FaMoneyCheckAlt className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">Make Salary</h1>
          </div>
          <p className="text-gray-500 ml-12">
            Generate monthly salary for this staff member.
          </p>
        </div>

        <Link to="/dashboard/employees">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {!structure ? (
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
          <p className="text-red-500 font-medium text-lg">
            No salary structure found for this employee.
          </p>
          <p className="text-gray-500 mt-2">
            Please assign a salary structure first.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-2xl p-8"
        >
          {/* Employee Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="label">
                <span className="label-text font-medium">Employee Name</span>
              </label>
              <input
                type="text"
                value={employee?.FullName || structure.employeeName || ""}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Designation</span>
              </label>
              <input
                type="text"
                value={employee?.Designation || structure.designation || ""}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Department</span>
              </label>
              <input
                type="text"
                value={employee?.Department || structure.department || ""}
                readOnly
                className="input input-bordered w-full bg-gray-100"
              />
            </div>
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="label">
                <span className="label-text font-medium">Month</span>
              </label>
              <select
                {...register("month", { required: true })}
                className="select select-bordered w-full bg-white"
              >
                {monthNames.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Year</span>
              </label>
              <input
                type="number"
                {...register("year", { required: true })}
                className="input input-bordered w-full bg-white"
              />
            </div>
          </div>

          {/* Salary Components (Read only) */}
          <h3 className="text-base font-semibold text-rose-700 mb-4">
            Salary Components
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Basic Salary</p>
              <p className="font-bold text-lg">৳{basic.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">HRA</p>
              <p className="font-bold text-lg">৳{hra.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Medical</p>
              <p className="font-bold text-lg">৳{medical.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Academic</p>
              <p className="font-bold text-lg">৳{academic.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Transport</p>
              <p className="font-bold text-lg">৳{transport.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Festival Bonus (Structure)
              </p>
              <p className="font-bold text-lg">
                ৳{festivalBonus.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Festival Bonus Checkbox */}
          <div className="mb-8 p-5 border border-rose-200 rounded-xl bg-rose-50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("includeFestivalBonus")}
                className="checkbox checkbox-error"
              />
              <div>
                <p className="font-semibold text-rose-800">
                  Include Festival Bonus this month?
                </p>
                <p className="text-sm text-gray-500">
                  If checked, ৳{festivalBonus.toLocaleString()} will be added.
                  If unchecked, festival bonus will be ৳0.
                </p>
              </div>
            </label>
          </div>

          {/* Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Deduction Percentage (%)
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                {...register("deductionPercent")}
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Absent Cut (৳)</span>
              </label>
              <input
                type="number"
                min="0"
                {...register("absentCut")}
                className="input input-bordered w-full bg-white"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="p-5 bg-rose-50 rounded-xl mb-8 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Pay</span>
              <span className="font-semibold">
                ৳{grossPay.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Festival Bonus ({includeFestivalBonus ? "Included" : "Excluded"}
                )
              </span>
              <span className="font-semibold">
                ৳{festivalThisMonth.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Deduction ({deductionPercent}%)
              </span>
              <span className="font-semibold text-red-600">
                - ৳{deductionAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Absent Cut</span>
              <span className="font-semibold text-red-600">
                - ৳{absentCut.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-rose-200 pt-3 flex justify-between">
              <span className="font-bold text-rose-800 text-lg">Net Pay</span>
              <span className="font-bold text-green-600 text-2xl">
                ৳{netPay.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Period: {monthNames[Number(month) - 1]} {year}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Link to="/dashboard/payroll">
              <button
                type="button"
                className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
            >
              Confirm & Generate Salary
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MakeSalary;
