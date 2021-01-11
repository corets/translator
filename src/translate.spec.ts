import { translate } from "./index"

describe("translate", () => {
  it("translates", () => {
    expect(translate({ en: { foo: "bar $1" } }, "en", "foo", ["a"])).toBe(
      "bar a"
    )
  })

  it("returns placeholder if translation is missing", () => {
    expect(translate({ en: { foo: "bar $1" } }, "en", "bar.baz", ["a"])).toBe(
      "{ en.bar.baz }"
    )
  })

  it("it uses fallback language", () => {
    expect(
      translate(
        { en: { boo: "bar $1" }, de: { foo: "baz $1" } },
        "en",
        "foo",
        ["a"],
        "de"
      )
    ).toBe("baz a")
  })
})
