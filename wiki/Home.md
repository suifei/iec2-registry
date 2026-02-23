# IECC2 — IEC 61131-3 PLC 开发工具链

欢迎来到 **IECC2** 项目 Wiki。IECC2 是使用 Go 编写的完整、自主开发的 IEC 61131-3 合规 PLC 开发工具链，可将结构化文本（ST）、指令表（IL）和 SFC 编译为 ANSI C、LLVM IR 或 WebAssembly。

## 功能特性

- **IEC 61131-3:2013 Ed3 合规** — 结构化文本、指令表、SFC
- **OOP 支持** — 类、接口、方法、属性、继承
- **三种后端** — ANSI C（默认）、LLVM IR（带 DWARF 调试）、WebAssembly
- **OPC UA** — NodeSet2 XML 导出
- **并行编译** — 多文件项目，`-j N` 并行工作进程
- **增量构建** — 基于缓存跳过未修改文件
- **PGO** — 基于配置文件的优化
- **VS Code 扩展** — 可视化 FBD/LD/SFC 编辑器、LSP 智能提示、DAP 调试

## 快速导航

### 入门教程（从零开始）

1. **[开箱即用 — 安装与快速上手](开箱即用-—-安装与快速上手.md)** — 安装 VS Code 扩展，零配置即用
2. **[第一个 PLC 项目](第一个-PLC-项目.md)** — 编写 ST 程序、编译、工程结构
3. **[调试与仿真](调试与仿真.md)** — VPLC 虚拟 PLC、DAP 调试、在线监控
4. **[高级开发](高级开发.md)** — FBD/LD/SFC 图形化编程、库管理、HMI 设计
5. **[工业化部署架构方案](工业化部署架构方案.md)** — 单机到千台集群、批量下发、数据同步

### 参考文档

- **[架构设计](架构设计.md)** — 编译流水线、包结构、运行时架构
- **[语言参考](语言参考.md)** — IEC 61131-3 数据类型、POU、控制结构、运算符
- **[快速入门（CLI）](快速入门（CLI）.md)** — 命令行工具用法速查

## 架构概览

```
Source (.st/.il) → Lexer → Parser → AST → Semantic → IR → Optimization → CodeGen
                                                                            ├── ANSI C
                                                                            ├── LLVM IR
                                                                            └── WebAssembly
```

## 与 CODESYS 的对照

| CODESYS 概念 | IECC2 对应 |
|--------------|------------|
| CODESYS IDE | VS Code + IEC 61131-3 PLC IDE 扩展 |
| CODESYS Gateway | iec-gateway 网关服务 |
| CODESYS Runtime | iec-vplc 虚拟 PLC / SoftPLC 运行时 |
| CODESYS 在线监控 | Monitor / Variable Table / Trace 面板 |
| CODESYS 库管理器 | Library Manager 面板 |
| CODESYS Visualization | HMI Designer 面板 |

## 项目信息

- **许可证**：MIT
- **语言**：Go（编译器/后端）、TypeScript（VS Code 扩展）
- **仓库**：[github.com/suifei/iec2](https://github.com/suifei/iec2)
