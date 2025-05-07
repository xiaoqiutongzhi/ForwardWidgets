// trakt组件
WidgetMetadata = {
    id: "Trakt",
    title: "Trakt我看&Trakt个性化推荐",
    modules: [
        {
            title: "trakt我看",
            requiresWebView: false,
            functionName: "loadInterestItems",
            params: [
                {
                    name: "client_id",
                    title: "client_id",
                    type: "input",
                    description: "必填，获取请参考该项目README",
                },
                {
                    name: "client_secret",
                    title: "client_secret",
                    type: "input",
                    description: "必填，获取请参考该项目README",
                },
                {
                    name: "code",
                    title: "code",
                    type: "input",
                    description: "必填，获取请参考该项目README",
                },
                {
                    name: "status",
                    title: "状态",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "想看",
                            value: "watchlist",
                        },
                        {
                            title: "在看",
                            value: "progress",
                        },
                        {
                            title: "看过-电影",
                            value: "watched-movie",
                        },
                        {
                            title: "看过-电视",
                            value: "watched-show",
                        },
                    ],
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page"
                },
            ],
        },
        {
            title: "Trakt个性化推荐",
            requiresWebView: false,
            functionName: "loadSuggestionItems",
            params: [
                {
                    name: "client_id",
                    title: "client_id",
                    type: "input",
                    description: "必填，获取请参考该项目README",
                },
                {
                    name: "client_secret",
                    title: "client_secret",
                    type: "input",
                    description: "必填，获取请参考该项目README",
                },
                {
                    name: "code",
                    title: "code",
                    type: "input",
                    description: "必填，获取请参考该项目README",
                },
                {
                    name: "type",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "电影",
                            value: "movie",
                        },
                        {
                            title: "电视",
                            value: "show",
                        },
                    ],
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page"
                },
            ],
        },
    ],
    version: "1.0.12",
    requiredVersion: "0.0.1",
    description: "解析Trakt我看及个性化推荐，获取视频信息",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};

async function fetchToken(clientId, clientSecret, code) {
    try {
        const data = {
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
            grant_type: "authorization_code",
        };
        const jsonData = JSON.stringify(data);
        console.log("请求jsonData:", jsonData);
        const response = await Widget.http.post("https://api.trakt.tv/oauth/token", {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            body: jsonData
        });

        console.log("请求access_token:", response.data);

        if (response.data) {
            return response.data.access_token;
        } else {
            throw new Error("未获取到access_token");
        }
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function fetchProgress(sortedData, clientId, token) {
    let tmdbIdPromises = sortedData.map(async (item) => {
        try {
            const url = `https://api.trakt.tv/shows/${item.show.ids.slug}/progress/watched`;
            const detailResponse = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "trakt-api-key": clientId,
                    "Authorization": "Bearer " + token,
                },
            });

            return detailResponse.data.aired !== detailResponse.data.completed ? `show.${item.show.ids.tmdb}` : null;
        } catch {
            return null; // 忽略单个失败请求
        }
    });

    let tmdbIds = (await Promise.all(tmdbIdPromises)).filter(Boolean).map((item) => ({
      id: item,
      type: "tmdb",
    }));
    console.log("请求tmdbIds:", tmdbIds)
    return tmdbIds;
}

async function loadInterestItems(params = {}) {
    try {
        const page = params.page;
        const clientId = params.client_id || "";
        const clientSecret = params.client_secret || "";
        const code = params.code || "";
        const status = params.status || "";
        const limit = 20;

        if (!clientId || !clientSecret || !code) {
            throw new Error("必须先填写client_id、client_secret和code");
        }

        const token = await fetchToken(clientId, clientSecret, code);

        let url = '';
        let type = 'movie';
        if (status === "watchlist") {
            url = `https://api.trakt.tv/sync/watchlist/all/rank/asc?page=${page}&limit=${limit}`;
        } else if (status === "progress") {
            url = `https://api.trakt.tv/sync/watched/shows?extended=noseasons`;
            type = 'show';
        } else if (status === "watched-movie") {
            url = `https://api.trakt.tv/sync/watched/movies`;
        } else if (status === "watched-show") {
            url = `https://api.trakt.tv/sync/watched/shows?extended=noseasons`;
            type = 'show';
        }

        // watchlist的任何page都需要请求，其他只请求page=1
        if (!(status !== "watchlist" && page > 1)) {
            const response = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "trakt-api-key": clientId,
                    "Authorization": "Bearer " + token,
                },
            });

            console.log("请求结果:", response.data);

            // watched-movie需要用last_updated_at字段进行时间排序
            let sortedData = response.data;
            if (status === "watched-movie") {
                sortedData = response.data.sort((a, b) => {
                    return new Date(b.last_updated_at) - new Date(a.last_updated_at);
                });
            }

            // progress过滤出最近半年，且未看完的show，之所以是最近半年，是怕电视太多，超请求了
            if (status === "progress") {
                return await fetchProgress(sortedData);
            }

            if (sortedData) {
                const items = sortedData;
                let tmdbIds = [];
                if (status === "watchlist") {
                    tmdbIds = items.map((item) => ({
                        id: item.type + item[item.type]?.tmdb,
                        type: "tmdb",
                    }));
                } else {
                    tmdbIds = items.map((item) => ({
                        id: type + item[type]?.tmdb,
                        type: "tmdb",
                    }));
                }
                return tmdbIds;
            }
            return [];
        }
        return [];
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function loadSuggestionItems(params = {}) {
    const page = params.page;
    const clientId = params.client_id || "";
    const clientSecret = params.client_secret || "";
    const code = params.code || "";
    const type = params.type || "";
    const limit = 20;

    if (!clientId || !clientSecret || !code) {
        throw new Error("必须先填写client_id、client_secret和code");
    }

    const token = await fetchToken(clientId, clientSecret, code);

    let url = `https://api.trakt.tv/recommendations/${type}s?page=${page}&limit=${limit}`;
    const response = await Widget.http.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "trakt-api-key": clientId,
            "Authorization": "Bearer " + token,
        },
    });

    console.log("请求结果:", response.data);
    if (response.data) {
        const items = response.data;
        const tmdbIds = items.filter((item) => item.ids.tmdb != null).map((item) => ({
            id: type + item.ids.tmdb,
            type: "tmdb",
        }));
        return tmdbIds;
    }
    return [];
}