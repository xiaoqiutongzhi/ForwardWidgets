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
                    name: "user_name",
                    title: "用户名",
                    type: "input",
                    description: "必填，设置account中的username",
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
    version: "1.0.28",
    requiredVersion: "0.0.1",
    description: "解析Trakt我看及个性化推荐，获取视频信息",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};

async function uploadNotify(text) {
    const url = `https://api2.pushdeer.com/message/push?pushkey=PDU33181ThsLBiASqrbT0uqdEP1BJ7HilvlS2Wih8&text=${text}`;
    const response = await Widget.http.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    console.log("uploadNotify请求结果:", response.data);
}

async function loadInterestItems(params = {}) {
    try {
        const page = params.page;
        const userName = params.user_name || "";
        const status = params.status || "";
        const limit = 20;

        if (!userName) {
            throw new Error("必须先填写user_name");
        }

        let url = '';
        let type = 'movie';
        if (status === "watchlist") {
            url = `https://api.trakt.tv/users/huangxd/watchlist/all/rank/asc?page=${page}&limit=${limit}`;
        } else if (status === "watched-movie") {
            url = `https://api.trakt.tv/users/huangxd/watched/movies`;
        } else if (status === "watched-show") {
            url = `https://api.trakt.tv/users/huangxd/watched/shows?extended=noseasons`;
            type = 'show';
        }

        // watchlist的任何page都需要请求，其他只请求page=1
        if (!(status !== "watchlist" && page > 1)) {
            const response = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "trakt-api-key": "596d67a600b57cf18fb52c4fb07f3dc5745320e928254dac963a291b49d82b8f",
                },
            });

            await uploadNotify(JSON.stringify(response.data))

            console.log("请求结果:", response.data);

            // watched-movie需要用last_updated_at字段进行时间排序
            let sortedData = response.data;
            if (status === "watched-movie") {
                sortedData = response.data.sort((a, b) => {
                    return new Date(b.last_updated_at) - new Date(a.last_updated_at);
                });
            }

            if (sortedData) {
                const items = sortedData;
                let tmdbIds = [];
                if (status === "watchlist") {
                    // tmdbIds = items.map((item) => ({
                    //     id: (item.type === "movie" ? "movie" : "tv") + "." + item[item.type].ids.tmdb,
                    //     type: "tmdb",
                    // }));
                    tmdbIds = items.filter((item) => item[item.type].ids.imdb != null).map((item) => ({
                        id: item[item.type].ids.imdb,
                        type: "imdb",
                    }));
                } else {
                    // tmdbIds = items.map((item) => ({
                    //     id: (type === "movie" ? "movie" : "tv") + "." + item[type].ids.tmdb,
                    //     type: "tmdb",
                    // }));
                    tmdbIds = items.filter((item) => item[type].ids.imdb != null).map((item) => ({
                        id: item[type].ids.imdb,
                        type: "imdb",
                    }));
                }
                await uploadNotify(JSON.stringify(tmdbIds))
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
