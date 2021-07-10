import { isObjectLike } from "lodash"
import { TranslatorFormatter } from "./types"

export const defaultTranslatorFormatter: TranslatorFormatter = (
  language,
  replacement,
  replacements
) => {
  if (Array.isArray(replacement)) return JSON.stringify(replacement)
  if (isObjectLike(replacement)) return JSON.stringify(replacement)

  return typeof replacement === "string"
    ? replacement
    : JSON.stringify(replacement)
}
