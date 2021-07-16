import isObjectLike from "lodash/isObjectLike"
import { TranslatorFormatter } from "./types"

export const translatorFormatter: TranslatorFormatter = (
  language,
  replacement,
  otherReplacements
) => {
  if (Array.isArray(replacement)) return replacement.join(", ")
  if (isObjectLike(replacement)) return JSON.stringify(replacement)

  return typeof replacement === "string"
    ? replacement
    : JSON.stringify(replacement)
}
