import { formatIsoDuration, numberToIsoDuration } from "./index";

describe("formatIsoDuration", () => {
  it("should format a full ISO duration", () => {
    expect(formatIsoDuration("PT1H30M")).toBe("1h 30m");
  });

  it("should format duration with only hours", () => {
    expect(formatIsoDuration("PT2H")).toBe("2h 00m");
  });

  it("should format duration with only minutes", () => {
    expect(formatIsoDuration("PT45M")).toBe("0h 45m");
  });

  it("should pad single digit minutes", () => {
    expect(formatIsoDuration("PT1H5M")).toBe("1h 05m");
  });

  it("should handle empty or invalid duration", () => {
    expect(formatIsoDuration("")).toBe("");
    expect(formatIsoDuration("1H30M")).toBe("1H30M");
  });

  it("should handle PT only", () => {
    expect(formatIsoDuration("PT")).toBe("0h 00m");
  });
});

describe("numberToIsoDuration", () => {
  it("should convert integer to ISO duration", () => {
    expect(numberToIsoDuration(2)).toBe("PT2H");
  });

  it("should convert decimal with fraction >= 0.6 (treating as decimal hours)", () => {
    expect(numberToIsoDuration(1.75)).toBe("PT1H45M");
    expect(numberToIsoDuration(1.6)).toBe("PT1H36M");
  });

  it("should convert decimal with fraction < 0.6 (treating as direct minutes)", () => {
    expect(numberToIsoDuration(1.5)).toBe("PT1H50M");
    expect(numberToIsoDuration(1.15)).toBe("PT1H15M");
  });
});
