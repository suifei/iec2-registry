# iec-datalog — Data Logging Library

Data recording and analysis function blocks for industrial data management.

## Function Blocks

| Name | Description |
|------|-------------|
| `DATA_LOGGER` | Periodic data logger with configurable interval |
| `CSV_WRITER` | Write multi-channel data to CSV format |
| `RING_BUFFER` | 256-entry circular LREAL buffer |
| `TREND_RECORDER` | Multi-channel trend recording |
| `EVENT_LOGGER` | Event and alarm logging with timestamps |

## Usage Example

```iecst
VAR
    csv : CSV_WRITER;
END_VAR

csv(
    ENABLE := TRUE,
    CH1 := temperature,
    CH2 := pressure,
    CH3 := flowRate,
    INTERVAL_MS := 1000
);
```

## License

MIT
