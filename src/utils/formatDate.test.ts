import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats ISO date string to readable month and day", () => {
    expect(formatDate("2024-01-20T12:00:00.000Z")).toBe("January 20");
  });

  it("formats another date correctly", () => {
    expect(formatDate("2024-12-29T00:00:00.000Z")).toBe("December 29");
  });
});
