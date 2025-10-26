"use client";

import { useState, useEffect } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FieldValidation {
  value: string;
  error: string | null;
  isValid: boolean;
  isDirty: boolean;
}

export const useFormValidation = (initialValues: Record<string, string>, rules: Record<string, ValidationRule>) => {
  const [fields, setFields] = useState<Record<string, FieldValidation>>(() => {
    const initialFields: Record<string, FieldValidation> = {};
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        value: initialValues[key],
        error: null,
        isValid: true,
        isDirty: false
      };
    });
    return initialFields;
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (fieldName: string, value: string): string | null => {
    const rule = rules[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return 'Este campo es requerido';
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return null;

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `No puede tener más de ${rule.maxLength} caracteres`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'El formato no es válido';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const updateField = (fieldName: string, value: string) => {
    const error = validateField(fieldName, value);
    
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        value,
        error,
        isValid: !error,
        isDirty: true
      }
    }));
  };

  const validateAllFields = () => {
    const updatedFields = { ...fields };
    let hasErrors = false;

    Object.keys(updatedFields).forEach(fieldName => {
      const error = validateField(fieldName, updatedFields[fieldName].value);
      updatedFields[fieldName] = {
        ...updatedFields[fieldName],
        error,
        isValid: !error,
        isDirty: true
      };
      if (error) hasErrors = true;
    });

    setFields(updatedFields);
    return !hasErrors;
  };

  const resetField = (fieldName: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        value: initialValues[fieldName] || '',
        error: null,
        isValid: true,
        isDirty: false
      }
    }));
  };

  const resetForm = () => {
    const resetFields: Record<string, FieldValidation> = {};
    Object.keys(initialValues).forEach(key => {
      resetFields[key] = {
        value: initialValues[key],
        error: null,
        isValid: true,
        isDirty: false
      };
    });
    setFields(resetFields);
  };

  // Update form validity whenever fields change
  useEffect(() => {
    const allValid = Object.values(fields).every(field => field.isValid);
    const hasRequiredFields = Object.keys(rules).some(key => rules[key].required);
    const requiredFieldsFilled = hasRequiredFields 
      ? Object.keys(rules)
          .filter(key => rules[key].required)
          .every(key => fields[key]?.value && fields[key].value.trim() !== '')
      : true;

    setIsFormValid(allValid && requiredFieldsFilled);
  }, [fields, rules]);

  return {
    fields,
    isFormValid,
    updateField,
    validateAllFields,
    resetField,
    resetForm,
    getFieldProps: (fieldName: string) => ({
      value: fields[fieldName]?.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        updateField(fieldName, e.target.value),
      error: fields[fieldName]?.isDirty ? fields[fieldName]?.error || undefined : undefined
    })
  };
};

// Reglas de validación comunes
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Ingresa un email válido';
      }
      return null;
    }
  },
  
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    custom: (value: string) => {
      if (value && value.length > 60) {
        return 'Para SEO, se recomienda máximo 60 caracteres';
      }
      return null;
    }
  },

  excerpt: {
    required: true,
    minLength: 10,
    maxLength: 200,
    custom: (value: string) => {
      if (value && value.length > 160) {
        return 'Para SEO, se recomienda máximo 160 caracteres';
      }
      return null;
    }
  },

  slug: {
    required: true,
    pattern: /^[a-z0-9-]+$/,
    custom: (value: string) => {
      if (value && !/^[a-z0-9-]+$/.test(value)) {
        return 'Solo se permiten letras minúsculas, números y guiones';
      }
      return null;
    }
  },

  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return 'Debe ser una URL válida (http:// o https://)';
      }
      return null;
    }
  },

  tenantName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: (value: string) => {
      if (value && !/^[a-zA-Z0-9\s\-_.]+$/.test(value)) {
        return 'Solo se permiten letras, números, espacios y guiones';
      }
      return null;
    }
  },

  authorName: {
    required: true,
    minLength: 2,
    maxLength: 100
  }
};

export default useFormValidation;