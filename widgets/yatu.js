// 雅图组件
WidgetMetadata = {
    id: "yatu",
    title: "雅图(每日放送+点播排行榜)",
    modules: [
        {
            title: "每日放送",
            requiresWebView: false,
            functionName: "loadLatestItems",
            params: [
                {
                    name: "genre",
                    title: "类型",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "动漫",
                            value: "sin1",
                        },
                        {
                            title: "电影",
                            value: "sin2",
                        },
                        {
                            title: "电视剧",
                            value: "sin3",
                        },
                    ],
                },
                {
                    name: "start_date",
                    title: "开始日期：n天前（0表示今天，-1表示昨天）",
                    type: "input",
                    description: "0表示今天，-1表示昨天，未填写情况下接口不可用",
                    placeholders: [
                        {
                            title: "今天",
                            value: "0"
                        },
                        {
                            title: "昨天",
                            value: "-1"
                        },
                        {
                            title: "前天",
                            value: "-2"
                        },
                        {
                            title: "大前天",
                            value: "-3"
                        },
                    ]
                },
                {
                    name: "days",
                    title: "天数",
                    type: "input",
                    description: "如：3，会返回从开始日期起的3天内的节目，未填写情况下接口不可用",
                    value: "1",
                    placeholders: [
                        {
                            title: "1",
                            value: "1"
                        },
                        {
                            title: "2",
                            value: "2"
                        },
                        {
                            title: "3",
                            value: "3"
                        },
                        {
                            title: "4",
                            value: "4"
                        },
                    ]
                },
            ],
        },
    ],
    version: "1.0.4",
    requiredVersion: "0.0.1",
    description: "解析雅图每日放送更新以及各类排行榜【五折码：CHEAP.5;七折码：CHEAP】",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets"
};

// 基础获取TMDB数据方法
async function fetchTmdbData(key, mediaType) {
    const tmdbResults = await Widget.tmdb.get(`/search/${mediaType}`, {
        params: {
            query: key,
            language: "zh_CN",
        }
    });
    //打印结果
    console.log("搜索内容：" + key)
    console.log("tmdbResults:" + JSON.stringify(tmdbResults, null, 2));
    console.log("tmdbResults.total_results:" + tmdbResults.total_results);
    console.log("tmdbResults.results[0]:" + tmdbResults.results[0]);
    return tmdbResults[0];
}

function getItemInfos(data, startDateInput, days, genre) {
    let docId = Widget.dom.parse(data);

    let tables = Widget.dom.select(docId, `table#${genre}`);
    console.log(tables);

    if (!tables || tables.length === 0) {
        console.error(`没有解析到相应table`);
        return null;
    }

    let tdElements = Widget.dom.select(table, 'td');

    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    function formatDate(date) {
        let year = date.getFullYear().toString().slice(2); // Get last two digits
        let month = date.getMonth() + 1; // Months are 0-based
        let day = date.getDate();
        return `${year}/${month}/${day}`;
    }

    let results = [];

    tdElements.forEach(td => {
        // Get all text content within the td
        let tdContent = Widget.dom.text(td).trim();

        // Find the span with style="color:#666666;" for time information
        let timeSpan = Widget.dom.select(td, 'span[style="color:#666666;"]')[0];
        let timeText = timeSpan ? Widget.dom.text(timeSpan).trim() : '';

        // Process timeText
        let processedTime = timeText;
        if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeText)) {
            // If time is in hh:mm:ss format, use today's date
            processedTime = formatDate(today);
        } else if (timeText === '昨天') {
            // If time is "昨天", use yesterday's date
            processedTime = formatDate(yesterday);
        } else if (timeText === '前天') {
            // If time is "前天", use day before yesterday's date
            processedTime = formatDate(dayBeforeYesterday);
        }

        // Extract the link and title from the <a> tag
        let linkEl = Widget.dom.select(td, 'a')[0];
        let linkHref = linkEl ? Widget.dom.attr(linkEl, 'href') : '';
        let linkText = linkEl ? Widget.dom.text(linkEl).trim() : '';

        // Extract the episode information from the span (if exists)
        let episodeSpan = Widget.dom.select(td, 'span:not([style])')[0];
        let episodeText = episodeSpan ? Widget.dom.text(episodeSpan).trim() : '';

        results.push({
            title: linkText,
            link: linkHref,
            episodes: episodeText,
            time: processedTime,
            fullContent: tdContent
        });
    });

    // Calculate the start date based on startDateInput
    let startDate = new Date(today);
    startDate.setDate(today.getDate() + startDateInput);

    // Calculate the end date (startDate + days - 1)
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days - 1);

    // Filter results
    return results.filter(item => {
        // Parse item.time (format: 25/5/17)
        let [year, month, day] = item.time.split('/').map(Number);
        let itemDate = new Date(2000 + year, month - 1, day); // Year is two digits, add 2000

        // Check if itemDate is within startDate and endDate
        return itemDate >= startDate && itemDate <= endDate;
    });
}

async function loadLatestItems(params = {}) {
    try {
        const genre = params.genre || "";
        const startDateInput = params.start_date || "";
        const days = params.days || "";

        if (!genre || !startDateInput || !days) {
            throw new Error("必须提供分类、开始日期、天数");
        }

        const mediaTypeDict = {
            sin1: 'tv',
            sin2: 'movie',
            sin3: 'tv',
        };

        const response = await Widget.http.get("http://www.yatu.tv:2082/zuijin.asp", {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        console.log("请求结果:", response.data);

        const itemInfos = getItemInfos(response.data, startDateInput, days, genre);

        console.log("itemInfos:", itemInfos)

        const promises = itemInfos.map(async (itemInfo) => {
            // 模拟API请求
            const tmdbData = await fetchTmdbData(itemInfo.title, mediaTypeDict[genre])

            return {
                id: tmdbData.id,
                type: "tmdb",
                title: tmdbData.title ?? tmdbData.name,
                description: tmdbData.overview,
                releaseDate: tmdbData.release_date ?? tmdbData.first_air_date,
                backdropPath: tmdbData.backdrop_path,
                posterPath: tmdbData.poster_path,
                rating: tmdbData.vote_average,
                mediaType: mediaTypeDict[genre],
            };
        });

        // 等待所有请求完成
        const items = await Promise.all(promises);

        console.log(items)

        return items;
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}
