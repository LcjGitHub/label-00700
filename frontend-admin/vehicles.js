/**
 * 车辆调度模块
 */

// Storage 和 UI 对象由 main.js 统一管理，此处直接使用全局对象 window.Storage
// 注意：由于 ES6 模块加载顺序，直接使用 window.Storage，而不是创建本地常量

// ========== 车辆调度模块 ==========
export const VehiclesModule = {
  render(filterStatus = 'all') {
    const vehicles = window.Storage.getVehicles();
    const routes = window.Storage.getRoutes();
    const listEl = document.getElementById('vehicles-list');
    const routeMap = Object.fromEntries(routes.map(r => [r.id, r]));

    let filteredVehicles = vehicles;
    if (filterStatus !== 'all') {
      filteredVehicles = vehicles.filter(v => v.status === filterStatus);
    }

    if (filteredVehicles.length === 0) {
      listEl.innerHTML = `
        <div class="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300 shadow-inner">
          <div class="text-4xl mb-4">🚗</div>
          <p class="text-lg font-medium text-gray-600 mb-2">没有找到符合条件的车辆</p>
          <p class="text-small text-gray-500">请尝试调整筛选条件</p>
        </div>`;
      return;
    }

    listEl.innerHTML = filteredVehicles.map(vehicle => {
      const route = routeMap[vehicle.routeId] || { start: '未知', end: '未知' };
      let statusText = '未知';
      
      switch(vehicle.status) {
        case 'running': 
          statusText = '运行中'; 
          break;
        case 'stopped': 
          statusText = '已停运'; 
          break;
        case 'maintenance': 
          statusText = '维修中'; 
          break;
      }

      const topBarColor = vehicle.status === 'running' 
        ? 'from-green-500 via-green-400 to-green-500' 
        : (vehicle.status === 'stopped' 
          ? 'from-gray-400 via-gray-300 to-gray-400' 
          : 'from-orange-500 via-orange-400 to-orange-500');
      
      return `
      <div class="card card-hover flex flex-col justify-between h-full p-5 relative overflow-hidden border-l-4 ${vehicle.status === 'running' ? 'border-l-green-500' : (vehicle.status === 'stopped' ? 'border-l-gray-400' : 'border-l-orange-500')}">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topBarColor}"></div>
        <div class="flex-1 pt-2">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span class="bg-gradient-to-r ${vehicle.status === 'running' ? 'from-green-600 to-green-700' : (vehicle.status === 'stopped' ? 'from-gray-600 to-gray-700' : 'from-orange-600 to-orange-700')} text-white px-3 py-1.5 rounded-lg font-bold text-base shadow-lg border ${vehicle.status === 'running' ? 'border-green-800/20' : (vehicle.status === 'stopped' ? 'border-gray-800/20' : 'border-orange-800/20')}">${vehicle.id}</span>
            <span class="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold">${statusText}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-800 font-semibold mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-2.5 rounded-lg border border-blue-100">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
            <span class="text-base font-bold flex-1 truncate max-w-[120px]" title="${vehicle.routeId}路">${vehicle.routeId}路</span>
            <span class="text-gray-400 text-sm">→</span>
            <span class="text-xs text-gray-600 flex-1 truncate">${route.start} - ${route.end}</span>
          </div>
          <div class="mb-4">
            <div class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              车辆状态
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span class="px-2 py-1 rounded-md text-xs border font-medium ${vehicle.status === 'running' ? 'bg-green-100 text-green-800 border-green-200' : (vehicle.status === 'stopped' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-orange-100 text-orange-800 border-orange-200')}">${statusText}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
          <button onclick="window.updateVehicleStatus('${vehicle.id}', 'running')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 active:scale-95 transition-all text-xs font-semibold border border-green-300 shadow-sm hover:shadow-md ${vehicle.status === 'running' ? 'ring-2 ring-green-200' : ''}">运行</button>
          <button onclick="window.updateVehicleStatus('${vehicle.id}', 'stopped')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 active:scale-95 transition-all text-xs font-semibold border border-gray-300 shadow-sm hover:shadow-md ${vehicle.status === 'stopped' ? 'ring-2 ring-gray-200' : ''}">停运</button>
          <button onclick="window.updateVehicleStatus('${vehicle.id}', 'maintenance')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-lg hover:from-orange-100 hover:to-orange-200 active:scale-95 transition-all text-xs font-semibold border border-orange-300 shadow-sm hover:shadow-md ${vehicle.status === 'maintenance' ? 'ring-2 ring-orange-200' : ''}">维修</button>
        </div>
      </div>
      `;
    }).join('');
  },

  updateStatus(id, newStatus) {
    const vehicles = window.Storage.getVehicles();
    const target = vehicles.find(v => v.id === id);
    if (target && target.status !== newStatus) {
      target.status = newStatus;
      window.Storage.saveVehicles(vehicles);
      window.UI.showToast(`车辆 ${id} 状态更新为 ${newStatus === 'running' ? '运行中' : (newStatus === 'stopped' ? '已停运' : '维修中')}`);
      const currentFilter = window.vehicleFilterInstance ? window.vehicleFilterInstance.getValue() : 'all';
      this.render(currentFilter);
    }
  }
};
