const domin_suffix = [
  "autoxjs.com",
  "android.com",
  "appspot.com",
  "chatgpt.com",
  "coderprofile.com",
  "dropbox.com",
  "esa.int",
  "get.dev",
  "ggpht.com",
  "github.com",
  "githubassets.com",
  "go.dev",
  "go-kratos.dev",
  "golang.org",
  "google.com",
  "googleapis.com",
  "googleusercontent.com",
  "googlevideo.com",
  "gravatar.com",
  "greasyfork.org",
  "gstatic.com",
  "ipaddress.my",
  "openai.com",
  "sqlalchemy.org",
  "registry.google",
  "sstatic.net",
  "stack.imgur.com",
  "stackoverflow.com",
  "tokyo-hot.com",
  "torproject.netopenai.com",
  "torproject.org",
  "whatismyipaddress.com",
  "wikipedia.org",
  "youtube.com",
  "ytimg.com",
  "z-lib.org",
  "cookieyes.com",
]

function main(config, profileName) {
  addLoadBalanceGroup(config);
  replaceRules(config);
  return config;
}

const replaceRules = (config) => {
  const prefix = "DOMAIN-SUFFIX,";
  let selectName = "proxy";
  config["proxy-groups"].forEach(group => {
    if (group.type === "select") {
      selectName = group.name;
    }
  })
  const suffix = "," + selectName;
  const updatedDomin = domin_suffix.map(domain => `${prefix}${domain}${suffix}`);
  updatedDomin.push("MATCH,DIRECT")
  config.rules = updatedDomin;
}


const addLoadBalanceGroup = (config) => {
  // 仅保留第一个相同 server 的项
  const uniqueProxies = Object.values(config.proxies.reduce((acc, proxy) => {
    if (!acc[proxy.server]) {
      acc[proxy.server] = proxy;
    }
    return acc;
  }, {}));

  // 从 uniqueProxies 中提取所有 name
  const proxyNames = uniqueProxies.map(proxy => proxy.name);
  //strategy¶
  // 负载均衡策略
  // round-robin 将会把所有的请求分配给策略组内不同的代理节点
  // consistent-hashing 将相同的 目标地址 的请求分配给策略组内的同一个代理节点
  // sticky-sessions: 将相同的 来源地址 和 目标地址 的请求分配给策略组内的同一个代理节点，缓存 10 分钟过期
  // 创建 proxy-groups，其中包含从 uniqueProxies 提取的所有 name
  lbgroups = {
    "name": "load-balance",
    "type": "load-balance",
    "proxies": proxyNames,
    "strategy": "round-robin"
  }
  config["proxy-groups"].forEach(group => {
    if (group.type === "select") {
      group.proxies.unshift(lbgroups.name);  // 你可以根据需要修改 lb 的值
    }
  });
  config["proxy-groups"].push(lbgroups)

}

