# iec-safety — Safety Function Blocks

Safety-related function blocks following IEC 61508 / IEC 62061 principles.

## Function Blocks

| Name | Description |
|------|-------------|
| `ESTOP_MONITOR` | Emergency stop monitoring with dual-channel input |
| `SAFETY_DOOR` | Safety door interlock with guard locking |
| `TWO_HAND` | Two-hand control requiring simultaneous operation |
| `MUTING` | Light curtain muting for automated material flow |
| `SAFE_SPEED` | Speed monitoring against safety limits |
| `WATCHDOG` | Software watchdog timer with timeout detection |

## Usage Example

```iecst
VAR
    estop : ESTOP_MONITOR;
    safeOutput : BOOL;
END_VAR

estop(
    ACTIVATE := TRUE,
    S_ESTOP_IN := estopButton1 AND estopButton2,
    S_AUTO_RESET := FALSE,
    S_RESET := resetButton
);
safeOutput := estop.S_ESTOP_OUT;
```

## License

MIT
