# iec-math-ext — Extended Mathematics Library

Advanced math functions for signal processing, filtering, and numerical computation.

## Function Blocks & Functions

| Name | Type | Description |
|------|------|-------------|
| `MOVING_AVG` | FB | Moving average filter (configurable window) |
| `LOW_PASS_FILTER` | FB | First-order IIR low-pass filter |
| `HIGH_PASS_FILTER` | FB | First-order IIR high-pass filter |
| `LINEAR_INTERP` | FC | Linear interpolation between two points |
| `LOOKUP_TABLE` | FB | 1-D lookup table with linear interpolation |
| `STATISTICS` | FB | Statistical aggregator (mean, min, max, variance) |
| `MATRIX_MUL` | FB | 4x4 matrix multiplication |
| `CRC16` | FC | CRC-16 (Modbus polynomial) |
| `CRC32` | FC | CRC-32 |

## Usage Example

```iecst
VAR
    lpf : LOW_PASS_FILTER;
    filtered : LREAL;
END_VAR

lpf(INPUT := sensorValue, ALPHA := 0.1, DT := 0.01);
filtered := lpf.OUTPUT;
```

## License

MIT
