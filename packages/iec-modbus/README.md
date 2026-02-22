# iec-modbus — Modbus TCP/RTU Library

Industrial Modbus communication for TCP and serial RTU connections.

## Function Blocks

| Name | Description |
|------|-------------|
| `MODBUS_TCP_CLIENT` | Establish Modbus TCP connection |
| `MODBUS_READ_REGISTERS` | Read holding registers (FC03) |
| `MODBUS_WRITE_REGISTER` | Write single register (FC06) |
| `MODBUS_READ_COILS` | Read coils (FC01) |
| `MODBUS_WRITE_COIL` | Write single coil (FC05) |
| `MODBUS_WRITE_MULTIPLE_COILS` | Write multiple coils (FC15) |
| `MODBUS_RTU_CLIENT` | Modbus RTU over serial port (RS-232/RS-485) |

## Usage Example

```iecst
VAR
    mbClient : MODBUS_TCP_CLIENT;
    mbRead   : MODBUS_READ_REGISTERS;
    values   : ARRAY[0..9] OF INT;
END_VAR

mbClient(CONNECT := TRUE, IP_ADDRESS := '192.168.1.100', PORT := 502, UNIT_ID := 1);

IF mbClient.CONNECTED THEN
    mbRead(
        EXECUTE := TRUE,
        HANDLE := mbClient.HANDLE,
        START_ADDRESS := 0,
        QUANTITY := 10
    );
    IF mbRead.DONE THEN
        values := mbRead.DATA;
    END_IF;
END_IF;
```

## License

MIT
