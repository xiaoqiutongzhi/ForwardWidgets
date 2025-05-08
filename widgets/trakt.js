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
                            value: "history/movies/added/asc",
                        },
                        {
                            title: "看过-电视",
                            value: "history/shows/added/asc",
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
    version: "1.0.31",
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

async function fetchImdbIdsFromTraktUrls(traktUrls) {
    let imdbIdPromises = traktUrls.map(async (url) => {
        try {
            let detailResponse = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            });

            let detailDoc = Widget.dom.parse(detailResponse.data);
            let imdbLinkEl = Widget.dom.select(detailDoc, 'a#external-link-imdb')[0];

            if (!imdbLinkEl) return null;

            let href = Widget.dom.attr(imdbLinkEl, 'href');
            let match = href.match(/title\/(tt\d+)/);

            return match ? `${match[1]}` : null;
        } catch {
            return null; // 忽略单个失败请求
        }
    });

    let imdbIds = (await Promise.all(imdbIdPromises)).filter(Boolean).map((item) => ({
      id: item,
      type: "imdb",
    }));
    await uploadNotify(JSON.stringify(imdbIds))
    console.log("请求imdbIds:", imdbIds)
    return imdbIds;
}

async function loadInterestItems(params = {}) {
    try {
        const page = params.page;
        const userName = params.user_name || "";
        const status = params.status || "";
        const count = 20
        const minNum = (page - 1) * count + 1
        const maxNum = (page) * count
        const traktPage = (page - 1) / 3 + 1

        if (!userName) {
            throw new Error("必须提供 Trakt 用户名");
        }

        let url = `https://trakt.tv/users/${userName}/${status}?page=${traktPage}`;
        let response = await Widget.http.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });

        await uploadNotify(JSON.stringify(response.data))

        console.log("请求结果:", response.data);

        let docId = Widget.dom.parse(response.data);
        let metaElements = Widget.dom.select(docId, 'meta[content^="https://trakt.tv/"]');
        if (!metaElements || metaElements.length === 0) {
            throw new Error("未找到任何 meta content 链接");
        }

        let traktUrls = Array.from(new Set(metaElements
            .map(el => el.getAttribute?.('content') || Widget.dom.attr(el, 'content'))
            .filter(Boolean)))
            .slice(minNum - 1, maxNum);

        return await fetchImdbIdsFromTraktUrls(traktUrls);
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
    let response = await Widget.http.get(url, {
        headers: {
            Cookie: cookie,
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    });

    await uploadNotify(JSON.stringify(response.data))

    console.log("请求结果:", response.data);

    let docId = Widget.dom.parse(response.data);
    let metaElements = Widget.dom.select(docId, 'meta[content^="https://trakt.tv/"]');
    if (!metaElements || metaElements.length === 0) {
        throw new Error("未找到任何 meta content 链接");
    }

    let traktUrls = Array.from(new Set(metaElements
        .map(el => el.getAttribute?.('content') || Widget.dom.attr(el, 'content'))
        .filter(Boolean)))
        .slice(minNum - 1, maxNum);

    return await fetchImdbIdsFromTraktUrls(traktUrls);
}
