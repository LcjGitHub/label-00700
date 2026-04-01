/**
 * 数据统计模块
 */

// Storage 对象由 main.js 统一管理，此处直接使用全局对象 window.Storage
// 注意：由于 ES6 模块加载顺序，直接使用 window.Storage，而不是创建本地常量

export const StatsModule = {
  render() {
    const routes = window.Storage.getRoutes();
    const vehicles = window.Storage.getVehicles();
    const drivers = window.Storage.getDrivers();

    // 1. 基础统计
    const totalRoutes = routes.length;
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'running').length;
    const stoppedVehicles = vehicles.filter(v => v.status === 'stopped').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
    const activeRate = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
    const totalDrivers = drivers.length;
    const workingDrivers = drivers.filter(d => d.status === 'working').length;
    const restingDrivers = drivers.filter(d => d.status === 'rest').length;
    const offlineDrivers = drivers.filter(d => d.status === 'offline').length;
    const totalDrivingHours = drivers.reduce((sum, d) => sum + parseFloat(d.drivingHours || 0), 0).toFixed(1);
    const workingRate = totalDrivers > 0 ? Math.round((workingDrivers / totalDrivers) * 100) : 0;

    // 计算平均站点数
    const avgStations = routes.length > 0
      ? Math.round(routes.reduce((sum, r) => sum + r.stations.length, 0) / routes.length)
      : 0;

    // 2. 计算热门站点 (出现频率最高的站点)
    const stationCounts = {};
    routes.forEach(r => {
      r.stations.forEach(s => {
        stationCounts[s] = (stationCounts[s] || 0) + 1;
      });
    });

    const topStations = Object.entries(stationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // 渲染 DOM - 使用新的卡片结构
    this.renderStatCards({
      totalRoutes,
      totalVehicles,
      activeVehicles,
      stoppedVehicles,
      maintenanceVehicles,
      activeRate,
      avgStations,
      totalDrivers,
      workingDrivers,
      restingDrivers,
      offlineDrivers,
      totalDrivingHours,
      workingRate
    });

    // 渲染图标（延迟确保 DOM 已更新）
    setTimeout(() => {
      const iconStatRoute = document.getElementById('icon-stat-route');
      const iconStatBus = document.getElementById('icon-stat-bus');
      const iconStatDriver = document.getElementById('icon-stat-driver');
      const iconStatActive = document.getElementById('icon-stat-active');

      if (iconStatRoute) {
        iconStatRoute.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-blue-600"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0-.836-.88 1.38 1.628 1.006l3.869-1.934c-.317.159-.69.159-1.006 0l4.994 2.497c.317.159.69.159 1.006 0Z" /></svg>`;
      }
      if (iconStatBus) {
        iconStatBus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-amber-600"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>`;
      }
      if (iconStatDriver) {
        iconStatDriver.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-purple-600"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0m8.25 4.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" /></svg>`;
      }
      if (iconStatActive) {
        iconStatActive.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-emerald-600"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125 1.125 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>`;
      }
    }, 100);

    const topStationsEl = document.getElementById('stat-top-stations');
    if (topStations.length > 0) {
      topStationsEl.innerHTML = topStations.map((item, index) => {
        // 使用不同颜色系
        const rankColors = [
          {
            bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
            border: 'border-l-4 border-blue-500',
            text: 'text-blue-900',
            badge: 'bg-blue-500 text-white',
            badgeShadow: 'shadow-lg'
          },
          {
            bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
            border: 'border-l-4 border-amber-500',
            text: 'text-amber-900',
            badge: 'bg-amber-500 text-white',
            badgeShadow: 'shadow-lg'
          },
          {
            bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
            border: 'border-l-4 border-emerald-500',
            text: 'text-emerald-900',
            badge: 'bg-emerald-500 text-white',
            badgeShadow: 'shadow-lg'
          }
        ];
        const colors = rankColors[index] || rankColors[2];

        return `
        <div class="flex justify-between items-center p-5 rounded-xl ${colors.border} ${colors.bg} ${colors.text} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-t border-r border-b border-gray-200">
          <div class="flex items-center gap-4">
            <span class="w-10 h-10 flex items-center justify-center rounded-xl ${colors.badge} ${colors.badgeShadow} text-base font-bold">
              ${index + 1}
            </span>
            <div>
              <span class="font-bold text-xl block">${item[0]}</span>
              <span class="text-sm ${colors.text.replace('900', '600')} font-medium">热门站点</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold ${colors.text} block">${item[1]}</span>
            <span class="text-xs ${colors.text.replace('900', '600')} font-medium">条线路</span>
          </div>
        </div>
      `;
      }).join('');
    } else {
      topStationsEl.innerHTML = `
        <div class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p class="text-gray-500 font-medium">暂无站点数据</p>
        </div>
      `;
    }
  },

  renderStatCards(data) {
    const { totalRoutes, totalVehicles, activeVehicles, stoppedVehicles, maintenanceVehicles, activeRate, avgStations, totalDrivers, workingDrivers, restingDrivers, offlineDrivers, totalDrivingHours, workingRate } = data;

    // 卡片1：运营线路总数
    document.getElementById('stat-card-routes').innerHTML = `
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="text-sm font-semibold text-blue-600 mb-1 uppercase tracking-wide">运营线路总数</div>
          <div class="text-4xl font-bold text-blue-900 mb-2">${totalRoutes}</div>
          <div class="text-xs text-blue-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            实时数据
          </div>
        </div>
        <div class="p-3 bg-blue-100 rounded-xl" id="icon-stat-route"></div>
      </div>
      <div class="pt-4 border-t border-blue-200">
        <div class="flex items-center justify-between text-xs">
          <span class="text-blue-600">平均站点数</span>
          <span class="font-bold text-blue-900">${avgStations} 站</span>
        </div>
      </div>
    `;

    // 卡片2：车辆总数
    document.getElementById('stat-card-vehicles').innerHTML = `
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="text-sm font-semibold text-amber-600 mb-1 uppercase tracking-wide">车辆总数</div>
          <div class="text-4xl font-bold text-amber-900 mb-2">${totalVehicles}</div>
          <div class="text-xs text-amber-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            实时数据
          </div>
        </div>
        <div class="p-3 bg-amber-100 rounded-xl" id="icon-stat-bus"></div>
      </div>
      <div class="pt-4 border-t border-amber-200 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-amber-600">运行中</span>
          <span class="font-bold text-amber-900">${activeVehicles} 辆</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-amber-600">已停运</span>
          <span class="font-bold text-amber-900">${stoppedVehicles} 辆</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-amber-600">维修中</span>
          <span class="font-bold text-amber-900">${maintenanceVehicles} 辆</span>
        </div>
      </div>
    `;

    // 卡片3：司机总数
    document.getElementById('stat-card-drivers').innerHTML = `
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="text-sm font-semibold text-purple-600 mb-1 uppercase tracking-wide">司机总数</div>
          <div class="text-4xl font-bold text-purple-900 mb-2">${totalDrivers}</div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">${workingRate}%</span>
            <span class="text-xs text-purple-600">在岗率</span>
          </div>
        </div>
        <div class="p-3 bg-purple-100 rounded-xl" id="icon-stat-driver"></div>
      </div>
      <div class="pt-4 border-t border-purple-200 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-purple-600">工作中</span>
          <span class="font-bold text-purple-900">${workingDrivers} 人</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-purple-600">休息中</span>
          <span class="font-bold text-purple-900">${restingDrivers} 人</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-purple-600">累计驾驶</span>
          <span class="font-bold text-purple-900">${totalDrivingHours} 小时</span>
        </div>
      </div>
    `;

    // 卡片4：今日活跃车辆
    document.getElementById('stat-card-active').innerHTML = `
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="text-sm font-semibold text-emerald-600 mb-1 uppercase tracking-wide">今日活跃车辆</div>
          <div class="text-4xl font-bold text-emerald-900 mb-2">${activeVehicles}</div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">${activeRate}%</span>
            <span class="text-xs text-emerald-600">活跃率</span>
          </div>
        </div>
        <div class="p-3 bg-emerald-100 rounded-xl" id="icon-stat-active"></div>
      </div>
      <div class="pt-4 border-t border-emerald-200">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-emerald-600">总车辆数</span>
          <span class="font-bold text-emerald-900">${totalVehicles} 辆</span>
        </div>
        <div class="w-full bg-emerald-200 rounded-full h-2 mt-2">
          <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${activeRate}%"></div>
        </div>
      </div>
    `;
  }
};
