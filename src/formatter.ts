import { isObjectLike } from "lodash-es"
import { TranslatorFormatter } from "./types"

export const formatter: TranslatorFormatter = (
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
