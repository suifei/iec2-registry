# iec-string-ext — Extended String Library

Comprehensive string manipulation functions beyond the IEC 61131-3 standard set.

## Functions

| Name | Description |
|------|-------------|
| `TO_UPPER` | Convert string to uppercase |
| `TO_LOWER` | Convert string to lowercase |
| `TRIM` | Remove leading and trailing whitespace |
| `LTRIM` | Remove leading whitespace |
| `RTRIM` | Remove trailing whitespace |
| `STARTS_WITH` | Check if string starts with a prefix |
| `ENDS_WITH` | Check if string ends with a suffix |
| `CONTAINS` | Check if string contains a substring |
| `SPLIT` | Split string by delimiter |
| `REPLACE_ALL` | Replace all occurrences of a substring |
| `FORMAT_INT` | Format integer to string with width/padding |
| `FORMAT_REAL` | Format real number to string with precision |

## Usage Example

```iecst
VAR
    input  : STRING := '  Hello, World!  ';
    result : STRING;
    found  : BOOL;
END_VAR

result := TRIM(input);           // 'Hello, World!'
result := TO_UPPER(result);      // 'HELLO, WORLD!'
found  := CONTAINS(result, 'WORLD');  // TRUE
result := REPLACE_ALL(result, 'WORLD', 'PLC');  // 'HELLO, PLC!'
```

## License

MIT
