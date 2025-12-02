/**
 * Size mapping from input sizes to InputLabel sizes.
 *
 * Input components have 3 sizes (sm, md, lg), while InputLabel has 2 sizes (sm, md).
 * This mapping ensures visual harmony between the input and its label.
 */
export const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

/**
 * Size mapping from input sizes to Hint/ErrorMessage sizes.
 */
export const HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

/**
 * Valid input sizes for form components.
 */
export type InputSize = keyof typeof INPUT_LABEL_SIZE_MAP;
