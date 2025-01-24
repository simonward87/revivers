import assert from "node:assert";
import { describe, it } from "node:test";

import { dateTime, GBP } from "../revivers.js";

describe("dateTime()", () => {
  const json = `{"activated":true,"admin":false,"created":"2025-01-22T09:37:40.994Z","email":"example@email.com","firstName":"first","userId":975,"lastName":"last","modified":"2025-01-22T09:37:40.994Z","telephone":"07123456789","verified":false}`;

  it("should use key args to parse values to Date objects", () => {
    const { created, modified } = JSON.parse(
      json,
      dateTime("created", "modified"),
    );
    assert.doesNotThrow(() => {
      if (!(created instanceof Date) || !(modified instanceof Date)) {
        throw new Error("Defined keys transform failed!");
      }
    });
  });

  it("should parse date time string values to Date objects", () => {
    const { created, modified } = JSON.parse(json, dateTime());
    assert.doesNotThrow(() => {
      if (!(created instanceof Date) || !(modified instanceof Date)) {
        throw new Error("Undefined keys transform failed!");
      }
    });
  });

  it("should have no effect on values that aren't date time strings", () => {
    const customUser = JSON.parse(json, dateTime("created", "modified"));
    const user = JSON.parse(json);

    assert.doesNotThrow(() => {
      delete customUser.created;
      delete customUser.modified;
      delete user.created;
      delete user.modified;

      for (const key in user) {
        if (customUser[key] !== user[key]) {
          throw new Error(
            `Unexpected transform! customUser.${key}=${customUser[key]} user.${key}=${user[key]}`,
          );
        }
      }
    });
  });
});

describe("GBP()", () => {
  const regexGBP = /^£(\d{1,3},?){1,5}\.\d{2}$/;

  it("should use key args to parse values to GBP strings", () => {
    const json = `[{"id":1,"title":"product name","price":5},{"id":2,"title":"product name","price":99},{"id":3,"title":"product name","price":999},{"id":4,"title":"product name","price":499900},{"id":5,"title":"product name","price":49999900},{"id":6,"title":"product name","price":49999999900},{"id":7,"title":"product name","price":49999999999900},{"id":8,"title":"product name","price":9007199254740991}]`;
    const products = JSON.parse(json, GBP("price"));
    for (const { price } of products) {
      assert.doesNotThrow(() => {
        if (!price.match(regexGBP)) {
          throw new Error(`Transform failed! Got ${price}`);
        }
      });
    }
  });

  it("should have no effect on values outside of allowed range", () => {
    const json = `[{"id":1,"title":"product name","price":-1500},{"id":2,"title":"product name","price":${Number.MAX_SAFE_INTEGER + 1}}]`;
    const products = JSON.parse(json, GBP("price"));
    for (const { price } of products) {
      assert.doesNotThrow(() => {
        if (typeof price === "string") {
          throw new Error(`Unexpected transform!`);
        }
      });
    }
  });
});
