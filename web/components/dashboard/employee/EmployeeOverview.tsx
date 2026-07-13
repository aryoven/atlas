import type { Employee } from "@/lib/types/employee";
import { formatEmployeeDateTime } from "@/lib/utils/employee";

type EmployeeOverviewProps = {
  employee: Employee;
};

export default function EmployeeOverview({ employee }: EmployeeOverviewProps) {
  const fields = [
    { label: "Name", value: employee.name },
    { label: "Role", value: employee.role },
    { label: "Model", value: employee.model },
    { label: "Temperature", value: String(employee.temperature) },
    {
      label: "Created",
      value: formatEmployeeDateTime(employee.created_at),
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-lg font-semibold text-white">Overview</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-xl border border-white/5 bg-background/40 p-4"
          >
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              {field.label}
            </dt>
            <dd
              className={`mt-2 text-sm font-medium text-white${
                field.label === "Role" ? " capitalize" : ""
              }`}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
