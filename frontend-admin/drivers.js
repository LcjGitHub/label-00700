/**
 * 人员调度模块
 */

// Storage 和 UI 对象由 main.js 统一管理，此处直接使用全局对象 window.Storage
// 注意：由于 ES6 模块加载顺序，直接使用 window.Storage，而不是创建本地常量

// ========== SVG 图标库 ==========
const Icons = {
  edit: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`
};

// ========== 人员调度模块 ==========
export const DriversModule = {
  searchKeyword: '',

  render(searchKeyword = '') {
    this.searchKeyword = searchKeyword;
    const drivers = window.Storage.getDrivers();
    const vehicles = window.Storage.getVehicles();
    const listEl = document.getElementById('drivers-list');
    const resultEl = document.getElementById('driver-search-result');
    const vehicleMap = Object.fromEntries(vehicles.map(v => [v.id, v]));

    let filteredDrivers = drivers;
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(keyword) ||
        driver.employeeId.toLowerCase().includes(keyword) ||
        driver.phone.includes(keyword)
      );

      if (resultEl) {
        resultEl.classList.remove('hidden');
        resultEl.innerHTML = `找到 <span class="font-semibold text-blue-600">${filteredDrivers.length}</span> 位匹配的司机`;
      }
    } else {
      if (resultEl) {
        resultEl.classList.add('hidden');
      }
    }

    if (filteredDrivers.length === 0) {
      const emptyMessage = searchKeyword.trim()
        ? `没有找到包含 "<span class="font-semibold text-gray-700">${searchKeyword}</span>" 的司机`
        : '暂无司机数据，请点击上方"新增司机"按钮添加第一位司机';

      listEl.innerHTML = `
        <div class="col-span-full text-center py-16 text-gray-500 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300 shadow-inner">
          <div class="text-4xl mb-4">${searchKeyword.trim() ? '🔍' : '👨‍✈️'}</div>
          <p class="text-lg font-medium mb-2">${emptyMessage}</p>
          ${searchKeyword.trim() ? '<p class="text-small mt-2">请尝试其他关键词</p>' : ''}
        </div>`;
      return;
    }

    listEl.innerHTML = filteredDrivers.map(driver => {
      const vehicle = vehicleMap[driver.vehicleId] || null;
      let statusText = '未知';
      let statusColor = '';

      switch(driver.status) {
        case 'working': 
          statusText = '工作中'; 
          statusColor = 'green';
          break;
        case 'rest': 
          statusText = '休息中'; 
          statusColor = 'blue';
          break;
        case 'offline': 
          statusText = '离线'; 
          statusColor = 'gray';
          break;
      }

      const topBarColor = driver.status === 'working' 
        ? 'from-green-500 via-green-400 to-green-500' 
        : (driver.status === 'rest' 
          ? 'from-blue-500 via-blue-400 to-blue-500' 
          : 'from-gray-400 via-gray-300 to-gray-400');

      return `
      <div class="card card-hover flex flex-col justify-between h-full p-5 relative overflow-hidden border-l-4 ${driver.status === 'working' ? 'border-l-green-500' : (driver.status === 'rest' ? 'border-l-blue-500' : 'border-l-gray-400')}">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topBarColor}"></div>
        <div class="flex-1 pt-2">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
              ${driver.name.charAt(0)}
            </div>
            <div class="flex-1">
              <div class="font-bold text-gray-900">${driver.name}</div>
              <div class="text-xs text-gray-500">工号: ${driver.employeeId}</div>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-lg border font-semibold ${driver.status === 'working' ? 'bg-green-100 text-green-800 border-green-200' : (driver.status === 'rest' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200')}">${statusText}</span>
          </div>
          
          <div class="space-y-3 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3m3 0V3m3 0V3" />
              </svg>
              <span class="text-gray-600">${driver.phone}</span>
            </div>
            
            <div class="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span class="text-gray-600">${vehicle ? `驾驶 ${vehicle.id}` : '未分配车辆'}</span>
            </div>
            
            <div class="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span class="text-gray-600">累计驾驶 <span class="font-semibold text-blue-600">${driver.drivingHours}</span> 小时</span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
          <button onclick="window.updateDriverStatus('${driver.id}', 'working')" class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 active:scale-95 transition-all text-xs font-semibold border border-green-300 shadow-sm hover:shadow-md ${driver.status === 'working' ? 'ring-2 ring-green-200' : ''}">上班</button>
          <button onclick="window.updateDriverStatus('${driver.id}', 'rest')" class="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 active:scale-95 transition-all text-xs font-semibold border border-blue-300 shadow-sm hover:shadow-md ${driver.status === 'rest' ? 'ring-2 ring-blue-200' : ''}">休息</button>
          <button onclick="window.editDriver('${driver.id}')" class="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 active:scale-95 transition-all border border-gray-300 shadow-sm hover:shadow-md">
            ${Icons.edit}
          </button>
          <button onclick="window.deleteDriver('${driver.id}')" class="px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 active:scale-95 transition-all border border-red-300 shadow-sm hover:shadow-md">
            ${Icons.trash}
          </button>
        </div>
      </div>
      `;
    }).join('');
  },

  updateStatus(id, newStatus) {
    const drivers = window.Storage.getDrivers();
    const target = drivers.find(d => d.id === id);
    if (target && target.status !== newStatus) {
      target.status = newStatus;
      if (newStatus === 'working' && !target.startWorkTime) {
        target.startWorkTime = new Date().toLocaleString('zh-CN');
      } else if (newStatus !== 'working') {
        if (target.startWorkTime) {
          const start = new Date(target.startWorkTime);
          const now = new Date();
          const hours = Math.round((now - start) / (1000 * 60 * 60));
          target.drivingHours += hours;
        }
        target.startWorkTime = '';
      }
      window.Storage.saveDrivers(drivers);
      const statusText = newStatus === 'working' ? '工作中' : (newStatus === 'rest' ? '休息中' : '离线');
      window.UI.showToast(`司机 ${target.name} 状态更新为 ${statusText}`);
      this.render(this.searchKeyword);
    }
  },

  handleDelete(id) {
    const drivers = window.Storage.getDrivers();
    const target = drivers.find(d => d.id === id);
    window.UI.confirm(
      `确定要删除司机 ${target.name} 吗？`,
      () => {
        const updatedDrivers = drivers.filter(d => d.id !== id);
        window.Storage.saveDrivers(updatedDrivers);
        window.UI.showToast('删除成功');
        this.render();
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
      employeeId: formData.employeeId,
      phone: formData.phone,
      status: formData.status || 'offline',
      vehicleId: formData.vehicleId || '',
      drivingHours: parseInt(formData.drivingHours) || 0,
      startWorkTime: ''
    };

    if (formData.isEdit) {
      if (formData.originalId && formData.originalId !== formData.id) {
        if (existingIndex > -1) {
          window.UI.showToast('该司机编号已存在', 'error');
          return false;
        }
        if (originalIndex > -1) {
          newDriver.drivingHours = drivers[originalIndex].drivingHours;
          newDriver.startWorkTime = drivers[originalIndex].startWorkTime;
          drivers.splice(originalIndex, 1);
          drivers.push(newDriver);
        }
        window.UI.showToast('司机信息修改成功');
      } else {
        if (originalIndex > -1) {
          newDriver.drivingHours = drivers[originalIndex].drivingHours;
          newDriver.startWorkTime = drivers[originalIndex].startWorkTime;
          drivers[originalIndex] = newDriver;
          window.UI.showToast('司机信息修改成功');
        } else {
          window.UI.showToast('未找到要修改的司机', 'error');
          return false;
        }
      }
    } else {
      if (existingIndex > -1) {
        window.UI.showToast('该司机编号已存在', 'error');
        return false;
      }
      drivers.push(newDriver);
      window.UI.showToast('司机新增成功');
    }

    window.Storage.saveDrivers(drivers);
    this.render();
    return true;
  }
};
