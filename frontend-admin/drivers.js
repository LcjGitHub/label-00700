/**
 * 人员调度模块
 * 功能：司机管理、工作状态、车辆分配、驾驶时长统计
 */

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
          <div class="text-4xl mb-4">👤</div>
          <p class="text-lg font-medium text-gray-600 mb-2">没有找到符合条件的司机</p>
          <p class="text-small text-gray-500">请尝试调整筛选条件或新增司机</p>
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
        case 'resting': 
          statusText = '休息中'; 
          statusColor = 'amber';
          break;
        case 'off': 
          statusText = '已下班'; 
          statusColor = 'gray';
          break;
        case 'leave': 
          statusText = '请假'; 
          statusColor = 'orange';
          break;
      }

      const drivingHours = driver.drivingHours || 0;
      const todayHours = driver.todayHours || 0;
      
      const colorClasses = {
        green: {
          bar: 'from-green-500 via-green-400 to-green-500',
          border: 'border-l-green-500',
          badge: 'from-green-600 to-green-700',
          borderBadge: 'border-green-800/20',
          bg: 'bg-green-100 text-green-800 border-green-200',
          btn: 'from-green-50 to-green-100 text-green-700 border-green-300 hover:from-green-100 hover:to-green-200'
        },
        amber: {
          bar: 'from-amber-500 via-amber-400 to-amber-500',
          border: 'border-l-amber-500',
          badge: 'from-amber-600 to-amber-700',
          borderBadge: 'border-amber-800/20',
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          btn: 'from-amber-50 to-amber-100 text-amber-700 border-amber-300 hover:from-amber-100 hover:to-amber-200'
        },
        gray: {
          bar: 'from-gray-400 via-gray-300 to-gray-400',
          border: 'border-l-gray-400',
          badge: 'from-gray-600 to-gray-700',
          borderBadge: 'border-gray-800/20',
          bg: 'bg-gray-100 text-gray-800 border-gray-200',
          btn: 'from-gray-50 to-gray-100 text-gray-700 border-gray-300 hover:from-gray-100 hover:to-gray-200'
        },
        orange: {
          bar: 'from-orange-500 via-orange-400 to-orange-500',
          border: 'border-l-orange-500',
          badge: 'from-orange-600 to-orange-700',
          borderBadge: 'border-orange-800/20',
          bg: 'bg-orange-100 text-orange-800 border-orange-200',
          btn: 'from-orange-50 to-orange-100 text-orange-700 border-orange-300 hover:from-orange-100 hover:to-orange-200'
        }
      };

      const colors = colorClasses[statusColor] || colorClasses.gray;
      
      return `
      <div class="card card-hover flex flex-col justify-between h-full p-5 relative overflow-hidden border-l-4 ${colors.border}">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.bar}"></div>
        <div class="flex-1 pt-2">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span class="bg-gradient-to-r ${colors.badge} text-white px-3 py-1.5 rounded-lg font-bold text-base shadow-lg border ${colors.borderBadge}">${driver.id}</span>
            <span class="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold">${driver.name}</span>
          </div>
          
          <div class="flex items-center gap-2 text-gray-800 font-semibold mb-4 bg-gradient-to-r from-purple-50 to-blue-50 p-2.5 rounded-lg border border-purple-100">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm"></span>
            <span class="text-base font-bold flex-1 truncate max-w-[120px]" title="${statusText}">${statusText}</span>
            ${vehicle ? `<span class="text-gray-400 text-sm">→</span><span class="text-xs text-gray-600 flex-1 truncate">驾驶 ${vehicle.id}</span>` : '<span class="text-xs text-gray-400">未分配车辆</span>'}
          </div>
          
          <div class="mb-3">
            <div class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              驾驶时长统计
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
                <div class="text-lg font-bold text-blue-700">${todayHours.toFixed(1)}h</div>
                <div class="text-xs text-blue-600">今日</div>
              </div>
              <div class="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                <div class="text-lg font-bold text-emerald-700">${drivingHours.toFixed(1)}h</div>
                <div class="text-xs text-emerald-600">累计</div>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              联系方式
            </div>
            <div class="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              ${driver.phone || '未填写'}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-auto">
          <div class="grid grid-cols-4 gap-1.5">
            <button onclick="window.updateDriverStatus('${driver.id}', 'working')" class="flex items-center justify-center px-2 py-2 rounded-lg transition-all text-xs font-semibold shadow-sm hover:shadow-md ${driver.status === 'working' ? 'ring-2 ring-green-200 ' + colors.btn : 'from-green-50 to-green-100 text-green-700 border-green-300 hover:from-green-100 hover:to-green-200'}">工作</button>
            <button onclick="window.updateDriverStatus('${driver.id}', 'resting')" class="flex items-center justify-center px-2 py-2 rounded-lg transition-all text-xs font-semibold shadow-sm hover:shadow-md ${driver.status === 'resting' ? 'ring-2 ring-amber-200 ' + colors.btn : 'from-amber-50 to-amber-100 text-amber-700 border-amber-300 hover:from-amber-100 hover:to-amber-200'}">休息</button>
            <button onclick="window.updateDriverStatus('${driver.id}', 'off')" class="flex items-center justify-center px-2 py-2 rounded-lg transition-all text-xs font-semibold shadow-sm hover:shadow-md ${driver.status === 'off' ? 'ring-2 ring-gray-200 ' + colors.btn : 'from-gray-50 to-gray-100 text-gray-700 border-gray-300 hover:from-gray-100 hover:to-gray-200'}">下班</button>
            <button onclick="window.updateDriverStatus('${driver.id}', 'leave')" class="flex items-center justify-center px-2 py-2 rounded-lg transition-all text-xs font-semibold shadow-sm hover:shadow-md ${driver.status === 'leave' ? 'ring-2 ring-orange-200 ' + colors.btn : 'from-orange-50 to-orange-100 text-orange-700 border-orange-300 hover:from-orange-100 hover:to-orange-200'}">请假</button>
          </div>
          <div class="flex gap-2">
            <button onclick="window.editDriver('${driver.id}')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 active:scale-95 transition-all text-xs font-semibold border border-blue-300 shadow-sm hover:shadow-md">编辑</button>
            <button onclick="window.deleteDriver('${driver.id}')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 active:scale-95 transition-all text-xs font-semibold border border-red-300 shadow-sm hover:shadow-md">删除</button>
          </div>
        </div>
      </div>
      `;
    }).join('');
  },

  updateStatus(id, newStatus) {
    const drivers = window.Storage.getDrivers();
    const target = drivers.find(d => d.id === id);
    if (target) {
      const wasWorking = target.status === 'working';
      const nowWorking = newStatus === 'working';
      
      if (wasWorking && !nowWorking) {
        const minutes = Math.random() * 120 + 30;
        const hours = minutes / 60;
        target.todayHours = (target.todayHours || 0) + hours;
        target.drivingHours = (target.drivingHours || 0) + hours;
      }
      
      target.status = newStatus;
      window.Storage.saveDrivers(drivers);
      const statusMap = { working: '工作中', resting: '休息中', off: '已下班', leave: '请假' };
      window.UI.showToast(`司机 ${target.name} 状态更新为 ${statusMap[newStatus]}`);
      const currentFilter = window.driverFilterInstance ? window.driverFilterInstance.getValue() : 'all';
      this.render(currentFilter);
    }
  },

  add(driverData) {
    const drivers = window.Storage.getDrivers();
    const newDriver = {
      id: driverData.id,
      name: driverData.name,
      phone: driverData.phone || '',
      vehicleId: driverData.vehicleId || '',
      status: driverData.status || 'resting',
      drivingHours: 0,
      todayHours: 0
    };
    drivers.push(newDriver);
    window.Storage.saveDrivers(drivers);
    window.UI.showToast(`司机 ${driverData.name} 添加成功`);
    this.render();
  },

  update(id, driverData) {
    const drivers = window.Storage.getDrivers();
    const index = drivers.findIndex(d => d.id === id);
    if (index !== -1) {
      drivers[index] = { ...drivers[index], ...driverData };
      window.Storage.saveDrivers(drivers);
      window.UI.showToast(`司机信息更新成功`);
      const currentFilter = window.driverFilterInstance ? window.driverFilterInstance.getValue() : 'all';
      this.render(currentFilter);
    }
  },

  delete(id) {
    const drivers = window.Storage.getDrivers();
    const target = drivers.find(d => d.id === id);
    if (target) {
      new window.ConfirmDialog({
        title: '确认删除',
        message: `确定要删除司机 ${target.name} (${target.id}) 吗？`,
        type: 'danger',
        confirmText: '删除',
        onConfirm: () => {
          const newDrivers = drivers.filter(d => d.id !== id);
          window.Storage.saveDrivers(newDrivers);
          window.UI.showToast(`司机 ${target.name} 已删除`);
          const currentFilter = window.driverFilterInstance ? window.driverFilterInstance.getValue() : 'all';
          this.render(currentFilter);
        }
      });
    }
  },

  getById(id) {
    const drivers = window.Storage.getDrivers();
    return drivers.find(d => d.id === id);
  },

  populateVehicleSelect() {
    const vehicles = window.Storage.getVehicles();
    const select = document.querySelector('select[name="vehicleId"]');
    if (select) {
      select.innerHTML = '<option value="">未分配</option>';
      vehicles.forEach(v => {
        select.innerHTML += `<option value="${v.id}">${v.id} (${v.routeId}路)</option>`;
      });
    }
  }
};
