import type { Control, FieldPath, FieldValues, FieldError } from "react-hook-form"
import { Controller } from "react-hook-form"

interface TextareaFieldProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>
    control: Control<TFieldValues, unknown, TFieldValues>
    label: string
    rows?: number
    placeholder?: string
    className?: string
    error?: FieldError
}

export function TextareaField<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    rows = 3,
    placeholder,
    className = "",
    error,
}: TextareaFieldProps<TFieldValues>) {
    return (
        <div className={`pf-field ${className}`}>
            <label className="pf-label" htmlFor={String(name)}>
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <textarea
                        id={String(name)}
                        className={`pf-textarea ${error ? "pf-input--error" : ""}`}
                        rows={rows}
                        placeholder={placeholder}
                        {...field}
                        value={field.value ?? ""}
                    />
                )}
            />
            {error && <p className="pf-field-error">⚠ {error.message}</p>}
        </div>
    )
}