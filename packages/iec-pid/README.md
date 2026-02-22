# iec-pid — PID Control Library

Standard PID control function blocks for industrial process automation.

## Function Blocks

| Name | Description |
|------|-------------|
| `PID` | Standard PID controller with anti-windup and output clamping |
| `PID_COMPACT` | Simplified PID with fewer parameters |
| `PID_AUTOTUNE` | Automatic PID tuning using relay feedback (Astrom-Hagglund / Ziegler-Nichols) |
| `RAMP` | Linear ramp generator with configurable rate |
| `HYSTERESIS` | Hysteresis comparator with high/low thresholds |
| `DEADBAND` | Signal deadband — suppresses noise within a tolerance band |
| `SCALING` | Linear input/output scaling (raw -> engineering units) |

## Usage Example

```iecst
VAR
    myPID : PID;
    temperature : LREAL;
    heaterOutput : LREAL;
END_VAR

myPID(
    ENABLE := TRUE,
    SETPOINT := 75.0,
    PROCESS_VALUE := temperature,
    KP := 2.0,
    KI := 0.5,
    KD := 0.1,
    DT := 0.01,
    OUT_MIN := 0.0,
    OUT_MAX := 100.0
);
heaterOutput := myPID.OUTPUT;
```

## Auto-Tuning Example

```iecst
VAR
    tuner : PID_AUTOTUNE;
    myPID : PID;
END_VAR

tuner(
    ENABLE := TRUE,
    SETPOINT := 75.0,
    PROCESS_VALUE := temperature,
    RELAY_AMP := 10.0,
    DT := 0.01
);

IF tuner.DONE THEN
    myPID.KP := tuner.KP_RESULT;
    myPID.KI := tuner.KI_RESULT;
    myPID.KD := tuner.KD_RESULT;
END_IF;
```

## License

MIT
