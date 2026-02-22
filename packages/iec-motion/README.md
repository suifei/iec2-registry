# iec-motion — PLCopen Motion Control Library

PLCopen-compatible motion control function blocks for servo and drive systems.

## Function Blocks

| Name | Description |
|------|-------------|
| `AXIS_REF` | Axis reference data structure |
| `MC_POWER` | Enable/disable axis power |
| `MC_MOVE_ABSOLUTE` | Move to absolute position |
| `MC_MOVE_RELATIVE` | Move relative distance |
| `MC_STOP` | Stop axis motion |
| `MC_HOME` | Execute homing sequence |

## Usage Example

```iecst
VAR
    axis1  : AXIS_REF;
    power  : MC_POWER;
    moveAbs : MC_MOVE_ABSOLUTE;
END_VAR

power(Axis := axis1, Enable := TRUE);

IF power.Status THEN
    moveAbs(
        Axis := axis1,
        Execute := TRUE,
        Position := 1000.0,
        Velocity := 500.0,
        Acceleration := 2000.0
    );
END_IF;
```

## License

MIT
