import { TranslatorInterpolator } from "./types"

export const defaultTranslatorInterpolator: TranslatorInterpolator = (
  text,
  match,
  replacement
) => text.replace(new RegExp(`\\{\\{\\s*${match}\\s*\\}\\}`, "g"), replacement)
