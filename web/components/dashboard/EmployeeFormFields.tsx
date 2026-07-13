"use client";

import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  Controller,
} from "react-hook-form";
import {
  EMPLOYEE_MODELS,
  TEMPERATURE_PRESETS,
} from "@/lib/types/employee";
import type { CreateEmployeeInput } from "@/lib/validations/employee";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type EmployeeFormFieldsProps = {
  register: UseFormRegister<CreateEmployeeInput>;
  control: Control<CreateEmployeeInput>;
  errors: FieldErrors<CreateEmployeeInput>;
  watch: UseFormWatch<CreateEmployeeInput>;
  setValue: UseFormSetValue<CreateEmployeeInput>;
  idPrefix?: string;
};

export default function EmployeeFormFields({
  register,
  control,
  errors,
  watch,
  setValue,
  idPrefix = "",
}: EmployeeFormFieldsProps) {
  const temperature = watch("temperature");
  const prefix = idPrefix ? `${idPrefix}-` : "";

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}name`}>Name</Label>
        <Input
          id={`${prefix}name`}
          placeholder="e.g. Alex — Sales Agent"
          autoComplete="off"
          variant={errors.name ? "error" : "default"}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-400" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}role`}>Role</Label>
        <Input
          id={`${prefix}role`}
          placeholder="e.g. Sales, Support, Receptionist"
          autoComplete="off"
          variant={errors.role ? "error" : "default"}
          aria-invalid={!!errors.role}
          {...register("role")}
        />
        {errors.role && (
          <p className="text-xs text-red-400" role="alert">
            {errors.role.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}instructions`}>Instructions</Label>
        <Textarea
          id={`${prefix}instructions`}
          placeholder="Describe how this AI Employee should behave, what goals to pursue, and any rules to follow..."
          rows={6}
          variant={errors.instructions ? "error" : "default"}
          aria-invalid={!!errors.instructions}
          {...register("instructions")}
        />
        {errors.instructions && (
          <p className="text-xs text-red-400" role="alert">
            {errors.instructions.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${prefix}model`}>Model</Label>
        <Select
          id={`${prefix}model`}
          variant={errors.model ? "error" : "default"}
          aria-invalid={!!errors.model}
          {...register("model")}
        >
          {EMPLOYEE_MODELS.map((model) => (
            <option key={model} value={model} className="bg-background">
              {model}
            </option>
          ))}
        </Select>
        {errors.model && (
          <p className="text-xs text-red-400" role="alert">
            {errors.model.message}
          </p>
        )}
        <p className="text-xs text-muted">
          Atlas AI currently routes all employees through the configured
          OpenRouter model.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${prefix}temperature`}>Temperature</Label>
          <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
            {Number(temperature.toFixed(1))}
          </span>
        </div>

        <Controller
          name="temperature"
          control={control}
          render={({ field }) => (
            <input
              id={`${prefix}temperature`}
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={field.value}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={field.value}
            />
          )}
        />

        <div className="flex flex-wrap gap-2">
          {TEMPERATURE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() =>
                setValue("temperature", preset, { shouldValidate: true })
              }
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                temperature === preset
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-white/10 bg-white/[0.03] text-muted hover:border-white/20 hover:text-white"
              )}
            >
              {preset}
            </button>
          ))}
        </div>

        {errors.temperature && (
          <p className="text-xs text-red-400" role="alert">
            {errors.temperature.message}
          </p>
        )}
      </div>
    </>
  );
}
