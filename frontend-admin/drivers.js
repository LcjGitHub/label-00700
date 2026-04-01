/**
 * 人员调度模块
 */

// Storage 对象由 main.js 统一管理，此处直接使用全局对象 window.Storage
// 注意：由于 ES6 模块加载顺序，直接使用 window.Storage，而不是创建本地常量

// ========== SVG 图标库 ==========
const Icons = {
  edit: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`
};

// ========== 人员调度模块 ==========
export const DriversModule = {
  render(filterStatus = 'all') {
    const drivers = window.Storage.getDrivers();
    const vehicles = window.Storage.getVehicles();
    const listEl = document.getElementById('drivers-list');
    const vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v]));

    let filteredDrivers = drivers;
    if (filterStatus !== 'all') {
      filteredDrivers = drivers.filter(d => d.status === filterStatus);
    }

    if (filteredDrivers.length === 0) {
      listEl.innerHTML = `
        <div class="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300 shadow-inner">
          <div class="text-4xl mb-4">👨‍✈️</div>
          <p class="text-lg font-medium text-gray-600 mb-2">没有找到符合条件的司机</p>
          <p class="text-small text-gray-500">请尝试调整筛选条件</p>
        </div>`;
      return;
    }

    listEl.innerHTML = filteredDrivers.map(driver => {
      const vehicle = vehicleMap[driver.vehicleId];
      let statusText = '未知';
      
      switch(driver.status) {
        case 'working': 
          statusText = '工作中'; 
          break;
        case 'resting': 
          statusText = '休息中'; 
          break;
        case 'leave': 
          statusText = '请假中'; 
          break;
      }

      const topBarColor = driver.status === 'working' 
        ? 'from-green-500 via-green-400 to-green-500' 
        : (driver.status === 'resting' 
          ? 'from-blue-400 via-blue-300 to-blue-400' 
          : 'from-orange-500 via-orange-400 to-orange-500');

      const driveTimeStr = this.formatDriveTime(driver.driveTime);

      return `
      <div class="card card-hover flex flex-col justify-between h-full p-5 relative overflow-hidden border-l-4 ${driver.status === 'working' ? 'border-l-green-500' : (driver.status === 'resting' ? 'border-l-blue-400' : 'border-l-orange-500')}">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topBarColor}"></div>
        <div class="flex-1 pt-2">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span class="bg-gradient-to-r ${driver.status === 'working' ? 'from-green-600 to-green-700' : (driver.status === 'resting' ? 'from-blue-600 to-blue-700' : 'from-orange-600 to-orange-700')} text-white px-3 py-1.5 rounded-lg font-bold text-base shadow-lg border ${driver.status === 'working' ? 'border-green-800/20' : (driver.status === 'resting' ? 'border-blue-800/20' : 'border-orange-800/20')}">${driver.id}</span>
            <span class="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold">${statusText}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-800 font-semibold mb-4 bg-gradient-to-r from-purple-50 to-pink-50 p-2.5 rounded-lg border border-purple-100">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm"></span>
            <span class="text-base font-bold flex-1 truncate">${driver.name}</span>
          </div>
          <div class="mb-3">
            <div class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              分配车辆
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span class="px-2 py-1 rounded-md text-xs border font-medium ${driver.vehicleId ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}">${vehicle ? vehicle.id : '未分配'}</span>
            </div>
          </div>
          <div class="mb-4">
            <div class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              累计驾驶时长
            </div>
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
              <span class="text-lg font-bold text-gray-800">${driveTimeStr}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
          <button onclick="window.updateDriverStatus('${driver.id}', 'working')" class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 active:scale-95 transition-all text-xs font-semibold border border-green-300 shadow-sm hover:shadow-md ${driver.status === 'working' ? 'ring-2 ring-green-200' : ''}">工作</button>
          <button onclick="window.updateDriverStatus('${driver.id}', 'resting')" class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 active:scale-95 transition-all text-xs font-semibold border border-blue-300 shadow-sm hover:shadow-md ${driver.status === 'resting' ? 'ring-2 ring-blue-200' : ''}">休息</button>
          <button onclick="window.updateDriverStatus('${driver.id}', 'leave')" class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-lg hover:from-orange-100 hover:to-orange-200 active:scale-95 transition-all text-xs font-semibold border border-orange-300 shadow-sm hover:shadow-md ${driver.status === 'leave' ? 'ring-2 ring-orange-200' : ''}">请假</button>
        </div>
        <div class="flex gap-2 pt-3 border-t border-gray-100">
          <button onclick="window.editDriver('${driver.id}')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 active:scale-95 transition-all text-xs font-semibold border border-purple-300 shadow-sm hover:shadow-md">
            ${Icons.edit} 编辑
          </button>
          <button onclick="window.deleteDriver('${driver.id}')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 active:scale-95 transition-all text-xs font-semibold border border-red-300 shadow-sm hover:shadow-md">
            ${Icons.trash} 删除
          </button>
        </div>
      </div>
      `;
    }).join('');
  },

  formatDriveTime(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  },

  updateStatus(id, newStatus) {
    const drivers = window.Storage.getDrivers();
    const target = drivers.find(d => d.id === id);
    if (target && target.status !== newStatus) {
      target.status = newStatus;
      if (newStatus !== 'working') {
        target.vehicleId = '';
      }
      window.Storage.saveDrivers(drivers);
      let statusText = '';
      switch(newStatus) {
        case 'working': statusText = '工作中'; break;
        case 'resting': statusText = '休息中'; break;
        case 'leave': statusText = '请假中'; break;
      }
      window.UI.showToast(`司机 ${target.name} 状态更新为 ${statusText}`);
      const currentFilter = window.driverFilterInstance ? window.driverFilterInstance.getValue() : 'all';
      this.render(currentFilter);
    }
  },

  handleDelete(id) {
    window.UI.confirm(
      '确定要删除这位司机吗？',
      () => {
        const drivers = window.Storage.getDrivers().filter(d => d.id !== id);
        window.Storage.saveDrivers(drivers);
        window.UI.showToast('删除成功');
        const currentFilter = window.driverFilterInstance ? window.driverFilterInstance.getValue() : 'all';
        this.render(currentFilter);
      },
      {
        title: '删除确认',
        type: 'danger',
        confirmText: '删除',
        cancelText: '取消'
      }
    );
  },

  handleSave(formData) {
    const drivers = window.Storage.getDrivers();
    const existingIndex = drivers.findIndex(d => d.id === formData.id);
    const originalIndex = formData.originalId ? drivers.findIndex(d => d.id === formData.originalId) : -1;

    const newDriver = {
      id: formData.id,
      name: formData.name,
      status: formData.status,
      vehicleId: formData.vehicleId || '',
      driveTime: formData.driveTime ? parseInt(formData.driveTime) : 0
    };

    if (formData.isEdit) {
      if (formData.originalId && formData.originalId !== formData.id) {
        if (existingIndex > -1) {
          window.UI.showToast('该工号已存在', 'error');
          return false;
        }
        if (originalIndex > -1) {
          drivers.splice(originalIndex, 1);
        }
        drivers.push(newDriver);
        window.UI.showToast('司机信息修改成功');
      } else {
        if (originalIndex > -1) {
          drivers[originalIndex] = newDriver;
          window.UI.showToast('司机信息修改成功');
        } else {
          window.UI.showToast('未找到要修改的司机', 'error');
          return false;
        }
      }
    } else {
      if (existingIndex > -1) {
        window.UI.showToast('该工号已存在', 'error');
        return false;
      }
      drivers.push(newDriver);
      window.UI.showToast('司机新增成功');
    }

    window.Storage.saveDrivers(drivers);
    const currentFilter = window.driverFilterInstance ? window.driverFilterInstance.getValue() : 'all';
    this.render(currentFilter);
    return true;
  }
};
