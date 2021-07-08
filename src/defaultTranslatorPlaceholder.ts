import { TranslatorPlaceholder } from "./types"

export const defaultTranslatorPlaceholder: TranslatorPlaceholder = (
  language,
  key,
  replacements
) => `{ ${language}.${key} }`
