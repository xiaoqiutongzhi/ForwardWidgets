// 豆瓣片单组件
WidgetMetadata = {
  id: "douban",
  title: "豆瓣我看&豆瓣个性化推荐",
  modules: [
    {
      title: "豆瓣我看",
      requiresWebView: false,
      functionName: "loadInterestItems",
      cacheDuration: 3600,
      params: [
        {
          name: "user_id",
          title: "用户ID",
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
              value: "mark",
            },
            {
              title: "在看",
              value: "doing",
            },
            {
              title: "看过",
              value: "done",
            },
            {
              title: "随机想看(从想看列表中无序抽取9个影片)",
              value: "random_mark",
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
      title: "豆瓣个性化推荐",
      requiresWebView: false,
      functionName: "loadSuggestionItems",
      cacheDuration: 43200,
      params: [
        {
          name: "cookie",
          title: "用户Cookie",
          type: "input",
          description: "未填写情况下非个性化推荐；可手机登陆网页版后，通过loon，Qx等软件抓包获取Cookie",
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
              value: "tv",
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
      title: "豆瓣片单(TMDB版)",
      requiresWebView: false,
      functionName: "loadCardItems",
      cacheDuration: 43200,
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "豆瓣片单地址",
          placeholders: [
            {
              title: "豆瓣热门电影",
              value: "https://m.douban.com/subject_collection/movie_hot_gaia",
            },
            {
              title: "热播新剧",
              value: "https://m.douban.com/subject_collection/tv_hot",
            },
            {
              title: "热播综艺",
              value: "https://m.douban.com/subject_collection/show_hot",
            },
            {
              title: "影院热映",
              value: "https://m.douban.com/subject_collection/movie_showing",
            },
            {
              title: "实时热门电影",
              value: "https://m.douban.com/subject_collection/movie_real_time_hotest",
            },
            {
              title: "实时热门电视",
              value: "https://m.douban.com/subject_collection/tv_real_time_hotest",
            },
            {
              title: "豆瓣 Top 250",
              value: "https://m.douban.com/subject_collection/movie_top250",
            },
            {
              title: "一周电影口碑榜",
              value: "https://m.douban.com/subject_collection/movie_weekly_best",
            },
            {
              title: "华语口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly",
            },
            {
              title: "全球口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_global_best_weekly",
            },
            {
              title: "国内综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_chinese_best_weekly",
            },
            {
              title: "全球综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_global_best_weekly",
            },
            {
              title: "第97届奥斯卡",
              value: "https://m.douban.com/subject_collection/EC7I7ZDRA?type=rank",
            },
            {
              title: "IMDB MOVIE TOP 250",
              value: "https://m.douban.com/doulist/1518184",
            },
            {
              title: "IMDB TV TOP 250",
              value: "https://m.douban.com/doulist/41573512",
            },
            {
              title: "意外结局电影",
              value: "https://m.douban.com/doulist/11324",
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
      title: "电影推荐(TMDB版)",
      requiresWebView: false,
      functionName: "loadRecommendMovies",
      cacheDuration: 86400,
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              title: "全部",
              value: "all",
            },
            {
              title: "热门电影",
              value: "热门",
            },
            {
              title: "最新电影",
              value: "最新",
            },
            {
              title: "豆瓣高分",
              value: "豆瓣高分",
            },
            {
              title: "冷门佳片",
              value: "冷门佳片",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["热门", "最新", "豆瓣高分", "冷门佳片"],
          },
          enumOptions: [
            {
              title: "全部",
              value: "全部",
            },
            {
              title: "华语",
              value: "华语",
            },
            {
              title: "欧美",
              value: "欧美",
            },
            {
              title: "韩国",
              value: "韩国",
            },
            {
              title: "日本",
              value: "日本",
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
      title: "剧集推荐(TMDB版)",
      requiresWebView: false,
      functionName: "loadRecommendShows",
      cacheDuration: 86400,
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              title: "全部",
              value: "all",
            },
            {
              title: "热门剧集",
              value: "tv",
            },
            {
              title: "热门综艺",
              value: "show",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["tv"],
          },
          enumOptions: [
            {
              title: "综合",
              value: "tv",
            },
            {
              title: "国产剧",
              value: "tv_domestic",
            },
            {
              title: "欧美剧",
              value: "tv_american",
            },
            {
              title: "日剧",
              value: "tv_japanese",
            },
            {
              title: "韩剧",
              value: "tv_korean",
            },
            {
              title: "动画",
              value: "tv_animation",
            },
            {
              title: "纪录片",
              value: "tv_documentary",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["show"],
          },
          enumOptions: [
            {
              title: "综合",
              value: "show",
            },
            {
              title: "国内",
              value: "show_domestic",
            },
            {
              title: "国外",
              value: "show_foreign",
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
      title: "观影偏好(TMDB版)",
      description: "根据个人偏好推荐影视作品",
      requiresWebView: false,
      functionName: "getPreferenceRecommendations",
      cacheDuration: 86400,
      params: [
        {
          name: "mediaType",
          title: "类别",
          type: "enumeration",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" },
          ]
        },
        {
          name: "movieGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["movie"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "动作", value: "动作" },
            { title: "科幻", value: "科幻" },
            { title: "动画", value: "动画" },
            { title: "悬疑", value: "悬疑" },
            { title: "犯罪", value: "犯罪" },
            { title: "音乐", value: "音乐" },
            { title: "历史", value: "历史" },
            { title: "奇幻", value: "奇幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "战争", value: "战争" },
            { title: "西部", value: "西部" },
            { title: "歌舞", value: "歌舞" },
            { title: "传记", value: "传记" },
            { title: "武侠", value: "武侠" },
            { title: "纪录片", value: "纪录片" },
            { title: "短片", value: "短片" },
          ]
        },
        {
          name: "tvModus",
          title: "形式",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["tv"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "电视剧", value: "电视剧" },
            { title: "综艺", value: "综艺" },
          ]
        },
        {
          name: "tvGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "tvModus",
            value: ["电视剧"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "悬疑", value: "悬疑" },
            { title: "动画", value: "动画" },
            { title: "武侠", value: "武侠" },
            { title: "古装", value: "古装" },
            { title: "家庭", value: "家庭" },
            { title: "犯罪", value: "犯罪" },
            { title: "科幻", value: "科幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "历史", value: "历史" },
            { title: "战争", value: "战争" },
            { title: "动作", value: "动作" },
            { title: "冒险", value: "冒险" },
            { title: "传记", value: "传记" },
            { title: "剧情", value: "剧情" },
            { title: "奇幻", value: "奇幻" },
            { title: "惊悚", value: "惊悚" },
            { title: "灾难", value: "灾难" },
            { title: "歌舞", value: "歌舞" },
            { title: "音乐", value: "音乐" },
          ]
        },
        {
          name: "zyGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "tvModus",
            value: ["综艺"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "真人秀", value: "真人秀" },
            { title: "脱口秀", value: "脱口秀" },
            { title: "音乐", value: "音乐" },
            { title: "歌舞", value: "歌舞" },
          ]
        },
        {
          name: "region",
          title: "地区",
          type: "enumeration",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "华语", value: "华语" },
            { title: "欧美", value: "欧美" },
            { title: "韩国", value: "韩国" },
            { title: "日本", value: "日本" },
            { title: "中国大陆", value: "中国大陆" },
            { title: "中国香港", value: "中国香港" },
            { title: "中国台湾", value: "中国台湾" },
            { title: "美国", value: "美国" },
            { title: "英国", value: "英国" },
            { title: "法国", value: "法国" },
            { title: "德国", value: "德国" },
            { title: "意大利", value: "意大利" },
            { title: "西班牙", value: "西班牙" },
            { title: "印度", value: "印度" },
            { title: "泰国", value: "泰国" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020年代", value: "2020年代" },
            { title: "2010年代", value: "2010年代" },
            { title: "2000年代", value: "2000年代" },
            { title: "90年代", value: "90年代" },
            { title: "80年代", value: "80年代" },
            { title: "70年代", value: "70年代" },
            { title: "60年代", value: "60年代" },
            { title: "更早", value: "更早" },
          ]
        },
        {
          name: "platform",
          title: "平台",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["tv"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "腾讯视频", value: "腾讯视频" },
            { title: "爱奇艺", value: "爱奇艺" },
            { title: "优酷", value: "优酷" },
            { title: "湖南卫视", value: "湖南卫视" },
            { title: "Netflix", value: "Netflix" },
            { title: "HBO", value: "HBO" },
            { title: "BBC", value: "BBC" },
            { title: "NHK", value: "NHK" },
            { title: "CBS", value: "CBS" },
            { title: "NBC", value: "NBC" },
            { title: "tvN", value: "tvN" },
          ],
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          enumOptions: [
            { title: "综合排序", value: "T" },
            { title: "近期热度", value: "U" },
            { title: "首映时间", value: "R" },
            { title: "高分优选", value: "S" }
          ]
        },
        {
          name: "tags",
          title: "自定义标签",
          type: "input",
          description: "设置自定义标签，例如：丧尸,推理",
          value: "",
          placeholders: [
            {
              title: "空",
              value: "",
            },
            {
              title: "推理,悬疑",
              value: "推理,悬疑",
            },
            {
              title: "cult",
              value: "cult",
            },
            {
              title: "经典",
              value: "经典",
            },
            {
              title: "动作",
              value: "动作",
            },
            {
              title: "喜剧",
              value: "喜剧",
            },
            {
              title: "惊悚",
              value: "惊悚",
            },
            {
              title: "穿越",
              value: "穿越",
            },
            {
              title: "儿童",
              value: "儿童",
            },
            {
              title: "战争",
              value: "战争",
            },
          ]
        },
        {
          name: "rating",
          title: "评分",
          type: "input",
          description: "设置最低评分过滤，例如：6",
          placeholders: [
            {
              title: "0",
              value: "0",
            },
            {
              title: "1",
              value: "1",
            },
            {
              title: "2",
              value: "2",
            },
            {
              title: "3",
              value: "3",
            },
            {
              title: "4",
              value: "4",
            },
            {
              title: "5",
              value: "5",
            },
            {
              title: "6",
              value: "6",
            },
            {
              title: "7",
              value: "7",
            },
            {
              title: "8",
              value: "8",
            },
            {
              title: "9",
              value: "9",
            },
          ]
        },
        {
          name: "offset",
          title: "起始位置",
          type: "offset"
        }
      ]
    },
  ],
  version: "1.0.9",
  requiredVersion: "0.0.1",
  description: "解析豆瓣想看、在看、已看以及根据个人数据生成的个性化推荐【五折码：CHEAP.5;七折码：CHEAP】",
  author: "huangxd",
  site: "https://github.com/huangxd-/ForwardWidgets"
};

async function fetchDoubanPage(user_id, status, start, count) {
  const url = `https://m.douban.com/rexxar/api/v2/user/${user_id}/interests?status=${status}&start=${start}&count=${count}`;

  try {
    const response = await Widget.http.get(url, {
      headers: {
        Referer: `https://m.douban.com/mine/movie`,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    console.log("请求结果:", response.data);

    if (response.data && response.data.interests) {
      const items = response.data.interests;
      return [...new Set(
        items
          .filter((item) => item.subject.id != null)
          .map((item) => item.subject.id)
      )].map((id) => ({
        id,
        type: "douban",
      }));
    }
    return [];
  } catch (error) {
    console.error("获取页面数据失败:", error);
    return [];
  }
}

async function loadInterestItems(params = {}) {
  const page = params.page;
  const user_id = params.user_id || "";
  let status = params.status || "";
  const random = status === "random_mark";
  if (random) {
      status = "mark";
  }
  const count = random ? 50 : 20;
  const start = (page - 1) * count

  if (random) {
    if (page > 1) {
      return [];
    }
    // 获取所有页数据并随机抽取10个item
    let allDoubanIds = [];
    let currentStart = start;

    while (true) {
      const doubanIds = await fetchDoubanPage(user_id, status, currentStart, count);
      allDoubanIds = [...allDoubanIds, ...doubanIds];

      if (doubanIds.length < count) {
        break;
      }

      currentStart += count;
    }

    // 随机抽取10个item
    const shuffled = allDoubanIds.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(9, shuffled.length));
  } else {
    // 获取单页数据
    return await fetchDoubanPage(user_id, status, start, count);
  }
}

async function loadSuggestionItems(params = {}) {
  const page = params.page;
  const cookie = params.cookie || "";
  const type = params.type || "";
  const count = 20
  const start = (page - 1) * count
  const ckMatch = cookie.match(/ck=([^;]+)/);
  const ckValue = ckMatch ? ckMatch[1] : null;
  let url = `https://m.douban.com/rexxar/api/v2/${type}/suggestion?start=${start}&count=${count}&new_struct=1&with_review=1&ck=${ckValue}`;
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://m.douban.com/movie`,
      Cookie: cookie,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log("请求结果:", response.data);
  if (response.data && response.data.items) {
    const items = response.data.items;
    const doubanIds = items.filter((item) => item.id != null).map((item) => ({
      id: item.id,
      type: "douban",
    }));
    return doubanIds;
  }
  return [];
}

// 基础获取TMDB数据方法
async function fetchTmdbData(key, mediaType) {
    const tmdbResults = await Widget.tmdb.get(`/search/${mediaType}`, {
        params: {
            query: key,
            language: "zh_CN",
        }
    });
    //打印结果
    // console.log("搜索内容：" + key)
    if (!tmdbResults) {
      return [];
    }
    console.log("tmdbResults:" + JSON.stringify(tmdbResults, null, 2));
    // console.log("tmdbResults.total_results:" + tmdbResults.total_results);
    // console.log("tmdbResults.results[0]:" + tmdbResults.results[0]);
    return tmdbResults.results;
}

async function fetchImdbItems(scItems) {
  const promises = scItems.map(async (scItem) => {
    // 模拟API请求
    if (!scItem || !scItem.title) {
      return null;
    }
    let title = scItem.title.replace(/ 第[^季]*季/, '').replace(/歌手\d{4}/, '我是歌手');
    console.log("title: ", title, " ; type: ", scItem.type);
    const tmdbDatas = await fetchTmdbData(title, scItem.type)

    if (tmdbDatas.length !== 0) {
      return {
        id: tmdbDatas[0].id,
        type: "tmdb",
        title: tmdbDatas[0].title ?? tmdbDatas[0].name,
        description: tmdbDatas[0].overview,
        releaseDate: tmdbDatas[0].release_date ?? tmdbDatas[0].first_air_date,
        backdropPath: tmdbDatas[0].backdrop_path,
        posterPath: tmdbDatas[0].poster_path,
        rating: tmdbDatas[0].vote_average,
        mediaType: scItem.type !== "multi" ? scItem.type : tmdbDatas[0].media_type,
      };
    } else {
      return null;
    }
  });

  // 等待所有请求完成
  const items = (await Promise.all(promises)).filter(Boolean);

  // 去重：保留第一次出现的 title
  const seenTitles = new Set();
  const uniqueItems = items.filter((item) => {
    if (seenTitles.has(item.title)) {
      return false;
    }
    seenTitles.add(item.title);
    return true;
  });

  return uniqueItems;
}

// 解析豆瓣片单
async function loadCardItems(params = {}) {
  try {
    console.log("开始解析豆瓣片单...");
    console.log("参数:", params);
    // 获取片单 URL
    const url = params.url;
    if (!url) {
      console.error("缺少片单 URL");
      throw new Error("缺少片单 URL");
    }
    // 验证 URL 格式
    if (url.includes("douban.com/doulist/")) {
      return loadDefaultList(params);
    } else if (url.includes("douban.com/subject_collection/")) {
      return loadSubjectCollection(params);
    }
  } catch (error) {
    console.error("解析豆瓣片单失败:", error);
    throw error;
  }
}

async function loadDefaultList(params = {}) {
  const url = params.url;
  // 提取片单 ID
  const listId = url.match(/doulist\/(\d+)/)?.[1];
  console.debug("片单 ID:", listId);
  if (!listId) {
    console.error("无法获取片单 ID");
    throw new Error("无法获取片单 ID");
  }

  const page = params.page;
  const count = 25
  const start = (page - 1) * count
  // 构建片单页面 URL
  const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=seq&playable=0&sub_type=`;

  console.log("请求片单页面:", pageUrl);
  // 发送请求获取片单页面
  const response = await Widget.http.get(pageUrl, {
    headers: {
      Referer: `https://movie.douban.com/explore`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  if (!response || !response.data) {
    throw new Error("获取片单数据失败");
  }

  console.log("片单页面数据长度:", response.data.length);
  console.log("开始解析");

  // 解析 HTML 得到文档 ID
  const docId = Widget.dom.parse(response.data);
  if (docId < 0) {
    throw new Error("解析 HTML 失败");
  }
  console.log("解析成功:", docId);

  // 获取所有视频项，得到元素ID数组
  const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");

  console.log("items:", videoElementIds);

  let doubanIds = [];
  for (const itemId of videoElementIds) {
    const link = await Widget.dom.attr(itemId, "href");
    // 获取元素文本内容并分割
    const text = await Widget.dom.text(itemId);
    // 按空格分割文本并取第一部分
    const chineseTitle = text.trim().split(' ')[0];
    if (chineseTitle) {
      doubanIds.push({ title: chineseTitle, type: "multi" });
    }
  }

  const items = await fetchImdbItems(doubanIds);

  console.log(items)

  return items;
}

async function loadItemsFromApi(params = {}) {
  const url = params.url;
  console.log("请求 API 页面:", url);
  const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://m.douban.com/subject_collection/${listId}/`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log("请求结果:", response.data);
  if (response.data && response.data.subject_collection_items) {
    const scItems = response.data.subject_collection_items;

    const items = await fetchImdbItems(scItems);

    console.log(items)

    return items;
  }
  return [];
}

async function loadSubjectCollection(params = {}) {
  const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
  console.debug("合集 ID:", listId);
  if (!listId) {
    console.error("无法获取合集 ID");
    throw new Error("无法获取合集 ID");
  }

  const page = params.page;
  const count = 20
  const start = (page - 1) * count
  let pageUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
  if (params.type) {
    pageUrl += `&type=${params.type}`;
  }
  params.url = pageUrl;
  return await loadItemsFromApi(params);
}

async function loadRecommendMovies(params = {}) {
  return await loadRecommendItems(params, "movie");
}

async function loadRecommendShows(params = {}) {
  return await loadRecommendItems(params, "tv");
}

async function loadRecommendItems(params = {}, type = "movie") {
  const page = params.page;
  const count = 20
  const start = (page - 1) * count
  const category = params.category || "";
  const categoryType = params.type || "";
  let url = `https://m.douban.com/rexxar/api/v2/subject/recent_hot/${type}?start=${start}&limit=${count}&category=${category}&type=${categoryType}`;
  if (category == "all") {
    url = `https://m.douban.com/rexxar/api/v2/${type}/recommend?refresh=0&start=${start}&count=${count}&selected_categories=%7B%7D&uncollect=false&score_range=0,10&tags=`;
  }
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://movie.douban.com/${type}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log("请求结果:", response.data);
  if (response.data && response.data.items) {
    const recItems = response.data.items;

    const items = await fetchImdbItems(recItems);

    console.log(items)

    return items;
  }
  return [];
}

// 观影偏好
async function getPreferenceRecommendations(params = {}) {
    try {
        const rating = params.rating || "0";
        if (!/^\d$/.test(String(rating))) throw new Error("评分必须为 0～9 的整数");

        const selectedCategories = {
            "类型": params.movieGenre || params.tvGenre || params.zyGenre || "",
            "地区": params.region || "",
            "形式": params.tvModus || "",
        };
        console.log("selectedCategories: ", selectedCategories);

        const tags_sub = [];
        if (params.movieGenre) tags_sub.push(params.movieGenre);
        if (params.tvModus && !params.tvGenre && !params.zyGenre) tags_sub.push(params.tvModus);
        if (params.tvModus && params.tvGenre) tags_sub.push(params.tvGenre);
        if (params.tvModus && params.zyGenre) tags_sub.push(params.zyGenre);
        if (params.region) tags_sub.push(params.region);
        if (params.year) tags_sub.push(params.year);
        if (params.platform) tags_sub.push(params.platform);
        if (params.tags) {
          const customTagsArray = params.tags.split(',').filter(tag => tag.trim() !== '');
          tags_sub.push(...customTagsArray);
        }
        console.log("tags_sub: ", tags_sub);

        const limit = 20;
        const offset = Number(params.offset);
        const url = `https://m.douban.com/rexxar/api/v2/${params.mediaType}/recommend?refresh=0&start=${offset}&count=${Number(offset) + limit}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=${rating},10&tags=${encodeURIComponent(tags_sub.join(","))}&sort=${params.sort_by}`;

        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://movie.douban.com/explore"
            }
        });

        if (!response.data?.items?.length) throw new Error("未找到匹配的影视作品");

        const validItems = response.data.items.filter(item => item.card === "subject");

        if (!validItems.length) throw new Error("未找到有效的影视作品");

        const items = await fetchImdbItems(validItems);

        console.log(items)

        return items;
    } catch (error) {
        throw error;
    }
}
