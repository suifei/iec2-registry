# IECC2 快速入门指南

## 安装

```bash
# 从源码编译
git clone https://github.com/suifei/iec2.git
cd iec2
make build

# 或下载预编译二进制
# 见 GitHub Releases: https://github.com/suifei/iec2/releases
```

## 5 分钟上手

### 1. 编写第一个 ST 程序

创建 `hello.st`:

```iec
PROGRAM Main
VAR
    counter : INT := 0;
END_VAR
    counter := counter + 1;
    IF counter >= 100 THEN
        counter := 0;
    END_IF;
END_PROGRAM
```

### 2. 编译为 C 代码

```bash
iecc -o hello.c hello.st
```

### 3. 用 GCC 编译并运行

```bash
gcc -o hello hello.c -I runtime/include
./hello
```

### 4. 使用仿真器

```bash
iec-sim -cycle 100 -vars hello.st
```

### 5. VS Code 扩展

1. 安装 `IEC 61131-3 PLC IDE` 扩展
2. 打开 `.st` 文件
3. 享受语法高亮、补全、悬停提示

## 编译选项

| 选项 | 说明 |
|------|------|
| `iecc -o out.c input.st` | 编译为 ANSI C |
| `iecc -emit-llvm input.st` | 输出 LLVM IR |
| `iecc -emit-wasm input.st` | 输出 WebAssembly |
| `iecc -main -o out.c input.st` | 生成包含 main() 的可执行 C |

## 仿真选项

| 选项 | 说明 |
|------|------|
| `iec-sim -cycle 100 file.st` | 设置扫描周期 100ms |
| `iec-sim -max-cycles 1000` | 限制最大周期数 |
| `iec-sim -vars` | 每周期打印变量 |
| `iec-sim -ws 8080` | 启动 WebSocket 监控 |
| `iec-sim -entry Main__body` | 指定入口函数 |

## 示例工程

在 VS Code 中运行命令 **IEC: Create Demo Project** 即可一键创建完整的演示工程，
包含 PID 控制、电机状态机、报警处理、全局变量、FBD/LD/SFC 图形化编程和 HMI 画面。

## 支持的语言

| 语言 | 支持状态 |
|------|---------|
| Structured Text (ST) | ✅ 完整 |
| Instruction List (IL) | ✅ 基本 |
| Sequential Function Chart (SFC) | ✅ 基本 |
| Function Block Diagram (FBD) | 🔜 规划中 |
| Ladder Diagram (LD) | 🔜 规划中 |

## 运行时架构

```
┌──────────────┐
│  IEC ST/IL   │
│  Source Code  │
└──────┬───────┘
       │ iecc
       ▼
┌──────────────┐    ┌──────────────┐
│   ANSI C     │───▶│  iec_runtime │
│  (generated) │    │  (libiec)    │
└──────┬───────┘    └──────────────┘
       │ gcc              │
       ▼                  │
┌──────────────┐          │
│   Native     │◀─────────┘
│   Binary     │
└──────────────┘
```

## 更多文档

- [语言参考](语言参考.md)
- [架构设计](架构设计.md)
