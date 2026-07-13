"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createEmployee } from "@/app/actions/employees";
import {
  createEmployeeSchema,
  type CreateEmployeeInput,
} from "@/lib/validations/employee";
import EmployeeFormFields from "@/components/dashboard/EmployeeFormFields";
import Button from "@/components/ui/Button";

export default function CreateEmployeeForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: "",
      role: "",
      instructions: "",
      model: "OpenRouter Free",
      temperature: 0.7,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: CreateEmployeeInput) => {
    setServerError(null);
    const result = await createEmployee(values);

    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <EmployeeFormFields
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      {serverError && (
        <p
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          role="alert"
        >
          {serverError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Creating…
            </>
          ) : (
            "Create AI Employee"
          )}
        </Button>
      </div>
    </form>
  );
}
