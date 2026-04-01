/**
 * 站点查询模块
 */

// Storage 对象由 main.js 统一管理，此处直接使用全局对象 window.Storage
// 注意：由于 ES6 模块加载顺序，直接使用 window.Storage，而不是创建本地常量

// ========== 站点查询模块 ==========
export const StationsModule = {
  render() {
    document.getElementById('station-results').innerHTML = `
      <div class="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300 shadow-inner">
        <div class="text-4xl mb-4">🔍</div>
        <p class="text-lg font-medium text-gray-600 mb-2">请输入站点名称进行搜索</p>
        <p class="text-small text-gray-500">实时查看公交到站时间</p>
      </div>
    `;
  },

  highlight(text, keyword) {
    if (!keyword.trim()) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    // 移除高亮样式，直接返回匹配的文本（不添加任何样式）
    return text.replace(regex, '$1');
  },

  search(keyword) {
    const resultsContainer = document.getElementById('station-results');
    if (!keyword.trim()) {
      this.render();
      return;
    }

    const routes = window.Storage.getRoutes();
    const vehicles = window.Storage.getVehicles();

    const matchedRoutes = routes.filter(r =>
      r.stations.some(s => s.toLowerCase().includes(keyword.toLowerCase()))
    );

    if (matchedRoutes.length === 0) {
      resultsContainer.innerHTML = `
        <div class="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300 shadow-inner">
          <div class="text-4xl mb-4">🔍</div>
          <p class="text-lg font-medium text-gray-600 mb-2">没有找到途经 "${keyword}" 的线路</p>
          <p class="text-small text-gray-500">请尝试其他站点名称</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matchedRoutes.map(route => {
      const estimatedTime = Math.floor(Math.random() * 15) + 1;
      const activeBusCount = vehicles.filter(v => v.routeId === route.id && v.status === 'running').length;
      const matchedStation = route.stations.find(s => s.toLowerCase().includes(keyword.toLowerCase()));

      return `
      <div class="card card-hover flex flex-col justify-between h-full p-5 relative overflow-hidden border-l-4 border-l-blue-500">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"></div>
        <div class="flex-1 pt-2">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-base shadow-lg border border-blue-800/20 max-w-[120px] truncate" title="${route.id}路">${route.id}路</span>
              <span class="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold max-w-[200px] truncate" title="开往 ${route.end}">开往 ${this.highlight(route.end, keyword)}</span>
            </div>
            <div class="text-right bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-3 rounded-lg border border-blue-200 shadow-sm">
              <div class="text-3xl font-bold text-blue-700">${estimatedTime}<span class="text-base font-normal text-gray-600 ml-1">分钟</span></div>
              <div class="text-xs text-gray-500 font-medium mt-1">预计到站</div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-gray-800 font-semibold mb-4 bg-gradient-to-r from-green-50 to-blue-50 p-2.5 rounded-lg border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-green-600 flex-shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span class="text-xs text-gray-600 font-medium flex-shrink-0">匹配站点:</span>
            <span class="text-base font-bold flex-1 min-w-0 truncate" title="${matchedStation}">${this.highlight(matchedStation, keyword)}</span>
          </div>
          <div class="mb-4">
            <div class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0Z" />
              </svg>
              线路信息
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs border border-blue-200 font-medium max-w-[280px] truncate" title="${route.start} → ${route.end}">${this.highlight(route.start, keyword)} → ${this.highlight(route.end, keyword)}</span>
              <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs border border-gray-200 font-medium">${route.time}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span class="font-medium">在线车辆:</span>
            <span class="font-bold ${activeBusCount > 0 ? 'text-green-600' : 'text-gray-400'}">${activeBusCount}</span>
            <span class="text-gray-500">辆</span>
          </div>
          <div class="text-xs text-gray-500 font-medium">
            ${route.stations.length} 个站点
          </div>
        </div>
      </div>
      `;
    }).join('');
  }
};
