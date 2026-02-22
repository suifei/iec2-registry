# iec-canopen — CANopen Protocol Library

CANopen communication over Linux SocketCAN for fieldbus automation.

## Function Blocks

| Name | Description |
|------|-------------|
| `CANOPEN_MASTER` | CANopen NMT network management master |
| `CANOPEN_NMT_SEND` | Send NMT commands (start/stop/reset) |
| `CANOPEN_SDO_READ` | SDO expedited upload (read object dictionary) |
| `CANOPEN_SDO_WRITE` | SDO expedited download (write object dictionary) |
| `CANOPEN_PDO_MAP` | Configure and exchange PDO process data |

## Usage Example

```iecst
VAR
    master : CANOPEN_MASTER;
    sdo    : CANOPEN_SDO_READ;
END_VAR

master(ENABLE := TRUE, INTERFACE := 'can0', BITRATE := 250000);

IF master.ACTIVE THEN
    sdo(EXECUTE := TRUE, NODE_ID := 5, INDEX := 16#6041, SUBINDEX := 0);
END_IF;
```

## License

MIT
