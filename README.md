**English** | [中文](README.zh-cn.md) | [Deutsch](README.de.md) | [日本語](README.ja.md)

# IEC2 Component Registry

Public component registry for the [IECC2 PLC development toolchain](https://github.com/suifei/iec2).

Browse the online catalog at **[suifei.github.io/iec2-registry](https://suifei.github.io/iec2-registry/)**.

## Available Packages

| Package | Category | Description |
|---------|----------|-------------|
| `iec-pid` | Control | PID, PID_COMPACT, PID_AUTOTUNE, RAMP, HYSTERESIS, DEADBAND, SCALING |
| `iec-modbus` | Protocol | Modbus TCP/RTU client, register/coil read/write |
| `iec-mqtt` | Protocol | MQTT 3.1.1 client, publish, subscribe, JSON publish |
| `iec-s7comm` | Protocol | Siemens S7 communication, DB read/write, area read |
| `iec-canopen` | Protocol | CANopen NMT master, SDO read/write, PDO mapping |
| `iec-safety` | Safety | E-Stop, safety door, two-hand, muting, safe speed, watchdog |
| `iec-datalog` | Utility | Data logger, CSV writer, ring buffer, trend recorder |
| `iec-math-ext` | Math | Filters, interpolation, statistics, matrix, CRC |
| `iec-string-ext` | Utility | String manipulation — trim, case, split, format |
| `iec-motion` | Motion | PLCopen MC_POWER, MC_MOVE_ABSOLUTE, MC_STOP, MC_HOME |

## Install from VS Code

1. Open **IEC Library Manager** panel (`Ctrl+Shift+P` → `IEC: Manage Libraries`)
2. Switch to the **Online** tab
3. Search for a package, then click **Install**

Or install via the command palette:

```
IEC: Install Library → iec-pid
```

## Package Format (.ieclib)

Each package is a ZIP archive with the following structure:

```
my-package.ieclib
├── manifest.json       # Package metadata
├── src/
│   └── *.st            # IEC 61131-3 Structured Text sources
└── doc/
    └── README.md       # Optional documentation
```

### manifest.json

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Package description",
  "link_type": "source",
  "exports": [
    { "name": "MY_FB", "kind": "FUNCTION_BLOCK", "signature": "MY_FB(IN1: BOOL, IN2: REAL) : REAL" }
  ],
  "dependencies": [
    { "name": "iec-pid", "version": ">=1.0.0" }
  ],
  "platforms": ["any"]
}
```

## Contributing a Package

1. Fork this repository
2. Create `packages/<your-package>/` with:
   - `metadata.json` — package metadata
   - `<your-package>-<version>.ieclib` — the package archive
   - `README.md` — documentation
3. Submit a Pull Request
4. CI will automatically validate the package format
5. Once merged, the package appears in the online registry

## Registry API

The registry is served as static JSON files:

- **Package index**: `https://suifei.github.io/iec2-registry/registry.json`
- **Categories**: `https://suifei.github.io/iec2-registry/categories.json`
- **Package download**: `https://suifei.github.io/iec2-registry/packages/<name>/<name>-<version>.ieclib`
- **Package metadata**: `https://suifei.github.io/iec2-registry/packages/<name>/metadata.json`

## License

MIT
