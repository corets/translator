import { TranslatorInterpolator } from "./types"

export const interpolator: TranslatorInterpolator = (
  text,
  match,
  replacement
) => {
  return text.replace(new RegExp(`\\$${match}`, "g"), replacement)
}
