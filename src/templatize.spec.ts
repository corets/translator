import { templatize } from "./index"

describe("templatize", () => {
  it("templatizes simple values", () => {
    expect(templatize("foo $1 bar $2 $1", ["a", 1])).toBe("foo a bar 1 a")
  })

  it("templatizes arrays", () => {
    expect(templatize("foo $1", [["a", "b"]])).toBe(`foo ["a","b"]`)
  })

  it("templatizes objects", () => {
    expect(templatize("foo $1", [{ foo: "bar" }])).toBe(`foo {"foo":"bar"}`)
  })
})
