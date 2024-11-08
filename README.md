# Clash-verge 使用记录

## Clash概念介绍

### 1. Clash

- **简介**：Clash 是一个开源的代理客户端，最早支持 Shadowsocks、Vmess、Socks5 等协议，主要用于在客户端和代理服务器之间进行安全流量代理。

- **配置文件格式**：Clash 使用 YAML 格式的配置文件，包含 `proxies`、`proxy-groups`、和 `rules` 等主要部分。

- 功能：

  - 支持常见的代理协议，如 Shadowsocks、VMess、Socks5。
  - 支持规则配置，可以根据流量类型和域名灵活设置路由策略。
  - 适合通用的客户端代理需求，但对一些高级功能（如负载均衡）的支持相对较弱。

### 2. Clash.Meta

- **简介**：Clash.Meta 是基于 Clash 的一个分支项目，旨在提供更强大的功能和性能优化。它兼容 Clash 的配置文件格式，并增加了许多新特性和高级功能。

- 扩展特性：

  - 支持更丰富的策略模式，如 `load-balance`（负载均衡）。
  - 增加了对流量代理的增强控制选项，比如对流量检测和速率的更精细的控制。
  
- **兼容性**：Clash.Meta 与原版 Clash 兼容，但在功能上更加丰富，适合有复杂代理需求的用户。

### 3. [MetaCubeX](https://wiki.metacubex.one/)

- **简介**：MetaCubeX 是一款基于 Clash.Meta 的工具，完全支持 Clash 和 Clash.Meta 配置文件，但它还额外提供了一些管理和优化功能。

- 特点：

  - 完全兼容 Clash 和 Clash.Meta 的配置格式，能直接使用 `.yaml` 配置文件。
  - 适合使用 Clash.Meta 格式文件的用户，并可以方便地对复杂配置文件进行管理。
  
- 优点：

  - 对于需要使用 Clash.Meta 提供的高级功能（如负载均衡、策略管理）的用户，MetaCubeX 提供了更好的支持和用户体验。

### 总结区别

| 项目           | 功能性                    | 配置兼容性        | 使用场景                   |
| -------------- | ------------------------- | ----------------- | -------------------------- |
| **Clash**      | 基础代理和规则            | Clash 格式        | 通用代理需求               |
| **Clash.Meta** | 高级功能，如负载均衡      | Clash 格式 + 扩展 | 需要更高级代理功能         |
| **MetaCubeX**  | Clash.Meta 功能支持与管理 | Clash、Clash.Meta | 需要高级代理功能和便捷管理 |

都是前面不更新了(政策原因)然后才有后面的项目

## GUI 介绍

### Clash verge/Clash verge dev

就是用上面clash的GUI


## clash 是如何运作的
以 [MetaCubeX](https://wiki.metacubex.one/)为例,他需要配置一个文件,这其实就是订阅下载的文件.

Clash verge允许用户修改所有的配置文件(全局脚本)

## Clash verge dev 如何使用均衡代理

参考函数  `addLoadBalanceGroup`

但是有一个很关键的问题:  同一个链接的时候并不会使用不同的代理,参考例子poolhttp.go和 poolhttp_test.go

当每个http.client复用2次的时候,结果如下:

```
2024/11/08 20:37:21 resp.Body: {"ip":"87.121.61.171","country":"FR","country_name":"France","region_code":"GES","in_eu":true,"continent":"EU"}
2024/11/08 20:37:22 resp.Body: {"ip":"107.189.29.215","country":"LU","country_name":"Luxembourg","region_code":"LU","in_eu":true,"continent":"EU"}
2024/11/08 20:37:22 resp.Body: {"ip":"107.189.29.215","country":"LU","country_name":"Luxembourg","region_code":"LU","in_eu":true,"continent":"EU"}
2024/11/08 20:37:22 resp.Body: {"ip":"103.97.88.209","country":"NL","country_name":"The Netherlands","region_code":"NH","in_eu":true,"continent":"EU"}
2024/11/08 20:37:22 resp.Body: {"ip":"209.200.246.141","country":"CA","country_name":"Canada","region_code":"ON","in_eu":false,"continent":"NA"}
2024/11/08 20:37:22 resp.Body: {"ip":"209.200.246.141","country":"CA","country_name":"Canada","region_code":"ON","in_eu":false,"continent":"NA"}
2024/11/08 20:37:22 resp.Body: {"ip":"61.224.133.143","country":"TW","country_name":"Taiwan","region_code":"TXG","in_eu":false,"continent":"AS"}
2024/11/08 20:37:22 resp.Body: {"ip":"184.174.96.140","country":"US","country_name":"United States","region_code":"DE","in_eu":false,"continent":"NA"}
2024/11/08 20:37:22 resp.Body: {"ip":"184.174.96.140","country":"US","country_name":"United States","region_code":"DE","in_eu":false,"continent":"NA"}
2024/11/08 20:37:22 resp.Body: {"ip":"150.66.12.23","country":"JP","country_name":"Japan","region_code":"14","in_eu":false,"continent":"AS"}
2024/11/08 20:37:23 resp.Body: {"ip":"87.121.61.171","country":"FR","country_name":"France","region_code":"GES","in_eu":true,"continent":"EU"}
2024/11/08 20:37:23 resp.Body: {"ip":"107.189.29.215","country":"LU","country_name":"Luxembourg","region_code":"LU","in_eu":true,"continent":"EU"}
2024/11/08 20:37:23 resp.Body: {"ip":"107.189.29.215","country":"LU","country_name":"Luxembourg","region_code":"LU","in_eu":true,"continent":"EU"}
2024/11/08 20:37:23 resp.Body: {"ip":"209.200.246.141","country":"CA","country_name":"Canada","region_code":"ON","in_eu":false,"continent":"NA"}
2024/11/08 20:37:23 resp.Body: {"ip":"103.97.88.209","country":"NL","country_name":"The Netherlands","region_code":"NH","in_eu":true,"continent":"EU"}
2024/11/08 20:37:23 resp.Body: {"ip":"61.224.133.143","country":"TW","country_name":"Taiwan","region_code":"TXG","in_eu":false,"continent":"AS"}
2024/11/08 20:37:23 resp.Body: {"ip":"209.200.246.141","country":"CA","country_name":"Canada","region_code":"ON","in_eu":false,"continent":"NA"}
2024/11/08 20:37:23 resp.Body: {"ip":"184.174.96.140","country":"US","country_name":"United States","region_code":"DE","in_eu":false,"continent":"NA"}
2024/11/08 20:37:23 resp.Body: {"ip":"103.172.116.236","country":"SG","country_name":"Singapore","region_code":"","in_eu":false,"continent":"AS"}
2024/11/08 20:37:23 resp.Body: {"ip":"103.172.116.236","country":"SG","country_name":"Singapore","region_code":"","in_eu":false,"continent":"AS"}

```



## Clash verge dev 如何使用PAC

参考函数 `replaceRules`

