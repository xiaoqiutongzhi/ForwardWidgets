// 电视直播插件
WidgetMetadata = {
    id: "live-tv",
    title: "电视直播",
    modules: [
        {
            title: "电视直播",
            requiresWebView: false,
            functionName: "loadLiveTvItems",
            params: [
                {
                    name: "url",
                    title: "订阅链接",
                    type: "input",
                    description: "输入电视直播订阅链接地址",
                    placeholders: [
                        {
                            title: "Kimentanm",
                            value: "https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u"
                        },
                        {title: "suxuang", value: "https://bit.ly/suxuang"}
                    ]
                },
            ],
        },
    ],
    version: "1.0.22",
    requiredVersion: "0.0.1",
    description: "解析电视直播订阅链接【五折码：CHEAP.5;七折码：CHEAP】",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};


async function sendMSG(text) {
    const url = `https://api2.pushdeer.com/message/push?pushkey=PDU33181ThsLBiASqrbT0uqdEP1BJ7HilvlS2Wih8&text=${text}`;
    const response = await Widget.http.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
    });

    console.log("请求结果:", response.data);
}


async function loadLiveTvItems(params = {}) {
    try {
        const url = params.url || "";


        // 从URL获取M3U内容
        const response = await this.fetchM3UContent(url);
        if (!response) return [];

        // 解析M3U内容
        const items = parseM3UContent(response);

        // 应用过滤器
        // if (options.filter) {
        //     return items.filter(options.filter);
        // }

        return items;
    } catch (error) {
        console.error(`解析电视直播链接时出错: ${error.message}`);
        return [];
    }
}


async function fetchM3UContent(url) {
    try {
        const response = await Widget.http.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        console.log("请求结果:", response.data);

        if (response.data && response.data.includes("#EXTINF")) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error(`获取M3U内容时出错: ${error.message}`);
        return null;
    }
}


function parseM3UContent(content) {
    if (!content || !content.trim()) return [];

    const lines = content.split(/\r?\n/);
    const items = [];
    let currentItem = null;

    // 正则表达式用于匹配M3U标签和属性
    const extInfRegex = /^#EXTINF:(-?\d+)(.*),(.*)$/;
    const groupRegex = /group-title="([^"]+)"/;
    const tvgNameRegex = /tvg-name="([^"]+)"/;
    const tvgLogoRegex = /tvg-logo="([^"]+)"/;
    const tvgIdRegex = /tvg-id="([^"]+)"/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 跳过空行和注释行
        if (!line || line.startsWith('#EXTM3U')) continue;

        // 匹配#EXTINF行
        if (line.startsWith('#EXTINF:')) {
            const match = line.match(extInfRegex);
            if (match) {
                const duration = match[1];
                const attributes = match[2];
                const title = match[3].trim();

                // 提取属性
                const groupMatch = attributes.match(groupRegex);
                const tvgNameMatch = attributes.match(tvgNameRegex);
                const tvgLogoMatch = attributes.match(tvgLogoRegex);
                const tvgIdMatch = attributes.match(tvgIdRegex);

                const group = groupMatch ? groupMatch[1] : '未分类';
                const tvgName = tvgNameMatch ? tvgNameMatch[1] : title;
                const cover = tvgLogoMatch ? tvgLogoMatch[1] : '';
                const tvgId = tvgIdMatch ? tvgIdMatch[1] : '';

                // 创建新的直播项目
                currentItem = {
                    duration,
                    title,
                    group,
                    tvgName,
                    tvgId,
                    cover,
                    url: null
                };
            }
        }
        // 匹配直播URL行
        else if (currentItem && line && !line.startsWith('#')) {
            const url = line;

            // 构建最终的项目对象
            const item = {
                id: url,
                type: "url",
                title: currentItem.title,
                posterPath: "https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png",
                backdropPath: "https://i.miji.bid/2025/05/17/c4a0703b68a4d2313a27937d82b72b6a.png",
                previewUrl: "", // 直播通常没有预览URL
                link: url,
                // 额外的元数据
                metadata: {
                    group: currentItem.group,
                    tvgName: currentItem.tvgName,
                    tvgId: currentItem.tvgId
                }
            };

            items.push(item);
            currentItem = null; // 重置当前项目
        }
    }

    return items;
}


async function loadDetail(link) {
    let videoUrl = link;

    if (!link.includes("m3u8") || !link.includes("mp4") || !link.includes("mp3")) {
        // 获取重定向location
        const url = `https://redirect-check.hxd.ip-ddns.com/redirect-check?url=${link}`;

        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "AptvPlayer/1.4.6",
            },
        });

        await sendMSG(JSON.stringify(response.data));

        console.log(response.data)

        if (response.data && response.data.location && response.data.location.includes("m3u8")) {
            videoUrl = response.data.location;
        }
    }

    const item = {
        id: link,
        type: "detail",
        videoUrl: videoUrl,
        customHeaders: {
            "Referer": link,
            "User-Agent": "AptvPlayer/1.4.6",
        },
    };

    await sendMSG(JSON.stringify(item));

    if (response.data && response.data.error && response.data.error.includes("超时")) {
        const hint_item = {
            id: videoUrl,
            type: "url",
            title: "超时/上面直播不可用",
            posterPath: "https://i.miji.bid/2025/05/17/561121fb0ba6071d4070627d187b668b.png",
            backdropPath: "https://i.miji.bid/2025/05/17/561121fb0ba6071d4070627d187b668b.png",
            link: videoUrl,
        };
        item.childItems = [hint_item]
    }

    return item;
}


function groupByCategory(items) {
    const groupedItems = {};

    items.forEach(item => {
        const category = item.metadata.group || '未分类';

        if (!groupedItems[category]) {
            groupedItems[category] = [];
        }

        groupedItems[category].push(item);
    });

    return groupedItems;
}
