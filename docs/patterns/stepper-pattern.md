# Patrones de Multi-Step Forms (Stepper)

> **Guía de referencia para implementar formularios multi-paso consistentes y reutilizables**

---

## 📖 Tabla de Contenidos

1. [Principios Fundamentales](#principios-fundamentales)
2. [Arquitectura de Componentes](#arquitectura-de-componentes)
3. [Sistema de Stepper](#sistema-de-stepper)
4. [Gestión de Estado](#gestión-de-estado)
5. [Patrones de Validación](#patrones-de-validación)
6. [Patrones de Navegación](#patrones-de-navegación)
7. [Persistencia de Datos](#persistencia-de-datos)
8. [Responsive Design](#responsive-design)
9. [Accesibilidad](#accesibilidad)
10. [Checklist de Implementación](#checklist-de-implementación)

---

## Principios Fundamentales

### 1. Progressive Disclosure

**Concepto**: Mostrar información gradualmente para no abrumar al usuario.

```typescript
// ✅ Correcto: Un paso a la vez
Step 1: Información Básica (Nombre, Descripción)
Step 2: Configuración Avanzada (Opciones específicas)
Step 3: Confirmación (Review antes de enviar)

// ❌ Incorrecto: Todo en una pantalla
Formulario con 20 campos simultáneos
```

### 2. Separación de Responsabilidades

```
components/
├── multi-step-form/
│   ├── FormContainer.tsx      # Wrapper principal
│   ├── StepIndicator.tsx      # Barra de progreso
│   ├── StepContent.tsx        # Contenedor de cada paso
│   ├── NavigationControls.tsx # Botones Next/Back
│   └── hooks/
│       ├── useFormStepper.ts  # Lógica de navegación
│       └── useFormState.ts    # Estado del formulario
```

### 3. Configuración Declarativa

```typescript
// config/form-steps.config.ts
export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  validation?: z.ZodSchema;
}

export const createTeamSteps: StepConfig[] = [
  {
    id: 'basic-info',
    title: 'Información Básica',
    description: 'Datos principales del equipo',
    fields: ['name', 'description', 'category'],
    validation: basicInfoSchema,
  },
  {
    id: 'configuration',
    title: 'Configuración',
    description: 'Opciones adicionales',
    fields: ['visibility', 'permissions'],
    validation: configSchema,
  },
  {
    id: 'confirmation',
    title: 'Confirmación',
    description: 'Revisa y confirma',
    fields: ['acceptTerms'],
    validation: confirmationSchema,
  },
];
```

---

## Arquitectura de Componentes

### Jerarquía de Componentes

```
MultiStepForm/
├── FormProvider                    # Context + Estado global
│   ├── StepperContainer           # Layout principal
│   │   ├── StepIndicator          # Progress bar
│   │   │   ├── StepItem           # Individual step
│   │   │   │   ├── StepNumber     # Número o check
│   │   │   │   ├── StepLabel      # Título del paso
│   │   │   │   └── StepConnector  # Línea conectora
│   │   ├── StepContent            # Contenedor del paso activo
│   │   │   └── StepFields         # Campos del paso
│   │   └── NavigationControls     # Botones
│   │       ├── BackButton         # Volver
│   │       ├── NextButton         # Siguiente
│   │       └── SubmitButton       # Enviar (último paso)
```

### Patrón: FormProvider (Context)

```typescript
// components/multi-step-form/FormProvider.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface FormContextValue<T> {
  formData: T;
  updateFormData: (data: Partial<T>) => void;
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

const FormContext = createContext<FormContextValue<any> | null>(null);

export function FormProvider<T extends Record<string, any>>({
  children,
  initialData,
  steps,
}: {
  children: ReactNode;
  initialData: T;
  steps: StepConfig[];
}) {
  const [formData, setFormData] = useState<T>(initialData);
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = (data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => goToStep(currentStep + 1);
  const prevStep = () => goToStep(currentStep - 1);

  const value: FormContextValue<T> = {
    formData,
    updateFormData,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext<T>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context as FormContextValue<T>;
}
```

### Patrón: Custom Hook - useFormStepper

```typescript
// hooks/useFormStepper.ts
import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormStepperOptions<T> {
  initialData: T;
  steps: StepConfig[];
  onComplete: (data: T) => Promise<void>;
}

export function useFormStepper<T extends Record<string, any>>({
  initialData,
  steps,
  onComplete,
}: UseFormStepperOptions<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepConfig = steps[currentStep];

  const validateStep = useCallback(async () => {
    try {
      const schema = currentStepConfig.validation;
      if (schema) {
        await schema.parseAsync(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [currentStepConfig, formData]);

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const goToStep = async (step: number) => {
    if (step >= 0 && step < steps.length) {
      const isValid = await validateStep();
      if (isValid || step < currentStep) {
        setCurrentStep(step);
        setErrors({});
      }
    }
  };

  const updateFormData = (data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    currentStepConfig,
    formData,
    errors,
    isSubmitting,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    handleSubmit,
  };
}
```

---

## Sistema de Stepper

### Patrón: Step Indicator Horizontal

```typescript
// components/multi-step-form/StepIndicator.tsx
import { Check } from 'lucide-react';
import { useFormContext } from './FormProvider';

interface StepIndicatorProps {
  steps: StepConfig[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  const { currentStep, goToStep } = useFormContext();

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep;

          return (
            <li key={step.id} className="relative flex-1">
              {/* Connector Line */}
              {index !== 0 && (
                <div
                  className={`
                    absolute left-0 top-5 -ml-px h-0.5 w-full
                    ${isCompleted ? 'bg-primary' : 'bg-muted'}
                  `}
                  aria-hidden="true"
                />
              )}

              {/* Step Button */}
              <button
                type="button"
                onClick={() => isClickable && goToStep(index)}
                disabled={!isClickable}
                className="group relative flex flex-col items-center"
              >
                {/* Step Number/Check */}
                <span
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
                    ${isCompleted && 'border-primary bg-primary text-primary-foreground'}
                    ${isActive && 'border-primary bg-background text-primary'}
                    ${!isActive && !isCompleted && 'border-muted bg-background text-muted-foreground'}
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </span>

                {/* Step Label */}
                <span
                  className={`
                    mt-2 text-sm font-medium
                    ${isActive && 'text-primary'}
                    ${!isActive && 'text-muted-foreground'}
                  `}
                >
                  {step.title}
                </span>

                {/* Step Description (opcional) */}
                {step.description && (
                  <span className="mt-1 text-xs text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

### Variación: Stepper Vertical

```typescript
// components/multi-step-form/VerticalStepIndicator.tsx
export function VerticalStepIndicator({ steps }: StepIndicatorProps) {
  const { currentStep, goToStep } = useFormContext();

  return (
    <nav aria-label="Progress" className="space-y-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = index <= currentStep;

        return (
          <div key={step.id} className="relative flex items-start">
            {/* Vertical Connector */}
            {index !== steps.length - 1 && (
              <div
                className={`
                  absolute left-5 top-10 h-full w-0.5
                  ${isCompleted ? 'bg-primary' : 'bg-muted'}
                `}
              />
            )}

            {/* Step Content */}
            <button
              type="button"
              onClick={() => isClickable && goToStep(index)}
              disabled={!isClickable}
              className="flex items-center gap-4"
            >
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border-2
                  ${isCompleted && 'border-primary bg-primary text-primary-foreground'}
                  ${isActive && 'border-primary bg-background text-primary'}
                  ${!isActive && !isCompleted && 'border-muted'}
                `}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
              </div>

              <div className="text-left">
                <p className={`font-medium ${isActive && 'text-primary'}`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
```

### Variación: Progress Bar Lineal

```typescript
// components/multi-step-form/LinearProgress.tsx
export function LinearProgress() {
  const { currentStep, totalSteps } = useFormContext();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Paso {currentStep + 1} de {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

---

## Gestión de Estado

### Patrón 1: Estado Local con useState

```typescript
// Para formularios simples (2-3 pasos, sin complejidad)
function SimpleMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    preferences: {},
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ... resto de la lógica
}
```

### Patrón 2: Estado con useReducer

```typescript
// Para formularios complejos con múltiples acciones
interface FormState {
  currentStep: number;
  formData: CreateTeamFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: any } }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value,
        },
      };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}
```

### Patrón 3: Estado Global con Zustand

```typescript
// stores/multi-step-form.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MultiStepFormStore {
  currentStep: number;
  formData: Record<string, any>;
  errors: Record<string, string>;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
}

export const useMultiStepFormStore = create<MultiStepFormStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      formData: {},
      errors: {},
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: state.currentStep + 1 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(0, state.currentStep - 1) 
      })),
      
      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data },
      })),
      
      setErrors: (errors) => set({ errors }),
      
      resetForm: () => set({ 
        currentStep: 0, 
        formData: {}, 
        errors: {} 
      }),
    }),
    {
      name: 'multi-step-form-storage',
      partialize: (state) => ({ formData: state.formData }), // Solo persistir formData
    }
  )
);
```

---

## Patrones de Validación

### Patrón 1: Validación por Paso con Zod

```typescript
// schemas/create-team.schema.ts
import { z } from 'zod';

// Step 1: Información Básica
export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
});

// Step 2: Configuración
export const configSchema = z.object({
  visibility: z.enum(['public', 'private'], {
    required_error: 'Selecciona la visibilidad',
  }),
  allowMemberInvites: z.boolean().default(false),
  maxMembers: z
    .number()
    .min(2, 'Mínimo 2 miembros')
    .max(100, 'Máximo 100 miembros')
    .optional(),
});

// Step 3: Confirmación
export const confirmationSchema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

// Schema completo (para validación final)
export const createTeamSchema = z.object({
  ...basicInfoSchema.shape,
  ...configSchema.shape,
  ...confirmationSchema.shape,
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
```

### Patrón 2: Validación en Tiempo Real

```typescript
// hooks/useFieldValidation.ts
import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useFieldValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback(
    (fieldName: string, value: any) => {
      try {
        const fieldSchema = schema.shape[fieldName];
        if (fieldSchema) {
          fieldSchema.parse(value);
        }
        
        // Limpiar error si es válido
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: error.errors[0]?.message || 'Error de validación',
          }));
        }
      }
    },
    [schema]
  );

  const validateAll = useCallback(
    async (data: any) => {
      try {
        await schema.parseAsync(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach(err => {
            if (err.path[0]) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setErrors(fieldErrors);
        }
        return false;
      }
    },
    [schema]
  );

  return {
    errors,
    validateField,
    validateAll,
  };
}
```

---

## Patrones de Navegación

### Patrón: Navegación Controlada

```typescript
// components/multi-step-form/NavigationControls.tsx
interface NavigationControlsProps {
  onSubmit: () => Promise<void>;
}

export function NavigationControls({ onSubmit }: NavigationControlsProps) {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    prevStep,
    nextStep,
  } = useFormContext();

  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    setIsValidating(true);
    try {
      const isValid = await validateCurrentStep();
      if (isValid) {
        nextStep();
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    setIsValidating(true);
    try {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setIsSubmitting(true);
        await onSubmit();
      }
    } finally {
      setIsValidating(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-between gap-4">
      {/* Back Button */}
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep || isSubmitting || isValidating}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Atrás
      </Button>

      {/* Next/Submit Button */}
      {isLastStep ? (
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isValidating}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Crear Equipo
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleNext}
          disabled={isValidating}
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validando...
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
```

---

## Persistencia de Datos

### Patrón 1: LocalStorage con Zustand Persist

```typescript
// Ya implementado en el ejemplo de Zustand arriba
// La persistencia es automática con el middleware persist
```

### Patrón 2: SessionStorage Manual

```typescript
// hooks/useFormPersistence.ts
import { useEffect } from 'react';

const STORAGE_KEY = 'multi-step-form-data';

export function useFormPersistence<T>(formData: T) {
  // Guardar en sessionStorage cuando cambia formData
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }, [formData]);

  // Limpiar al completar
  const clearStorage = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  };

  return { clearStorage };
}

// Recuperar datos guardados
export function getPersistedFormData<T>(): T | null {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return null;
  }
}
```

### Patrón 3: Auto-save con Debounce

```typescript
// hooks/useAutoSave.ts
import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled || !data) return;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(data);
        console.log('✅ Auto-save exitoso');
      } catch (error) {
        console.error('❌ Error en auto-save:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, delay, onSave]);
}
```

---

## Responsive Design

### Layout Responsive

```typescript
// components/multi-step-form/ResponsiveLayout.tsx
export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Mobile: Stack vertical */}
        <div className="block lg:hidden">
          <div className="space-y-6">{children}</div>
        </div>

        {/* Desktop: Grid con sidebar */}
        <div className="hidden lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
          <aside className="sticky top-8 h-fit">
            <VerticalStepIndicator />
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
```

### Stepper Responsive

```typescript
// components/multi-step-form/ResponsiveStepper.tsx
export function ResponsiveStepper({ steps }: { steps: StepConfig[] }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileStepIndicator steps={steps} />;
  }

  return <DesktopStepIndicator steps={steps} />;
}

// Mobile: Dropdown de pasos
function MobileStepIndicator({ steps }: { steps: StepConfig[] }) {
  const { currentStep, goToStep } = useFormContext();

  return (
    <Select value={currentStep.toString()} onValueChange={(v) => goToStep(+v)}>
      <SelectTrigger>
        <SelectValue>
          Paso {currentStep + 1}: {steps[currentStep].title}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {steps.map((step, index) => (
          <SelectItem key={step.id} value={index.toString()}>
            Paso {index + 1}: {step.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## Accesibilidad

### ARIA Labels y Roles

```typescript
// Stepper con ARIA
<nav aria-label="Progreso del formulario" role="navigation">
  <ol role="list">
    {steps.map((step, index) => (
      <li key={step.id} role="listitem">
        <button
          role="button"
          aria-current={index === currentStep ? 'step' : undefined}
          aria-label={`Paso ${index + 1}: ${step.title}`}
          aria-disabled={index > currentStep}
        >
          {/* ... */}
        </button>
      </li>
    ))}
  </ol>
</nav>
```

### Navegación por Teclado

```typescript
// hooks/useKeyboardNavigation.ts
export function useKeyboardNavigation() {
  const { nextStep, prevStep, isFirstStep, isLastStep } = useFormContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + → : Siguiente paso
      if (e.altKey && e.key === 'ArrowRight' && !isLastStep) {
        e.preventDefault();
        nextStep();
      }

      // Alt + ← : Paso anterior
      if (e.altKey && e.key === 'ArrowLeft' && !isFirstStep) {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep, isFirstStep, isLastStep]);
}
```

### Focus Management

```typescript
// hooks/useFocusManagement.ts
export function useFocusManagement() {
  const { currentStep } = useFormContext();
  const previousStep = useRef(currentStep);

  useEffect(() => {
    if (currentStep !== previousStep.current) {
      // Focus en el primer campo del nuevo paso
      const firstInput = document.querySelector<HTMLInputElement>(
        '[data-step-content] input, [data-step-content] select, [data-step-content] textarea'
      );

      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }

      previousStep.current = currentStep;
    }
  }, [currentStep]);
}
```

### Anuncios de Cambios

```typescript
// components/multi-step-form/StepAnnouncer.tsx
export function StepAnnouncer() {
  const { currentStep, steps } = useFormContext();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const step = steps[currentStep];
    setAnnouncement(`Paso ${currentStep + 1} de ${steps.length}: ${step.title}`);
  }, [currentStep, steps]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
```

---

## Checklist de Implementación

### ✅ Fase 1: Configuración Inicial

- [ ] Definir estructura de pasos en config
- [ ] Crear schemas de validación con Zod
- [ ] Definir interfaces TypeScript para FormData
- [ ] Establecer datos iniciales del formulario

### ✅ Fase 2: Componentes Core

- [ ] FormProvider / Context para estado global
- [ ] StepIndicator (versión desktop y mobile)
- [ ] StepContent con renderizado condicional
- [ ] NavigationControls con validación

### ✅ Fase 3: Validación

- [ ] Validación por paso antes de avanzar
- [ ] Mostrar errores inline en campos
- [ ] Validación en tiempo real (opcional)
- [ ] Manejo de errores del servidor

### ✅ Fase 4: UX Avanzado

- [ ] Persistencia con localStorage/sessionStorage
- [ ] Auto-save con debounce (opcional)
- [ ] Loading states y spinners
- [ ] Success/error feedback

### ✅ Fase 5: Responsive y Accesibilidad

- [ ] Layout responsive (mobile/tablet/desktop)
- [ ] Stepper adaptativo según viewport
- [ ] ARIA labels completos
- [ ] Navegación por teclado
- [ ] Focus management
- [ ] Anuncios para screen readers

### ✅ Fase 6: Testing

- [ ] Unit tests para hooks
- [ ] Integration tests para flujo completo
- [ ] Tests de accesibilidad
- [ ] Tests responsive

---

## 📝 Ejemplo Completo

### Implementación Básica

```typescript
// app/create-team/page.tsx
'use client';

import { FormProvider } from '@/components/multi-step-form/FormProvider';
import { StepperContainer } from '@/components/multi-step-form/StepperContainer';
import { createTeamSteps } from '@/config/create-team-steps';
import { useCreateTeam } from '@/lib/mutations/teams';

export default function CreateTeamPage() {
  const createTeamMutation = useCreateTeam();

  const initialData = {
    name: '',
    description: '',
    categoryId: '',
    visibility: 'public',
    allowMemberInvites: false,
    acceptTerms: false,
  };

  const handleSubmit = async (data: any) => {
    await createTeamMutation.mutateAsync(data);
    // Redirect o mostrar success
  };

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Crear Nuevo Equipo</h1>
      
      <FormProvider initialData={initialData} steps={createTeamSteps}>
        <StepperContainer steps={createTeamSteps} onSubmit={handleSubmit} />
      </FormProvider>
    </div>
  );
}
```

### StepperContainer

```typescript
// components/multi-step-form/StepperContainer.tsx
import { StepIndicator } from './StepIndicator';
import { StepContent } from './StepContent';
import { NavigationControls } from './NavigationControls';

interface StepperContainerProps {
  steps: StepConfig[];
  onSubmit: (data: any) => Promise<void>;
}

export function StepperContainer({ steps, onSubmit }: StepperContainerProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <StepIndicator steps={steps} />
      </div>
      
      {/* Step Content */}
      <div className="mb-8">
        <StepContent steps={steps} />
      </div>
      
      {/* Navigation */}
      <NavigationControls onSubmit={onSubmit} />
    </div>
  );
}
```

### StepContent

```typescript
// components/multi-step-form/StepContent.tsx
export function StepContent({ steps }: { steps: StepConfig[] }) {
  const { currentStep } = useFormContext();
  const currentStepConfig = steps[currentStep];

  return (
    <div data-step-content className="min-h-[400px]">
      {/* Renderizar componente del paso actual */}
      {currentStepConfig.id === 'basic-info' && <BasicInfoStep />}
      {currentStepConfig.id === 'configuration' && <ConfigurationStep />}
      {currentStepConfig.id === 'confirmation' && <ConfirmationStep />}
    </div>
  );
}
```

---

## 🎯 Puntos Clave para Replicación

### Elementos Esenciales

1. **Configuración Declarativa**: Define pasos en un archivo de config
2. **Separación de Responsabilidades**: Componentes pequeños y enfocados
3. **Validación por Paso**: No permitir avanzar sin validar
4. **Estado Centralizado**: Context API o Zustand para compartir estado
5. **Responsive**: Adaptar layout según viewport
6. **Accesibilidad**: ARIA, teclado, focus management

### Lo que NO debe cambiar entre proyectos

- Arquitectura de componentes (jerarquía)
- Lógica de navegación (next/prev/goTo)
- Patrones de validación (Zod)
- Estructura de estado (FormProvider)
- Accesibilidad (ARIA, keyboard)

### Lo que SÍ cambia entre proyectos

- Estilos y colores (branding)
- Número y tipo de pasos (contenido)
- Schemas de validación (campos específicos)
- Componentes de campos (inputs personalizados)
- Animaciones y transiciones (preferencias UX)

---

## 📚 Recursos

### Librerías Recomendadas

- `zod` - Validación de schemas
- `react-hook-form` - Manejo de formularios (opcional)
- `zustand` - Estado global ligero (opcional)
- `framer-motion` - Animaciones (opcional)

### Referencias

- [Material Design - Steppers](https://m3.material.io/components/steppers)
- [Ant Design - Steps](https://ant.design/components/steps)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Última actualización**: 10 de enero de 2026
