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
                    description: "未填写情况下接口不可用",
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
                            value: "history-movies",
                        },
                        {
                            title: "看过-电视",
                            value: "history-shows",
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
                    name: "cookie",
                    title: "用户Cookie",
                    type: "input",
                    description: "未填写情况下接口不可用；可登陆网页后，通过loon，Qx等软件抓包获取cookie",
                },
                {
                    name: "type",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "电影",
                            value: "movies",
                        },
                        {
                            title: "电视",
                            value: "shows",
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
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "解析Trakt我看及个性化推荐，获取视频信息",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};

async function fetchTmdbIdsFromTraktUrls(traktUrls) {
    const tmdbIdPromises = traktUrls.map(async (url) => {
        try {
            const detailResponse = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
            });

            const detailDoc = Widget.dom.parse(detailResponse.data);
            const tmdbLinkEl = Widget.dom.select(detailDoc, 'a#external-link-tmdb')[0];

            if (!tmdbLinkEl) return null;

            const href = Widget.dom.attr(tmdbLinkEl, 'href');
            const match = href.match(/\/(tv|movie)\/(\d+)/);

            return match ? `${match[1]}.${match[2]}` : null;
        } catch {
            return null; // 忽略单个失败请求
        }
    });

    const tmdbIds = (await Promise.all(tmdbIdPromises)).filter(Boolean).map((item) => ({
      id: item,
      type: "tmdb",
    }));;
    console.log("请求tmdbIds:", tmdbIds)
    return Array.from(new Set(tmdbIds));
}

async function loadInterestItems(params = {}) {
    try {
        const page = params.page;
        const userName = params.user_name || "";
        const status = params.status || "";
        const count = 20;
        const minNum = (page - 1) * count + 1
        const maxNum = (page) * count
        const traktPage = (page - 1) / 3 + 1

        if (!userName) {
            throw new Error("必须提供 Trakt 用户名");
        }

        let url = '';
        if (status === 'watchlist') {
            url = `https://trakt.tv/users/${userName}/watchlist?page=${traktPage}`;
        } else if (status === 'progress') {
            url = `https://trakt.tv/users/${userName}/progress?page=${traktPage}`;
        } else if (status === 'history-movies') {
            url = `https://trakt.tv/users/${userName}/history/movies/added/asc?page=${traktPage}`;
        } else if (status === 'history-shows') {
            url = `https://trakt.tv/users/${userName}/history/shows/added/asc?page=${traktPage}`;
        }
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        console.log("请求结果:", response.data);

        const docId = Widget.dom.parse(response.data);
        const metaElements = Widget.dom.select(docId, 'meta[content^="https://trakt.tv/"]');
        if (!metaElements || metaElements.length === 0) {
            throw new Error("未找到任何 meta content 链接");
        }

        const traktUrls = Array.from(new Set(metaElements
            .map(el => el.getAttribute?.('content') || Widget.dom.attr(el, 'content'))
            .filter(Boolean)))
            .slice(minNum - 1, maxNum);

        return await fetchTmdbIdsFromTraktUrls(traktUrls);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function loadSuggestionItems(params = {}) {
    const page = params.page;
    const cookie = params.cookie || "";
    const type = params.type || "";
    const count = 20;
    const minNum = (page - 1) * count + 1
    const maxNum = (page) * count

    if (!cookie) {
        throw new Error("必须提供用户Cookie");
    }

    let url = `https://trakt.tv/${type}/recommendations`;
    const response = await Widget.http.get(url, {
        headers: {
            Cookie: cookie,
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });

    console.log("请求结果:", response.data);

    const docId = Widget.dom.parse(response.data);
    const metaElements = Widget.dom.select(docId, 'meta[content^="https://trakt.tv/"]');
    if (!metaElements || metaElements.length === 0) {
        throw new Error("未找到任何 meta content 链接");
    }

    const traktUrls = Array.from(new Set(metaElements
        .map(el => el.getAttribute?.('content') || Widget.dom.attr(el, 'content'))
        .filter(Boolean)))
        .slice(minNum - 1, maxNum);

    return await fetchTmdbIdsFromTraktUrls(traktUrls);
}