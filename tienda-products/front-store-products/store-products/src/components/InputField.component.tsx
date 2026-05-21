import type { Control, FieldPath, FieldValues, FieldError } from "react-hook-form"
import { Controller } from "react-hook-form"

interface InputFieldProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>
    control: Control<TFieldValues, unknown, TFieldValues>
    label: string
    type?: React.HTMLInputTypeAttribute
    placeholder?: string
    min?: number
    step?: number
    className?: string
    required?: boolean
    error?: FieldError
}

export function InputField<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    type = "text",
    placeholder,
    min,
    step,
    className = "",
    required,
    error,
}: InputFieldProps<TFieldValues>) {
    return (
        <div className={`pf-field ${className}`}>
            <label className="pf-label" htmlFor={String(name)}>
                {label}
                {required && <span className="pf-required">*</span>}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        id={String(name)}
                        className={`pf-input ${error ? "pf-input--error" : ""}`}
                        type={type}
                        placeholder={placeholder}
                        min={min}
                        step={step}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                            // Los inputs type="number" devuelven string — convertimos acá
                            const val = type === "number"
                                ? e.target.valueAsNumber
                                : e.target.value
                            field.onChange(val)
                        }}
                    />
                )}
            />
            {error && <p className="pf-field-error">⚠ {error.message}</p>}
        </div>
    )
}