import {
  Translator,
  TranslatorFormatter,
  TranslatorInterpolator,
} from "./index"
import { createTimeout } from "@corets/promise-helpers"

describe("Translator", () => {
  it("accepts language and translations", () => {
    const translator = new Translator(
      { en: { foo: "bar" } },
      { language: "en" }
    )

    expect(translator.getLanguage()).toBe("en")
    expect(translator.translations.get()).toEqual({ en: { foo: "bar" } })
  })

  it("gets and sets language", () => {
    const translator = new Translator(
      { en: { foo: "bar" } },
      { language: "en" }
    )

    expect(translator.getLanguage()).toBe("en")

    translator.setLanguage("de")

    expect(translator.getLanguage()).toBe("de")
  })

  it("translates text", () => {
    const translator = new Translator(
      { en: { foo: "bar {{1}}" } },
      { language: "en" }
    )

    expect(translator.get("foo")).toBe("bar {{1}}")
    expect(translator.get("foo", { replace: ["baz"] })).toBe("bar baz")
    expect(translator.get("foo", { replace: [1337] })).toBe("bar 1337")
    expect(translator.get("foo", { replace: ["baz"] })).toBe("bar baz")
    expect(translator.get("foo", { replace: [["yolo", "swag"]] })).toBe(
      `bar ["yolo","swag"]`
    )
    expect(translator.get("foo", { replace: [{ yolo: "swag" }] })).toBe(
      `bar {"yolo":"swag"}`
    )
  })

  it("translates text with a replacements array", () => {
    const translator = new Translator(
      { en: { foo: "bar {{1}}" } },
      { language: "en" }
    )

    expect(translator.get("foo", { replace: ["a"] })).toBe("bar a")
  })

  it("translates text with a replacements object", () => {
    const translator = new Translator(
      { en: { foo: "bar {{key}}" } },
      { language: "en" }
    )

    expect(translator.get("foo", { replace: { key: "a" } })).toBe("bar a")
  })

  it("translates text with spaces inside replacement placeholder", () => {
    const translator = new Translator(
      { en: { foo: "bar {{  key      }}" } },
      { language: "en" }
    )

    expect(translator.get("foo", { replace: { key: "a" } })).toBe("bar a")
  })

  it("translates text without greedy matching", () => {
    const translator = new Translator(
      { en: { foo: "bar {{{key}}}" } },
      { language: "en" }
    )

    expect(translator.get("foo", { replace: { key: "a" } })).toBe("bar {a}")
  })

  it("translates text with a custom formatter", () => {
    const translator = new Translator(
      { en: { foo: "bar {{key}}" } },
      {
        language: "en",
        formatter: (language, replacement, replacements) =>
          `${language}${replacement}${JSON.stringify(replacements)}`,
      }
    )

    expect(translator.get("foo", { replace: { key: "a" } })).toBe(
      `bar ena{"key":"a"}`
    )
  })

  it("translates text with a custom interpolator", () => {
    const translator = new Translator(
      { en: { foo: "bar $key$" } },
      {
        language: "en",
        interpolator: (text, match, replacement) =>
          text.replace(`$${match}$`, replacement),
      }
    )

    expect(translator.get("foo", { replace: { key: "a" } })).toBe(`bar a`)
  })

  it("translates text with nested key", () => {
    const translator = new Translator(
      { en: { foo: { bar: "baz" } } },
      { language: "en" }
    )

    expect(translator.get("foo.bar")).toBe("baz")
  })

  it("translates text to specific language", () => {
    const translator = new Translator(
      { en: { foo: "bar" }, de: { foo: "baz" } },
      { language: "en" }
    )

    expect(translator.get("foo", { language: "en" })).toBe("bar")
    expect(translator.get("foo", { language: "de" })).toBe("baz")
  })

  it("tells if a translation exists", () => {
    const translator = new Translator(
      { en: { foo: "bar" }, de: { boo: "baz" } },
      { language: "en" }
    )

    expect(translator.has("foo")).toBe(true)
    expect(translator.has("boo")).toBe(false)
    expect(translator.has("foo", { language: "de" })).toBe(false)
    expect(translator.has("boo", { language: "de" })).toBe(true)
    expect(
      translator.has("foo", { language: "de", fallbackLanguage: "en" })
    ).toBe(true)
    expect(translator.has("boo", { fallbackLanguage: "de" })).toBe(true)
  })

  it("returns placeholder if translation is missing", () => {
    const translator = new Translator(
      { en: { foo: "bar" } },
      { language: "en" }
    )

    expect(translator.get("bar.baz")).toBe("{ en.bar.baz }")
  })

  it("returns placeholder if translation is missing using a custom missing key formatter", () => {
    const translator = new Translator(
      { en: { foo: "bar" } },
      {
        language: "en",
        placeholder: (language, key, replacements) =>
          `${language}${key}${JSON.stringify(replacements)}`,
      }
    )

    expect(translator.get("bar.baz", { replace: { foo: "bar" } })).toBe(
      `enbar.baz{"foo":"bar"}`
    )
  })

  it("uses fallback language", () => {
    const translator = new Translator(
      { en: { foo: "baz" }, de: { foo: "bar" } },
      { language: "ru", fallbackLanguage: "de" }
    )

    expect(translator.get("foo")).toBe("bar")
    expect(translator.get("foo", { language: "xx" })).toBe("bar")
    expect(
      translator.get("foo", { language: "xx", fallbackLanguage: "en" })
    ).toBe("baz")
    expect(translator.get("foo", { fallbackLanguage: "en" })).toBe("baz")
  })

  it("gets and sets fallback langauge", () => {
    const translator = new Translator(
      {},
      { language: "en", fallbackLanguage: "de" }
    )

    expect(translator.getFallbackLanguage()).toBe("de")

    translator.setFallbackLanguage("ru")

    expect(translator.getFallbackLanguage()).toBe("ru")
  })

  it("allows to disable interpolation", () => {
    const translator = new Translator(
      { en: { foo: "baz {{1}}" } },
      { language: "en", interpolate: false }
    )

    expect(translator.get("foo", { replace: ["bar"] })).toBe("baz {{1}}")
  })

  it("gets and set translations", () => {
    const translator = new Translator(
      { en: { boo: "bar" } },
      { language: "en" }
    )

    expect(translator.getTranslations()).toEqual({ en: { boo: "bar" } })
    expect(translator.getTranslationsForLanguage("en")).toEqual({ boo: "bar" })

    translator.addTranslations({ en: { foo: "bar" } })

    expect(translator.getTranslations()).toEqual({
      en: { boo: "bar", foo: "bar" },
    })

    translator.addTranslationsForLanguage("de", { yolo: "swag" })

    expect(translator.getTranslations()).toEqual({
      en: { boo: "bar", foo: "bar" },
      de: { yolo: "swag" },
    })

    translator.addTranslationsForLanguage("de", { foo: "baz" })

    expect(translator.getTranslations()).toEqual({
      en: { boo: "bar", foo: "bar" },
      de: { yolo: "swag", foo: "baz" },
    })

    translator.setTranslations({ en: { foo: "bar" }, de: { yolo: "swag" } })

    expect(translator.getTranslations()).toEqual({
      en: { foo: "bar" },
      de: { yolo: "swag" },
    })

    translator.setTranslationsForLanguage("de", { ding: "dong" })

    expect(translator.getTranslations()).toEqual({
      en: { foo: "bar" },
      de: { ding: "dong" },
    })
  })

  it("gets languages", () => {
    const translator = new Translator(
      { en: { foo: "bar" }, de: { yolo: "swag" } },
      { language: "en" }
    )

    expect(translator.getLanguages()).toEqual(["en", "de"])
  })

  it("listens", () => {
    const translator = new Translator(
      { en: { foo: "bar", yolo: { swag: "baz" } } },
      { language: "en", debounceChanges: 0 }
    )
    const callback = jest.fn()

    const unsubscribe = translator.listen(callback)

    expect(callback).toHaveBeenCalledTimes(0)

    translator.setLanguage("de")
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(translator)

    translator.setTranslations({ en: { foo: "bar", yolo: { swag: "bar" } } })
    expect(callback).toHaveBeenCalledTimes(2)

    translator.addTranslations({ en: { key: "value" } })
    expect(callback).toHaveBeenCalledTimes(3)

    translator.addTranslations({ en: { foo: "bar" } })
    expect(callback).toHaveBeenCalledTimes(3)

    unsubscribe()

    translator.setLanguage("en")
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it("listens immediately", () => {
    const translator = new Translator(
      { en: { foo: "bar", yolo: { swag: "baz" } } },
      { language: "en", debounceChanges: 0 }
    )
    const callback = jest.fn()

    translator.listen(callback, { immediate: true })

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenCalledWith(translator)
  })

  it("creates translate function", () => {
    const translator = new Translator(
      { en: { foo: "bar", yolo: { swag: "baz" } }, de: { bar: "foo" } },
      { language: "en" }
    )
    const t1 = translator.t()

    expect(t1("foo")).toBe("bar")
    expect(t1("bar")).toBe("{ en.bar }")
    expect(t1("bar", { language: "de" })).toBe("foo")
    expect(t1("bar", { fallbackLanguage: "de" })).toBe("foo")

    const t2 = translator.t({ scope: "yolo" })

    expect(t2("swag")).toBe("baz")
    expect(t2("~foo")).toBe("bar")
    expect(t2("~yolo.swag")).toBe("baz")

    const t3 = translator.t({ language: "de" })

    expect(t3("bar")).toBe("foo")

    const t4 = translator.t({ fallbackLanguage: "de" })

    expect(t4("bar")).toBe("foo")
  })

  it("gets and sets formatter", () => {
    const translator = new Translator({}, { language: "en" })
    const formatter: any = () => null

    expect(translator.getFormatter() === formatter).toBe(false)

    translator.setFormatter(formatter)

    expect(translator.getFormatter() === formatter).toBe(true)
  })

  it("gets and sets interpolator", () => {
    const translator = new Translator({}, { language: "en" })
    const interpolator: any = () => null

    expect(translator.getInterpolator() === interpolator).toBe(false)

    translator.setInterpolator(interpolator)

    expect(translator.getInterpolator() === interpolator).toBe(true)
  })

  it("takes config", () => {
    const translator = new Translator({}, { language: "en" })
    const language = "foo"
    const fallbackLanguage = "bar"
    const interpolate = false
    const interpolator: any = () => null
    const formatter: any = () => null
    const placeholder: any = () => null

    translator.config({
      language,
      fallbackLanguage,
      interpolate,
      interpolator,
      formatter,
      placeholder,
    } as any)

    expect(translator.getLanguage()).toBe(language)
    expect(translator.getFallbackLanguage()).toBe(fallbackLanguage)
    expect(translator.configuration.get().interpolate).toBe(interpolate)
    expect(translator.getInterpolator() === interpolator).toBe(true)
    expect(translator.getFormatter() === formatter).toBe(true)
    expect(translator.configuration.get().placeholder === placeholder).toBe(
      true
    )
  })

  it("can disable interpolation at runtime", () => {
    const translator = new Translator(
      { en: { foo: "foo {{1}}" } },
      { language: "en" }
    )

    expect(
      translator.get("foo", { replace: ["bar"], interpolate: false })
    ).toBe("foo {{1}}")
    expect(translator.get("foo", { replace: ["bar"], interpolate: true })).toBe(
      "foo bar"
    )

    const t1 = translator.t()
    expect(t1("foo", { replace: ["bar"] })).toBe("foo bar")
    expect(t1("foo", { replace: ["bar"], interpolate: false })).toBe(
      "foo {{1}}"
    )

    const t2 = translator.t({ interpolate: false })

    expect(t2("foo", { replace: ["bar"] })).toBe("foo {{1}}")
    expect(t2("foo", { replace: ["bar"], interpolate: true })).toBe("foo bar")
  })

  it("can replace formatter at runtime", () => {
    const translator = new Translator(
      { en: { foo: "foo {{1}}" } },
      { language: "en" }
    )
    const formatter: TranslatorFormatter = (
      language,
      replacement,
      replacements
    ) => "foo"

    expect(translator.get("foo", { replace: ["bar"], formatter })).toBe(
      "foo foo"
    )

    const t1 = translator.t()

    expect(t1("foo", { replace: ["bar"] })).toBe("foo bar")
    expect(t1("foo", { replace: ["bar"], formatter })).toBe("foo foo")

    const t2 = translator.t({ formatter })

    expect(t2("foo", { replace: ["bar"] })).toBe("foo foo")
  })

  it("can replace interpolator at runtime", () => {
    const translator = new Translator(
      { en: { foo: "foo @1" } },
      { language: "en" }
    )
    const interpolator: TranslatorInterpolator = (text, match, replacement) =>
      text.replace(`@${match}`, replacement)

    expect(translator.get("foo", { replace: ["bar"], interpolator })).toBe(
      "foo bar"
    )

    const t1 = translator.t()

    expect(t1("foo", { replace: ["bar"] })).toBe("foo @1")
    expect(t1("foo", { replace: ["bar"], interpolator })).toBe("foo bar")

    const t2 = translator.t({ interpolator })

    expect(t2("foo", { replace: ["bar"] })).toBe("foo bar")
  })

  it("debounces changes", async () => {
    const translator = new Translator(
      {},
      { language: "en", debounceChanges: 20 }
    )

    expect(
      new Translator({}, { language: "en" }).configuration.get().debounceChanges
    ).toBe(10)
    expect(translator.configuration.get().debounceChanges).toBe(20)

    const listener = jest.fn()
    const unsubscribe = translator.listen(listener, { immediate: true })

    expect(listener).toHaveBeenCalledTimes(0)

    await createTimeout(20)

    expect(listener).toHaveBeenCalledTimes(1)

    translator.setLanguage("de")

    expect(listener).toHaveBeenCalledTimes(1)

    await createTimeout(20)

    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()

    translator.setLanguage("ru")

    expect(listener).toHaveBeenCalledTimes(2)

    await createTimeout(20)

    expect(listener).toHaveBeenCalledTimes(2)
  })
})
