"use client";

import { useState, FormEvent } from "react";
import {
  Search,
  ShoppingBag,
  Monitor,
  Gavel,
  ExternalLink,
  CheckSquare,
  Square,
} from "lucide-react";
import clsx from "clsx";

// サイト定義の型
type Site = {
  id: string;
  name: string;
  urlTemplate: string;
  color: string;
  domain: string; // Favicon取得用ドメイン
};

type Category = {
  id: string;
  title: string;
  icon: React.ElementType;
  sites: Site[];
};

// サイトデータ定義
const SITE_CATEGORIES: Category[] = [
  {
    id: "general",
    title: "総合通販・価格比較",
    icon: ShoppingBag,
    sites: [
      {
        id: "amazon",
        name: "Amazon.co.jp",
        urlTemplate: "https://www.amazon.co.jp/s?k={keyword}",
        color: "text-yellow-600",
        domain: "amazon.co.jp",
      },
      {
        id: "rakuten",
        name: "楽天市場",
        urlTemplate: "https://search.rakuten.co.jp/search/mall/{keyword}/",
        color: "text-red-600",
        domain: "rakuten.co.jp",
      },
      {
        id: "yahoo_shopping",
        name: "Yahoo!ショッピング",
        urlTemplate: "https://shopping.yahoo.co.jp/search?p={keyword}",
        color: "text-red-500",
        domain: "shopping.yahoo.co.jp",
      },
      {
        id: "kakaku",
        name: "価格.com",
        urlTemplate: "https://kakaku.com/search_results/{keyword}/",
        color: "text-blue-700",
        domain: "kakaku.com",
      },
    ],
  },
  {
    id: "electronics",
    title: "家電量販店",
    icon: Monitor,
    sites: [
      {
        id: "yodobashi",
        name: "ヨドバシ.com",
        urlTemplate: "https://www.yodobashi.com/ec/category/index.html?word={keyword}",
        color: "text-gray-800",
        domain: "www.yodobashi.com",
      },
      {
        id: "biccamera",
        name: "ビックカメラ",
        urlTemplate: "https://www.biccamera.com/bc/category/?q={keyword}",
        color: "text-red-600",
        domain: "www.biccamera.com",
      },
      {
        id: "joshin",
        name: "Joshin web",
        urlTemplate: "https://joshinweb.jp/search/result.html?KEYWORD={keyword}",
        color: "text-red-500",
        domain: "joshinweb.jp",
      },
      {
        id: "edion",
        name: "エディオン",
        urlTemplate: "https://www.edion.com/item_list.html?keyword={keyword}",
        color: "text-blue-600",
        domain: "www.edion.com",
      },
    ],
  },
  {
    id: "flea",
    title: "フリマ・オークション",
    icon: Gavel,
    sites: [
      {
        id: "mercari",
        name: "メルカリ",
        urlTemplate: "https://jp.mercari.com/search?keyword={keyword}",
        color: "text-red-500",
        domain: "jp.mercari.com",
      },
      {
        id: "rakuma",
        name: "ラクマ",
        urlTemplate: "https://fril.jp/s?query={keyword}",
        color: "text-red-400",
        domain: "rakuma.rakuten.co.jp",
      },
      {
        id: "yahoo_auction",
        name: "ヤフオク!",
        urlTemplate: "https://auctions.yahoo.co.jp/search/search?p={keyword}",
        color: "text-yellow-600",
        domain: "auctions.yahoo.co.jp",
      },
      {
        id: "yahoo_fleamarket",
        name: "Yahoo!フリマ",
        urlTemplate: "https://paypayfleamarket.yahoo.co.jp/search/{keyword}",
        color: "text-red-500",
        domain: "paypayfleamarket.yahoo.co.jp",
      },
    ],
  },
];

// 全サイトのIDリスト
const ALL_SITE_IDS = SITE_CATEGORIES.flatMap((cat) =>
  cat.sites.map((site) => site.id)
);

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [selectedSites, setSelectedSites] = useState<Set<string>>(
    new Set(["amazon", "rakuten", "yahoo_shopping", "yodobashi", "mercari"])
  );

  const isAllSelected = selectedSites.size === ALL_SITE_IDS.length;

  const toggleSite = (id: string) => {
    const newSelected = new Set(selectedSites);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSites(newSelected);
  };

  const toggleCategory = (siteIds: string[]) => {
    const allCategorySitesSelected = siteIds.every((id) =>
      selectedSites.has(id)
    );
    const newSelected = new Set(selectedSites);

    if (allCategorySitesSelected) {
      siteIds.forEach((id) => newSelected.delete(id));
    } else {
      siteIds.forEach((id) => newSelected.add(id));
    }
    setSelectedSites(newSelected);
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedSites(new Set());
    } else {
      setSelectedSites(new Set(ALL_SITE_IDS));
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const sitesToSearch = ALL_SITE_IDS.filter((id) => selectedSites.has(id));
    
    // 各サイトの定義を探して開く
    sitesToSearch.forEach((id) => {
      const category = SITE_CATEGORIES.find((cat) => 
        cat.sites.some((s) => s.id === id)
      );
      const site = category?.sites.find((s) => s.id === id);
      
      if (site) {
        const url = site.urlTemplate.replace("{keyword}", encodeURIComponent(keyword));
        window.open(url, "_blank");
      }
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
            ECサイト横断検索
          </h1>
          <p className="text-slate-500 text-lg">
            Amazon, 楽天, Yahoo, メルカリなどをワンクリックで比較
          </p>
        </div>

        {/* メインカード */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8 border border-slate-200">
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
              一括商品検索ツール
            </h2>
            
            {/* 検索フォーム */}
            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors outline-none placeholder:text-slate-400"
                  placeholder="商品名、型番、キーワードなどを入力..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  autoFocus
                />
              </div>
            </form>
          </div>

          {/* サイト選択エリア */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-sm font-bold text-slate-500">検索対象サイト</span>
              <button
                onClick={toggleAll}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                {isAllSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                全て選択
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {SITE_CATEGORIES.map((category) => {
                const categorySiteIds = category.sites.map((s) => s.id);
                const isCategoryAllSelected = categorySiteIds.every((id) =>
                  selectedSites.has(id)
                );

                return (
                  <div key={category.id} className="space-y-3">
                    <div 
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => toggleCategory(categorySiteIds)}
                    >
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <category.icon className="h-5 w-5" />
                        {category.title}
                      </div>
                      <div className={`text-slate-300 group-hover:text-blue-500 transition-colors`}>
                        {isCategoryAllSelected ? (
                          <CheckSquare className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {category.sites.map((site) => (
                        <div
                          key={site.id}
                          onClick={() => toggleSite(site.id)}
                          className={clsx(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none",
                            selectedSites.has(site.id)
                              ? "bg-blue-50 border-blue-200 shadow-sm"
                              : "bg-white border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <div
                            className={clsx(
                              "flex-shrink-0 transition-colors",
                              selectedSites.has(site.id) ? "text-blue-600" : "text-slate-300"
                            )}
                          >
                            {selectedSites.has(site.id) ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-shrink-0 p-1 bg-white rounded-md border border-slate-100 overflow-hidden">
                            {/* Faviconを取得して表示 */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
                              alt={`${site.name} logo`}
                              className="h-6 w-6 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <span className="font-medium text-slate-700">{site.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="pt-4 space-y-4">
            <button
              onClick={handleSearch}
              disabled={!keyword.trim()}
              className="w-full bg-slate-200 hover:bg-blue-600 text-slate-500 hover:text-white font-bold text-lg py-4 rounded-xl transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-200 disabled:hover:text-slate-500 flex items-center justify-center gap-2 group"
              style={keyword.trim() ? { backgroundColor: '#2563eb', color: 'white' } : {}}
            >
              <ExternalLink className="h-5 w-5" />
              選択したサイトで一括検索
            </button>
            
            <div className="flex items-start justify-center gap-2 text-slate-500 text-xs text-center">
              {/* <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /> */}
              <p>※ ブラウザのポップアップブロックが有効になっていると、タブが開かない場合があります。</p>
            </div>
          </div>
        </div>
        
        {/* フッター */}
        <footer className="text-center text-slate-400 text-sm pb-8">
          &copy; 2025 EC Search Tool
        </footer>
      </div>
    </main>
  );
}
