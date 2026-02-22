# iec-s7comm — Siemens S7 Communication Library

Communicate with Siemens S7-300/400/1200/1500 PLCs over ISO-on-TCP (RFC 1006).

## Function Blocks

| Name | Description |
|------|-------------|
| `S7_CLIENT` | Establish S7 protocol connection (TPKT + COTP + S7 Setup) |
| `S7_READ_DB` | Read data from a data block |
| `S7_WRITE_DB` | Write data to a data block |
| `S7_READ_AREA` | Read by area type (I/Q/M/DB/T/C) |

## Usage Example

```iecst
VAR
    s7 : S7_CLIENT;
    rd : S7_READ_DB;
END_VAR

s7(CONNECT := TRUE, IP_ADDRESS := '192.168.0.1', RACK := 0, SLOT := 1);

IF s7.CONNECTED THEN
    rd(EXECUTE := TRUE, CLIENT_REF := s7.CLIENT_REF,
       DB_NUMBER := 1, START_ADDR := 0, LENGTH := 10);
END_IF;
```

## License

MIT
