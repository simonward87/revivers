"use strict";

/**
 * regexDateTime is for validating date time strings. It is declared in the outer scope so it doesn't need to be initialized on every call to the reviver
 */
export const regexDateTime =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

/**
 * dateTime generates a reviver function, used to transform date time strings into Date objects during JSON parsing. This allows them to be easily formatted or manipulated as required, with suitable timezone adjustment for the client. It takes the keys to values which contain date time strings. If no keys are passed, EVERY value will be checked against the regexp in an attempt to deduce which values should be transformed. This can inhibit performance when operating on large JSON objects.
 *
 * Date time string format:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 * @param {string[]} keys - Zero or more object keys for identifying values to transform
 */
export function dateTime(...keys) {
  /**
   * @template T
   * @param {string} key - Object key
   * @param {T} value - Value associated with given object key
   */
  return (key, value) => {
    if (
      (keys.includes(key) || keys.length === 0) &&
      typeof value === "string" &&
      value.match(regexDateTime)
    ) {
      return new Date(value);
    }
    return value;
  };
}

/**
 * GBP generates a reviver function used to transform integers into GBP currency strings during JSON parsing. Values must be between 0 and MAX_SAFE_INTEGER (inclusive). It takes the keys to values that represent an amount in pennies. If no keys are passed, no values will be transformed.
 * @param {string[]} keys - Zero or more object keys for identifying values to transform
 */
export function GBP(...keys) {
  /**
   * @template T
   * @param {string} key - Object key
   * @param {T} value - Value associated with given object key
   */
  return (key, value) => {
    //        999_999_999_99
    // 90_071_992_547_409_91

    if (
      keys.includes(key) &&
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= Number.MAX_SAFE_INTEGER
    ) {
      return formatGBP(value);
    }
    return value;
  };
}

/**
 * TODO: document
 * @param {number} value - Integer between 0 and 99,999,999,999 that represents a value in pennies
 */
function formatGBP(value) {
  const v = value.toString();
  const len = v.length;

  if (len === 1) {
    return `£0.0${v}`;
  } else if (len === 2) {
    return `£0.${v}`;
  } else if (len === 3) {
    return `£${v[0]}.${v.slice(1)}`;
  } else if (len < 6) {
    return `£${v.slice(0, len - 2)}.${v.slice(len - 2)}`;
  } else if (len < 9) {
    return `£${v.slice(0, len - 5)},${v.slice(len - 5, len - 2)}.${v.slice(len - 2)}`;
  } else if (len < 12) {
    return `£${v.slice(0, len - 8)},${v.slice(len - 8, len - 5)},${v.slice(len - 5, len - 2)}.${v.slice(len - 2)}`;
  } else if (len < 15) {
    return `£${v.slice(0, len - 11)},${v.slice(len - 11, len - 8)},${v.slice(len - 8, len - 5)},${v.slice(len - 5, len - 2)}.${v.slice(len - 2)}`;
  } else {
    return `£${v.slice(0, len - 14)},${v.slice(len - 13, len - 11)},${v.slice(len - 11, len - 8)},${v.slice(len - 8, len - 5)},${v.slice(len - 5, len - 2)}.${v.slice(len - 2)}`;
  }
}
