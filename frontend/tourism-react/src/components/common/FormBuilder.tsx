import React, { useState } from "react";
import { FormProps, FormField } from "../../types/management";
import LoadingSpinner from "../LoadingSpinner";

const FormBuilder: React.FC<FormProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  loading = false,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern, message } = field.validation;

      if (min !== undefined && value && value.toString().length < min) {
        return message || `${field.label} must be at least ${min} characters`;
      }

      if (max !== undefined && value && value.toString().length > max) {
        return (
          message || `${field.label} must be no more than ${max} characters`
        );
      }

      if (pattern && value && !pattern.test(value.toString())) {
        return message || `${field.label} format is invalid`;
      }
    }

    if (field.type === "email" && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return "Please enter a valid email address";
      }
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  const renderField = (field: FormField) => {
    const value = values[field.name] || "";
    const error = errors[field.name];

    const commonProps = {
      id: field.name,
      name: field.name,
      className: `form-input ${error ? "error" : ""}`,
      disabled: loading,
    };

    switch (field.type) {
      case "select":
        return (
          <select
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
          >
            <option value="">
              {field.placeholder || `Select ${field.label}`}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case "file":
        return (
          <input
            {...commonProps}
            type="file"
            onChange={(e) =>
              handleChange(field.name, e.target.files?.[0] || null)
            }
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-builder">
      <div className="form-fields">
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name} className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <div className="form-error">{errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <LoadingSpinner size="small" text="" /> : submitText}
        </button>
      </div>
    </form>
  );
};

export default FormBuilder;
