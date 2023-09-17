const bypassList = [
    "127.*.*.*",
    "192.168.*.*"
]

const serverConfigTor = {
    mode: 'fixed_servers', rules: { // socks5, socks4, http, https
        singleProxy: { scheme: 'socks5', host: '127.0.0.1', port: 9050 },
        bypassList: bypassList
    }
}
const serverConfigPvx = {
    mode: 'fixed_servers', rules: {
        singleProxy: { scheme: 'http', host: '192.168.1.100', port: 666 },
        bypassList: bypassList
    }
}

function direct() {
    chrome.proxy.settings.set({ value: { mode: "direct" }, scope: "regular" });
    chrome.action.setBadgeBackgroundColor({ color: [160, 0, 0, 255] });
    chrome.action.setBadgeText({ text: " OFF " });
}

function system() {
    chrome.proxy.settings.set({ value: { mode: "system" }, scope: "regular" });
    chrome.action.setBadgeBackgroundColor({ color: [0, 160, 0, 255] });
    chrome.action.setBadgeText({ text: " SYS " });
}

function fixedServersTor() {
    chrome.proxy.settings.set({ value: serverConfigTor, scope: 'regular' });
    chrome.action.setBadgeBackgroundColor({ color: [119, 66, 144, 255] });
    chrome.action.setBadgeText({ text: " TOR " });
}

function fixedServersPvx() {
    chrome.proxy.settings.set({ value: serverConfigPvx, scope: 'regular' });
    chrome.action.setBadgeBackgroundColor({ color: [0, 100, 160, 255] });
    chrome.action.setBadgeText({ text: " PVX " });
}

chrome.proxy.settings.get({ incognito: false }, function (config) {
    if (config.value.mode == "direct") {
        direct();
    } else if (config.value.mode == "system") {
        system();
    } else if (config.value.mode == "fixed_servers" 
            && config.value.rules.singleProxy.port == serverConfigTor.rules.singleProxy.port) {
        fixedServersTor();
    } else if (config.value.mode == "fixed_servers"
            && config.value.rules.singleProxy.port == serverConfigPvx.rules.singleProxy.port) {
        fixedServersPvx();
    }
});

chrome.action.onClicked.addListener(function (tab) {
    chrome.proxy.settings.get({ incognito: false }, function (config) {
        if (config.value.mode == "direct") {
            system();
        } else if (config.value.mode == "system") {
            fixedServersTor();
        } else if (config.value.mode == "fixed_servers" 
                && config.value.rules.singleProxy.port == serverConfigTor.rules.singleProxy.port) {
            fixedServersPvx();
        } else if (config.value.mode == "fixed_servers" 
                && config.value.rules.singleProxy.port == serverConfigPvx.rules.singleProxy.port) {
            direct();
        }
    });
});
