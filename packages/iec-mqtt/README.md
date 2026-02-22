# iec-mqtt — MQTT Client Library

Lightweight MQTT 3.1.1 client for IoT and cloud integration.

## Function Blocks

| Name | Description |
|------|-------------|
| `MQTT_CLIENT` | Establish MQTT broker connection |
| `MQTT_PUBLISH` | Publish message to a topic |
| `MQTT_SUBSCRIBE` | Subscribe to a topic |
| `MQTT_JSON_PUBLISH` | Publish key-value pairs as JSON |

## Usage Example

```iecst
VAR
    client : MQTT_CLIENT;
    pub    : MQTT_PUBLISH;
END_VAR

client(CONNECT := TRUE, BROKER := '192.168.1.50', PORT := 1883, CLIENT_ID := 'plc01');

IF client.CONNECTED THEN
    pub(EXECUTE := TRUE, CLIENT_ID_REF := client.CLIENT_REF,
        TOPIC := 'factory/line1/temp', PAYLOAD := '25.3', QOS := 1);
END_IF;
```

## License

MIT
