# Agents Overview

Este documento describe todos los agentes disponibles en el proyecto, sus responsabilidades y los recursos que utilizan.

## Output Requirements (Global)

**IMPORTANTE:** Todos los agentes DEBEN guardar sus evaluaciones en `ai/agents/evaluations/`. Esta regla es OBLIGATORIA.

---

## Agentes Disponibles

### 1. Firebase Architecture Reviewer

**Archivo:** `firebase-architecture.md`
**Modelo:** Default (sonnet)

**Descripción:**
Revisa implementaciones de Firebase para correctitud arquitectónica, mejores prácticas de seguridad, optimización de rendimiento y separación correcta entre código de servidor y cliente.

**Cuándo Usar:**

- Revisión de arquitectura de integración Firebase
- Auditoría de reglas de seguridad y patrones de acceso a datos
- Evaluación de uso SSR vs client-side de Firebase
- Evaluación de optimización de rendimiento y costos
- Planificación de migraciones o upgrades de Firebase

**Rules que Utiliza:**
| Rule | Descripción |
|------|-------------|
| `firebase-security.md` | Patrones de seguridad para Firestore y Storage rules |

**Skills que Utiliza:**
| Skill | Descripción |
|-------|-------------|
| `firebase-ssr-patterns` | Patrones SSR con Firebase Admin SDK |
| `firebase-client-patterns` | Patrones client-side con Firebase SDK |
| `firebase-firestore-advanced` | Patrones avanzados de Firestore |
| `firebase-storage-patterns` | Patrones de Firebase Storage |

---

### 2. UI/UX Architecture Reviewer

**Archivo:** `ui-ux-architecture.md`
**Modelo:** Sonnet
**Color:** Red

**Descripción:**
Arquitecto React elite que revisa código de componentes para cumplimiento arquitectónico, patrones de diseño de componentes y validación de implementación UI contra principios de arquitectura establecidos.

**Cuándo Usar:**

- Después de crear un nuevo componente React
- Al refactorizar componentes existentes
- Revisión proactiva durante desarrollo
- Escenarios de code review

**Rules que Utiliza:**
| Rule | Descripción |
|------|-------------|
| `styling-guidelines.md` | Guías de estilo con Tailwind CSS |
| `accessibility-patterns.md` | Patrones de accesibilidad WCAG 2.1 |

**Skills que Utiliza:**
| Skill | Descripción |
|-------|-------------|
| `sazonia-ui-components` | Patrones CVA, Radix UI, barrel exports |
| `sazonia-accessibility` | Estándares WCAG 2.1 AA |
| `sazonia-storybook` | Documentación de componentes en Storybook |

---

### 3. UI/UX Reviewer

**Archivo:** `ui-ux-reviewer.md`
**Modelo:** Sonnet
**Color:** Orange

**Descripción:**
Experto en UI/UX con 15+ años de experiencia evaluando interfaces de usuario. Especializado en diseño de componentes React, accesibilidad (WCAG 2.1 AA/AAA), principios de diseño visual y optimización de experiencia de usuario.

**Cuándo Usar:**

- Después de implementar nuevos componentes UI
- Al refactorizar interfaces de componentes existentes
- Antes de merge para asegurar calidad de diseño
- Cuando hay preocupaciones de accesibilidad
- Después de actualizaciones visuales

**Rules que Utiliza:**
| Rule | Descripción |
|------|-------------|
| `styling-guidelines.md` | Guías de estilo con Tailwind CSS |
| `accessibility-patterns.md` | Patrones de accesibilidad WCAG 2.1 |

**Skills que Utiliza:**
| Skill | Descripción |
|-------|-------------|
| `sazonia-ui-components` | Patrones CVA, Radix UI, barrel exports |
| `sazonia-accessibility` | Estándares WCAG 2.1 AA |
| `sazonia-storybook` | Stories y documentación de componentes |

**Herramientas Especiales:**

- Accede a Storybook (`http://localhost:6006`) para análisis visual
- Usa WebFetch para analizar componentes renderizados
- No usa Playwright - análisis basado en código y Storybook

---

### 4. Next.js Testing Architect

**Archivo:** `nextjs-architect.md`
**Modelo:** Opus
**Color:** Pink

**Descripción:**
Arquitecto Next.js elite con expertise en Vitest, Storybook y React Hook Form. Combina conocimiento teórico con experiencia práctica construyendo aplicaciones production-grade.

**Cuándo Usar:**

- Configuración de infraestructura de testing (Vitest)
- Arquitectura de formularios complejos (React Hook Form)
- Organización y documentación de Storybook
- Revisión de componentes para best practices de Next.js
- Integración cohesiva de tecnologías

**Rules que Utiliza:**
| Rule | Descripción |
|------|-------------|
| `styling-guidelines.md` | Guías de estilo con Tailwind CSS |
| `accessibility-patterns.md` | Patrones de accesibilidad |

**Skills que Utiliza:**
| Skill | Descripción |
|-------|-------------|
| `sazonia-ui-components` | Patrones de componentes UI |
| `sazonia-storybook` | Configuración y stories de Storybook |
| `sazonia-routing-paths` | Rutas type-safe con createPaths |
| `sazonia-auth-patterns` | Patrones de autenticación con Clerk |

**Expertise Específico:**

- **Vitest:** Configuración, mocking, coverage, Testing Library
- **Storybook:** Stories, MDX, interaction testing, autodocs
- **React Hook Form:** Zod validation, multi-step forms, Server Actions

---

## Resumen de Dependencias

### Rules

| Rule                        | Agentes que la Usan                                   |
| --------------------------- | ----------------------------------------------------- |
| `firebase-security.md`      | Firebase Architecture                                 |
| `styling-guidelines.md`     | UI/UX Architecture, UI/UX Reviewer, Next.js Architect |
| `accessibility-patterns.md` | UI/UX Architecture, UI/UX Reviewer, Next.js Architect |
| `local-storage-patterns.md` | (Disponible para uso general)                         |

### Skills

| Skill                         | Agentes que la Usan                                   |
| ----------------------------- | ----------------------------------------------------- |
| `firebase-ssr-patterns`       | Firebase Architecture                                 |
| `firebase-client-patterns`    | Firebase Architecture                                 |
| `firebase-firestore-advanced` | Firebase Architecture                                 |
| `firebase-storage-patterns`   | Firebase Architecture                                 |
| `sazonia-ui-components`       | UI/UX Architecture, UI/UX Reviewer, Next.js Architect |
| `sazonia-accessibility`       | UI/UX Architecture, UI/UX Reviewer                    |
| `sazonia-storybook`           | UI/UX Architecture, UI/UX Reviewer, Next.js Architect |
| `sazonia-routing-paths`       | Next.js Architect                                     |
| `sazonia-auth-patterns`       | Next.js Architect                                     |
| `sazonia-local-storage`       | (Disponible para uso general)                         |

---

## Directorio de Evaluaciones

Todas las evaluaciones generadas por los agentes se guardan en:

```
ai/agents/evaluations/
├── implement-firebase-evaluation.md
├── vitest-implementation-plan-2025-11-29.md
├── {component}-evaluation-{YYYY-MM-DD}.md
├── {component}-ux-review-{YYYY-MM-DD}.md
└── ...
```

**Convenciones de Nombres:**

- `{plan-name}-evaluation.md` - Evaluaciones de planes
- `{feature-name}-review-{YYYY-MM-DD}.md` - Reviews de features
- `{component-name}-ux-review-{YYYY-MM-DD}.md` - Reviews de UX
- `{topic-name}-{YYYY-MM-DD}.md` - Evaluaciones generales
