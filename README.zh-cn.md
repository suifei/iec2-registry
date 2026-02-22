[English](README.md) | **中文** | [Deutsch](README.de.md) | [日本語](README.ja.md)

# IEC2 组件注册表

[IECC2 PLC 开发工具链](https://github.com/suifei/iec2) 的公共组件注册表。

在线目录请访问 **[suifei.github.io/iec2-registry](https://suifei.github.io/iec2-registry)**。

## 可用组件包

| Package | Category | Description |
|---------|----------|-------------|
| `iec-pid` | Control | PID、PID_COMPACT、PID_AUTOTUNE、RAMP、HYSTERESIS、DEADBAND、SCALING |
| `iec-modbus` | Protocol | Modbus TCP/RTU 客户端，寄存器/线圈读写 |
| `iec-mqtt` | Protocol | MQTT 3.1.1 客户端，发布、订阅、JSON 发布 |
| `iec-s7comm` | Protocol | 西门子 S7 通信，DB 读写、区域读取 |
| `iec-canopen` | Protocol | CANopen NMT 主站，SDO 读写，PDO 映射 |
| `iec-safety` | Safety | 急停、安全门、双手、静音、安全速度、看门狗 |
| `iec-datalog` | Utility | 数据记录器、CSV 写入、环形缓冲、趋势记录 |
| `iec-math-ext` | Math | 滤波器、插值、统计、矩阵、CRC |
| `iec-string-ext` | Utility | 字符串操作 — trim、大小写、split、format |
| `iec-motion` | Motion | PLCopen MC_POWER、MC_MOVE_ABSOLUTE、MC_STOP、MC_HOME |

## 从 VS Code 安装

1. 打开 **IEC Library Manager** 面板（`Ctrl+Shift+P` → `IEC: Manage Libraries`）
2. 切换到 **Online** 标签页
3. 搜索组件包，然后点击 **Install**

或通过命令面板安装：

```
IEC: Install Library → iec-pid
```

## 组件包格式 (.ieclib)

每个组件包是一个 ZIP 归档，结构如下：

```
my-package.ieclib
├── manifest.json       # 组件包元数据
├── src/
│   └── *.st            # IEC 61131-3 结构化文本源文件
└── doc/
    └── README.md       # 可选文档
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

## 贡献组件包

1. Fork 本仓库
2. 创建 `packages/<your-package>/`，包含：
   - `metadata.json` — 组件包元数据
   - `<your-package>-<version>.ieclib` — 组件包归档
   - `README.md` — 文档
3. 提交 Pull Request
4. CI 将自动验证组件包格式
5. 合并后，组件包将出现在在线注册表中

## 注册表 API

注册表以静态 JSON 文件形式提供：

- **组件包索引**：`https://suifei.github.io/iec2-registry/registry.json`
- **分类**：`https://suifei.github.io/iec2-registry/categories.json`
- **组件包下载**：`https://suifei.github.io/iec2-registry/packages/<name>/<name>-<version>.ieclib`
- **组件包元数据**：`https://suifei.github.io/iec2-registry/packages/<name>/metadata.json`

## License

MIT
