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
                {
                    name: "page",
                    title: "页码",
                    type: "page"
                },
            ],
        },
    ],
    version: "1.0.11",
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
        const page = params.page;
        const url = params.url || "";
        const count = 20
        start = (page - 1) * count
        end = page * count

        // 从URL获取M3U内容
        const response = await this.fetchM3UContent(url);
        if (!response) return [];

        // 解析M3U内容
        const items = parseM3UContent(response);

        // 应用过滤器
        // if (options.filter) {
        //     return items.filter(options.filter);
        // }

        return items.slice(start, end);
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
                durationText: currentItem.duration === "-1" ? "直播" : `${currentItem.duration}秒`,
                backdropPath: currentItem.cover,
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
    // 发送请求，不自动跟随重定向
    const response = await Widget.http.get(link, {
        maxRedirects: 0, // 禁止自动跳转，获取302响应
        validateStatus: (status) => status >= 200 && status < 400, // 允许302被处理
        headers: {
            "User-Agent": "AptvPlayer/1.4.6",
        },
    });

    let videoUrl = link;

    await sendMSG(JSON.stringify(response.data));
    await sendMSG(JSON.stringify(response.headers));

    // 检查是否是302并且有Location头
    if (response.status === 302 && response.headers?.location) {
        const location = response.headers.location;
        if (location.includes(".m3u8")) {
            videoUrl = location;
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
