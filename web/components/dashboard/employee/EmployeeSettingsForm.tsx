"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { updateEmployee, deleteEmployee } from "@/app/actions/employees";
import {
  updateEmployeeSchema,
  type UpdateEmployeeInput,
} from "@/lib/validations/employee";
import type { Employee, EmployeeModel } from "@/lib/types/employee";
import EmployeeFormFields from "@/components/dashboard/EmployeeFormFields";
import Button from "@/components/ui/Button";
import DeleteEmployeeDialog from "@/components/dashboard/employee/DeleteEmployeeDialog";

type EmployeeSettingsFormProps = {
  employee: Employee;
};

export default function EmployeeSettingsForm({
  employee,
}: EmployeeSettingsFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateEmployeeInput>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      name: employee.name,
      role: employee.role,
      instructions: employee.instructions,
      model: (["OpenRouter Free"] as const).includes(
        employee.model as "OpenRouter Free"
      )
        ? (employee.model as EmployeeModel)
        : "OpenRouter Free",
      temperature: employee.temperature,
    },
  });

  const onSubmit = async (values: UpdateEmployeeInput) => {
    setServerError(null);
    setSuccess(false);

    const result = await updateEmployee(employee.id, values);

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    setSuccess(true);
    router.refresh();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setServerError(null);

    const result = await deleteEmployee(employee.id);

    if (result?.error) {
      setServerError(result.error);
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <h2 className="mb-6 text-lg font-semibold text-white">Settings</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <EmployeeFormFields
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            idPrefix="settings"
          />

          {serverError && (
            <p
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
              role="alert"
            >
              {serverError}
            </p>
          )}

          {success && (
            <p
              className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-400"
              role="status"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Changes saved successfully.
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="text-sm font-semibold text-white">Danger Zone</h3>
        <p className="mt-2 text-sm text-muted">
          Permanently delete this AI Employee and all associated data. This
          action cannot be undone.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete Employee
        </Button>
      </div>

      <DeleteEmployeeDialog
        open={deleteOpen}
        employeeName={employee.name}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
