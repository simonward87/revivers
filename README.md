# JSON Parser Reviver Generators

A small collection of reviver function generators for transforming data during calls to `JSON.parse`.

## `dateTime()`

Generates a reviver function used to transform [date time strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format) into [Date objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) during parsing. This allows them to be easily formatted or manipulated as required, with suitable timezone adjustment for the client. It takes the keys to values which contain date time strings. If no keys are passed, **every** value will be checked against the regexp in an attempt to deduce which values should be transformed. This can inhibit performance when operating on large JSON objects.

## `GBP()`

Generates a reviver function used to transform integers into GBP currency strings during parsing. Values must be between 0 and [MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) (inclusive). It takes the keys to values that represent an amount in pennies. If no keys are passed, no values will be transformed.
