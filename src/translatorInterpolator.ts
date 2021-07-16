import { TranslatorInterpolator } from "./types"

export const translatorInterpolator: TranslatorInterpolator = (
  text,
  match,
  replacement
) => text.replace(new RegExp(`\\{\\{\\s*${match}\\s*\\}\\}`, "g"), replacement)
