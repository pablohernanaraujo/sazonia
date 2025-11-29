# Commands Overview

Este documento describe todos los comandos slash disponibles en el proyecto sazonia-web.

## Comandos de Planificación

### `/plan-new-feature`

**Propósito**: Crear un plan detallado para implementar una nueva funcionalidad.

**Uso**: `/plan-new-feature <descripción de la feature>`

**Descripción**: Genera un documento de planificación en `ai/plans/features/*.md` que incluye:

- Descripción y user story de la feature
- Problem/Solution statement
- Archivos relevantes y nuevos archivos a crear
- Requisitos de diseño responsive
- Plan de implementación por fases
- Estrategia de testing
- Criterios de aceptación
- Comandos de validación

---

### `/plan-bug-resolution`

**Propósito**: Crear un plan para resolver un bug específico.

**Uso**: `/plan-bug-resolution <descripción del bug>`

**Descripción**: Genera un documento de planificación en `ai/plans/bugs/*.md` que incluye:

- Descripción detallada del bug
- Pasos para reproducir
- Análisis de causa raíz
- Archivos relevantes
- Tareas paso a paso para la corrección
- Comandos de validación para asegurar zero regressions

---

### `/plan-chore`

**Propósito**: Crear un plan para resolver tareas de mantenimiento o chores.

**Uso**: `/plan-chore <descripción del chore>`

**Descripción**: Genera un documento de planificación en `ai/plans/chore/*.md` para tareas como refactoring, actualizaciones de dependencias, mejoras de configuración, etc.

---

### `/plan-design-system-component`

**Propósito**: Crear un plan para desarrollar un nuevo componente del design system.

**Uso**: `/plan-design-system-component <descripción del componente>`

**Descripción**: Genera un documento de planificación en `ai/plans/ui/*.md` específico para componentes UI que incluye:

- Clasificación Atomic Design (Atom/Molecule/Organism/Template/Page)
- Requisitos de composición con componentes existentes
- Ubicación en `src/ui/<category>/`
- Patrón de exports (barrel exports)
- Requisitos de Storybook stories (OBLIGATORIO)
- Estrategia de testing con >90% coverage
- Review arquitectónico con `ui-ux-architecture` agent

**Nota**: Solo crea componentes en `src/ui/`, NO en features o pages.

---

### `/plan-ui-from-design`

**Propósito**: Crear un plan de implementación basado en assets de diseño (imágenes, mockups, Figma).

**Uso**: `/plan-ui-from-design <path a assets de diseño o descripción>`

**Descripción**: Genera un documento de planificación en `ai/plans/ui-component/*.md` que:

- Analiza los assets de diseño proporcionados (desktop/mobile)
- Mapea elementos visuales a componentes existentes de `src/ui/`
- Prioriza el reuso de componentes existentes
- Sigue la estructura del feature `sales` como referencia
- Define rutas en `src/app/profile/(routes)/`
- Solo crea nuevos componentes UI si es absolutamente necesario

**Requisito**: Assets de diseño son OBLIGATORIOS para este comando.

---

## Comandos de Implementación

### `/implement-approved-plan`

**Propósito**: Ejecutar un plan previamente aprobado.

**Uso**: `/implement-approved-plan <path al plan o contenido>`

**Descripción**:

- Lee el plan proporcionado
- Implementa cada paso del plan
- Genera un reporte con bullet points del trabajo realizado
- Ejecuta `git diff --stat` para mostrar cambios

---

### `/implement-ui-plan`

**Propósito**: Ejecutar un plan de UI con revisión visual incluida.

**Uso**: `/implement-ui-plan <path al plan o contenido>`

**Descripción**:

- Implementa el plan de UI
- Genera reporte de trabajo completado
- **Invoca el subagent `ui-ux-reviewer`** para revisar el trabajo visualmente
- Itera en el proceso de revisión según sea necesario

---

### `/integrate-existing-components`

**Propósito**: Integrar componentes UI existentes en un feature específico.

**Uso**: `/integrate-existing-components <descripción de la integración>`

**Descripción**: Genera un plan en `ai/plans/components/<feature-name>-integration.md` para:

- Reemplazar HTML crudo/estilos inline con componentes del design system
- Mantener consistencia visual
- Actualizar imports usando named exports de `@/ui`

**Reglas críticas**:

- NO crear nuevos componentes
- SOLO modificar el feature especificado
- SOLO usar componentes existentes de `src/ui/`

---

### `/implement-firebase-feature`

**Propósito**: Implementar una feature completa usando Firebase con patrones SSR y Client.

**Uso**: `/implement-firebase-feature <descripción de la feature>`

**Descripción**: Guía la implementación de features con Firebase siguiendo las mejores prácticas:

- Diseño de modelo de datos TypeScript
- Implementación server-side con Admin SDK
- Server Actions para mutaciones
- Hooks cliente para datos real-time
- Server Components para SSR inicial
- Client Components con hidratación
- Security Rules de Firestore/Storage

**Skills relacionados**:

- `firebase-ssr-patterns`
- `firebase-client-patterns`
- `firebase-firestore-advanced`
- `firebase-storage-patterns`

**Rules relacionadas**:

- `firebase-security.md`

---

## Comandos de Validación

### `/validate-frontend-build`

**Propósito**: Ejecutar suite de validación completa del frontend.

**Uso**: `/validate-frontend-build`

**Descripción**: Ejecuta pruebas de validación y retorna resultados en formato JSON:

```json
[
  {
    "test_name": "typescript_check",
    "passed": true/false,
    "execution_command": "npm run type-check",
    "test_purpose": "...",
    "error": "optional error message"
  }
]
```

**Tests ejecutados**:

1. TypeScript Type Check (`npm run type-check`)
2. Build (`npm run build`)

---

## Resumen Rápido

| Comando                          | Propósito                         | Output                       |
| -------------------------------- | --------------------------------- | ---------------------------- |
| `/plan-new-feature`              | Planificar nueva funcionalidad    | `ai/plans/features/*.md`     |
| `/plan-bug-resolution`           | Planificar corrección de bug      | `ai/plans/bugs/*.md`         |
| `/plan-chore`                    | Planificar tarea de mantenimiento | `ai/plans/chore/*.md`        |
| `/plan-design-system-component`  | Planificar componente UI          | `ai/plans/ui/*.md`           |
| `/plan-ui-from-design`           | Planificar UI desde diseño        | `ai/plans/ui-component/*.md` |
| `/implement-approved-plan`       | Implementar plan aprobado         | Código + reporte             |
| `/implement-ui-plan`             | Implementar plan UI con revisión  | Código + reporte + UI review |
| `/integrate-existing-components` | Integrar componentes existentes   | `ai/plans/components/*.md`   |
| `/validate-frontend-build`       | Validar build del frontend        | JSON con resultados          |
| `/implement-firebase-feature`    | Implementar feature con Firebase  | Código SSR + Client + Rules  |
