// ========== 共享代码统一管理（必须在模块导入之前定义） ==========
/**
 * Storage 对象统一在此处定义
 * 作为应用的入口文件，main.js 负责初始化所有共享资源
 * 其他模块（routes.js, vehicles.js, stations.js, stats.js）直接使用 window.Storage
 * 避免代码重复，提高可维护性
 * 
 * 注意：必须在 import 语句之前定义，确保其他模块导入时 Storage 已存在
 * 使用 window.BusStorage 避免与浏览器原生 Storage API 冲突
 */
// 检查是否已定义我们的 Storage 对象（通过检查 init 方法是否存在）
// 注意：浏览器可能有原生的 Storage API，但我们的 Storage 对象有 init 方法，可以通过此方法区分
if (!window.Storage || typeof window.Storage.init !== 'function') {
  /**
   * KEYS 常量对象
   * 作用：统一管理 localStorage 中使用的键名，避免硬编码字符串分散在代码各处
   * 好处：
   *   1. 集中管理：所有 localStorage 键名在此处定义，便于维护和修改
   *   2. 避免拼写错误：使用常量而非字符串字面量，减少因拼写错误导致的数据丢失
   *   3. 代码可读性：通过常量名可以清晰了解存储的数据类型
   *   4. 重构友好：如需修改键名，只需在此处修改一处即可
   */
  const KEYS = {
    /**
     * ROUTES: 'bus_routes'
     * 用途：存储公交线路数据的 localStorage 键名
     * 存储内容：JSON 格式的公交线路数组，每个线路包含 id、起点、终点、途经站点、运营时间等信息
     * 使用场景：线路管理模块的增删改查操作都会读写此键
     * 示例数据格式：[{ id: '101', start: '火车站', end: '市民中心', stations: [...], time: '06:00-22:00' }]
     */
    ROUTES: 'bus_routes',
    /**
     * VEHICLES: 'bus_vehicles'
     * 用途：存储车辆调度数据的 localStorage 键名
     * 存储内容：JSON 格式的车辆数组，每个车辆包含 id、所属线路ID、运行状态等信息
     * 使用场景：车辆调度模块的状态管理、筛选等功能都会读写此键
     * 示例数据格式：[{ id: 'V-001', routeId: '101', status: 'running' }]
     */
    VEHICLES: 'bus_vehicles',
    /**
     * DRIVERS: 'bus_drivers'
     * 用途：存储司机人员调度数据的 localStorage 键名
     * 存储内容：JSON 格式的司机数组，每个司机包含 id、姓名、工作状态、分配车辆、驾驶时长等信息
     * 使用场景：人员调度模块的增删改查、状态管理、车辆分配、驾驶时长统计等功能
     * 示例数据格式：[{ id: 'D-001', name: '张三', status: 'working', vehicleId: 'V-001', driveTime: 3600000 }]
     */
    DRIVERS: 'bus_drivers',
    /**
     * INIT_FLAG: 'bus_app_initialized'
     * 用途：标记应用是否已完成首次数据初始化的 localStorage 键名
     * 存储内容：字符串 'true'，表示应用已经加载过初始数据
     * 使用场景：应用启动时检查此标志，如果不存在则加载初始示例数据，避免重复初始化
     * 重要性：防止每次刷新页面都重置数据，保证用户操作的数据持久化
     */
    INIT_FLAG: 'bus_app_initialized'
  };

  const INITIAL_DATA = {
    routes: [
      { id: '101', start: '火车站', end: '市民中心', stations: ['火车站', '商业街', '医院', '公园', '市民中心'], time: '06:00-22:00' },
      { id: '202', start: '科技园', end: '大学城', stations: ['科技园', '软件大道', '体育馆', '图书馆', '大学城'], time: '07:00-21:00' },
      { id: '303', start: '机场', end: '市中心', stations: ['机场', '物流园', '高速路口', '市中心'], time: '05:00-23:00' }
    ],
    vehicles: [
      { id: 'V-001', routeId: '101', status: 'running' },
      { id: 'V-002', routeId: '101', status: 'stopped' },
      { id: 'V-003', routeId: '202', status: 'maintenance' },
      { id: 'V-004', routeId: '202', status: 'running' },
      { id: 'V-005', routeId: '303', status: 'running' }
    ],
    drivers: [
      { id: 'D-001', name: '张三', status: 'working', vehicleId: 'V-001', driveTime: 14400000 },
      { id: 'D-002', name: '李四', status: 'working', vehicleId: 'V-004', driveTime: 10800000 },
      { id: 'D-003', name: '王五', status: 'resting', vehicleId: '', driveTime: 7200000 },
      { id: 'D-004', name: '赵六', status: 'working', vehicleId: 'V-005', driveTime: 18000000 },
      { id: 'D-005', name: '孙七', status: 'leave', vehicleId: '', driveTime: 3600000 }
    ]
  };

  // 强制覆盖，确保我们的 Storage 对象被正确定义
  window.Storage = {
    init() {
      if (!localStorage.getItem(KEYS.INIT_FLAG)) {
        localStorage.setItem(KEYS.ROUTES, JSON.stringify(INITIAL_DATA.routes));
        localStorage.setItem(KEYS.VEHICLES, JSON.stringify(INITIAL_DATA.vehicles));
        localStorage.setItem(KEYS.DRIVERS, JSON.stringify(INITIAL_DATA.drivers));
        localStorage.setItem(KEYS.INIT_FLAG, 'true');
      }
    },
    getRoutes() {
      return JSON.parse(localStorage.getItem(KEYS.ROUTES) || '[]');
    },
    saveRoutes(routes) {
      localStorage.setItem(KEYS.ROUTES, JSON.stringify(routes));
    },
    getVehicles() {
      return JSON.parse(localStorage.getItem(KEYS.VEHICLES) || '[]');
    },
    saveVehicles(vehicles) {
      localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
    },
    getDrivers() {
      return JSON.parse(localStorage.getItem(KEYS.DRIVERS) || '[]');
    },
    saveDrivers(drivers) {
      localStorage.setItem(KEYS.DRIVERS, JSON.stringify(drivers));
    }
  };
  
  // 验证 Storage 对象已正确定义
  if (typeof window.Storage.init !== 'function') {
    console.error('Storage 对象初始化失败：init 方法不存在');
    console.error('window.Storage:', window.Storage);
    throw new Error('Storage 对象初始化失败');
  }
}

// 立即验证 Storage 对象已正确定义（在模块导入之前）
if (typeof window.Storage === 'undefined' || typeof window.Storage.init !== 'function') {
  console.error('Storage 对象未正确初始化，无法继续加载模块');
  throw new Error('Storage 对象初始化失败');
}

// ========== ConfirmDialog 类定义（必须在模块导入之前） ==========
/**
 * ConfirmDialog 类
 * 作用：自定义确认对话框组件，用于替代浏览器原生的 confirm/alert 弹窗
 * 特点：支持自定义标题、内容、按钮文字、图标类型，提供更好的用户体验和视觉一致性
 * 注意：必须在模块导入之前定义，确保其他模块（如 routes.js）导入时可以使用 window.ConfirmDialog
 */
if (!window.ConfirmDialog) {
  class ConfirmDialog {
    /**
     * 构造函数
     * @param {Object} options - 配置选项对象
     * @param {string} options.title - 对话框标题，显示在对话框顶部（默认：'确认操作'）
     * @param {string} options.message - 对话框内容/提示信息，显示在标题下方（默认：'确定要执行此操作吗？'）
     * @param {string} options.confirmText - 确认按钮的文字（默认：'确定'）
     * @param {string} options.cancelText - 取消按钮的文字（默认：'取消'）
     * @param {string} options.type - 对话框类型，决定图标和按钮颜色（'warning'|'danger'|'info'，默认：'warning'）
     * @param {Function} options.onConfirm - 确认按钮点击时的回调函数（默认：空函数）
     * @param {Function} options.onCancel - 取消按钮点击时的回调函数（默认：空函数）
     * @param {boolean} options.showCancel - 是否显示取消按钮（默认：true）
     */
    constructor(options = {}) {
      // 对话框标题：显示在对话框顶部，用于说明操作类型
      this.title = options.title || '确认操作';
      // 对话框内容：显示在标题下方，用于详细说明操作的影响或提示信息
      this.message = options.message || '确定要执行此操作吗？';
      // 确认按钮文字：显示在确认按钮上，可根据操作类型自定义（如"删除"、"保存"等）
      this.confirmText = options.confirmText || '确定';
      // 取消按钮文字：显示在取消按钮上，通常为"取消"或"关闭"
      this.cancelText = options.cancelText || '取消';
      // 对话框类型：决定图标样式和按钮颜色
      // - 'warning': 绿色图标和按钮（用于一般确认操作）
      // - 'danger': 红色图标和按钮（用于危险操作，如删除）
      // - 'info': 绿色图标和按钮（用于信息提示）
      this.type = options.type || 'warning';
      // 确认回调函数：用户点击确认按钮时执行，用于处理确认后的业务逻辑
      this.onConfirm = options.onConfirm || (() => {});
      // 取消回调函数：用户点击取消按钮或按 ESC 键时执行，用于处理取消后的逻辑
      this.onCancel = options.onCancel || (() => {});
      // 是否显示取消按钮：true 显示取消按钮，false 只显示确认按钮（类似 alert）
      this.showCancel = options.showCancel !== false;
      // 初始化对话框：创建 DOM、绑定事件、显示对话框
      this.init();
    }

    /**
     * 初始化对话框
     * 作用：按顺序执行创建对话框、绑定事件、显示对话框三个步骤
     */
    init() {
      this.createDialog();
      this.bindEvents();
      this.show();
    }

    /**
     * 创建对话框 DOM 结构
     * 作用：动态创建对话框的 HTML 结构，包括遮罩层、对话框容器、图标、标题、内容、按钮等元素
     * 说明：使用 createElement 和 innerHTML 创建 DOM，然后添加到 document.body
     */
    createDialog() {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-dialog-overlay fixed inset-0 bg-black/50 z-[300] flex items-center justify-center backdrop-blur-sm';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s ease-out';

      const dialog = document.createElement('div');
      dialog.className = 'confirm-dialog bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform scale-95 transition-all duration-200';
      dialog.style.opacity = '0';

      const iconConfig = this.getIconConfig();

      dialog.innerHTML = `
        <div class="p-6">
          <div class="flex items-start gap-4 mb-4">
            <div class="flex-shrink-0 ${iconConfig.bg} rounded-full p-3">
              ${iconConfig.icon}
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">${this.title}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">${this.message}</p>
            </div>
          </div>
          <div class="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
            ${this.showCancel ? `<button class="confirm-dialog-cancel px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-medium transition-all text-sm">${this.cancelText}</button>` : ''}
            <button class="confirm-dialog-confirm px-6 py-2 ${iconConfig.btnColor} text-white rounded-lg font-medium shadow-sm transition-all text-sm hover:shadow-md active:scale-95">${this.confirmText}</button>
          </div>
        </div>
      `;

      overlay.appendChild(dialog);
      // 保存 DOM 元素引用，供后续方法使用
      this.overlay = overlay;  // 遮罩层元素，用于点击外部关闭对话框
      this.dialog = dialog;    // 对话框主体元素，用于动画和内容更新
      document.body.appendChild(overlay);
    }

    /**
     * 获取图标配置
     * 作用：根据对话框类型（type）返回对应的图标样式配置
     * @returns {Object} iconConfig - 包含背景色、图标 SVG、按钮颜色的配置对象
     * @returns {string} iconConfig.bg - 图标背景的 Tailwind CSS 类名
     * @returns {string} iconConfig.icon - 图标的 SVG 字符串
     * @returns {string} iconConfig.btnColor - 确认按钮的 Tailwind CSS 类名
     */
    getIconConfig() {
      // 图标配置映射表：根据对话框类型返回对应的样式配置
      const configs = {
        /**
         * warning 类型配置
         * 用途：用于一般确认操作（如保存、提交等）
         * 样式：绿色图标和按钮，表示安全/正常的操作
         */
        warning: {
          bg: 'bg-green-100',  // 图标背景色：浅绿色背景
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-green-600"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,  // 成功/确认图标（对勾）
          btnColor: 'bg-green-600 hover:bg-green-700 active:bg-green-800'  // 确认按钮颜色：绿色渐变
        },
        /**
         * danger 类型配置
         * 用途：用于危险操作（如删除、永久移除等）
         * 样式：红色图标和按钮，表示警告/危险的操作
         */
        danger: {
          bg: 'bg-red-100',  // 图标背景色：浅红色背景
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-red-600"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`,  // 删除/垃圾桶图标
          btnColor: 'bg-red-600 hover:bg-red-700 active:bg-red-800'  // 确认按钮颜色：红色渐变
        },
        /**
         * info 类型配置
         * 用途：用于信息提示（如操作成功、通知等）
         * 样式：绿色图标和按钮，与 warning 类型相同，用于信息展示
         */
        info: {
          bg: 'bg-green-100',  // 图标背景色：浅绿色背景
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-green-600"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,  // 成功/信息图标（对勾）
          btnColor: 'bg-green-600 hover:bg-green-700 active:bg-green-800'  // 确认按钮颜色：绿色渐变
        }
      };
      // 返回对应类型的配置，如果类型不存在则返回 warning 类型的配置
      return configs[this.type] || configs.warning;
    }

    /**
     * 绑定事件监听器
     * 作用：为对话框的各个交互元素绑定事件处理函数
     * 包括：确认按钮点击、取消按钮点击、遮罩层点击、ESC 键按下
     */
    bindEvents() {
      // 确认按钮：点击后执行确认回调函数
      const confirmBtn = this.dialog.querySelector('.confirm-dialog-confirm');
      confirmBtn.addEventListener('click', () => {
        this.hide(() => this.onConfirm());
      });

      // 取消按钮：仅在 showCancel 为 true 时绑定
      if (this.showCancel) {
        const cancelBtn = this.dialog.querySelector('.confirm-dialog-cancel');
        cancelBtn.addEventListener('click', () => {
          this.hide(() => this.onCancel());
        });
      }

      // 遮罩层点击：点击对话框外部区域时关闭对话框
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.hide(() => this.onCancel());
        }
      });

      // ESC 键处理：按下 ESC 键时关闭对话框
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          this.hide(() => this.onCancel());
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    }

    /**
     * 显示对话框
     * 作用：通过 CSS 动画显示对话框，包括淡入效果和缩放动画
     * 说明：使用 requestAnimationFrame 确保动画流畅，同时锁定页面滚动
     */
    show() {
      requestAnimationFrame(() => {
        this.overlay.style.opacity = '1';
        this.dialog.style.opacity = '1';
        this.dialog.style.transform = 'scale(1)';
      });
      document.body.style.overflow = 'hidden';
    }

    /**
     * 隐藏对话框
     * 作用：通过 CSS 动画隐藏对话框，然后从 DOM 中移除
     * @param {Function} callback - 隐藏动画完成后的回调函数，通常用于执行确认或取消的业务逻辑
     * 说明：使用淡出和缩放动画，200ms 后移除 DOM 元素并恢复页面滚动
     */
    hide(callback) {
      // 开始淡出动画
      this.overlay.style.opacity = '0';
      this.dialog.style.opacity = '0';
      this.dialog.style.transform = 'scale(0.95)';
      // 200ms 后移除 DOM 元素（动画持续时间）
      setTimeout(() => {
        // 安全移除：检查元素是否存在且仍在 DOM 中
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        // 恢复页面滚动：移除对话框时解锁滚动
        document.body.style.overflow = '';
        // 执行回调函数：通常用于执行确认或取消的业务逻辑
        if (callback) callback();
      }, 200);
    }
  }

  // 将 ConfirmDialog 类暴露到全局
  window.ConfirmDialog = ConfirmDialog;
}

/**
 * 模块导入
 * 导入各个功能模块，用于管理应用的不同业务逻辑
 * 注意：Storage 和 ConfirmDialog 已在上面定义并验证，确保模块导入时可以使用
 */
// 导入线路管理模块：负责公交线路的增删改查、搜索等功能
import { RoutesModule } from './routes.js';
// 导入车辆调度模块：负责车辆状态管理、筛选等功能
import { VehiclesModule } from './vehicles.js';
// 导入人员调度模块：负责司机人员管理、状态管理、车辆分配、驾驶时长统计等功能
import { DriversModule } from './drivers.js';
// 导入站点查询模块：负责站点搜索、到站时间预估等功能
import { StationsModule } from './stations.js';
// 导入数据统计模块：负责运营数据统计、热门站点分析等功能
import { StatsModule } from './stats.js';

if (!window.Icons) {
  window.Icons = {
    bus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>`,
    map: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0Z" /></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`
  };
}

if (!window.UI) {
  // 确保 window.UI 包含所有必要的方法
  // 注意：ConfirmDialog 类已在模块导入之前定义并暴露到 window.ConfirmDialog
  window.UI = {};

  // 合并或添加所有方法，确保完整性
  Object.assign(window.UI, {
    showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      const colors = type === 'error' ? 'bg-red-500' : (type === 'info' ? 'bg-blue-500' : 'bg-green-500');
      toast.className = `${colors} text-white px-6 py-3 rounded-lg shadow-lg mb-3 toast-enter flex items-center gap-2`;
      toast.innerHTML = `<span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },
    confirm(message, onConfirm, options = {}) {
      new window.ConfirmDialog({
        title: options.title || '确认操作',
        message: message,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        type: options.type || 'warning',
        onConfirm: onConfirm,
        onCancel: options.onCancel || (() => {})
      });
    },
    alert(message, options = {}) {
      new window.ConfirmDialog({
        title: options.title || '提示',
        message: message,
        confirmText: options.confirmText || '确定',
        type: options.type || 'info',
        showCancel: false,
        onConfirm: options.onConfirm || (() => {})
      });
    },
    showPage(pageId) {
      document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
      const targetPage = document.getElementById(pageId);
      if (targetPage) targetPage.classList.remove('hidden');
      document.querySelectorAll('.nav-btn').forEach(btn => {
        if(btn.dataset.target === pageId) {
          btn.classList.add('bg-white/20', 'text-white', 'shadow-md');
          btn.classList.remove('text-blue-100', 'hover:bg-white/10');
        } else {
          btn.classList.remove('bg-white/20', 'text-white', 'shadow-md');
          btn.classList.add('text-blue-100', 'hover:bg-white/10');
        }
      });
      
      // 切换页面时清空所有搜索框并重置搜索结果
      const routeSearchInput = document.getElementById('route-search-input');
      const stationSearchInput = document.getElementById('station-search-input');
      
      if (routeSearchInput) {
        routeSearchInput.value = '';
        // 如果切换到线路管理页面，清空搜索后显示所有线路
        if (pageId === 'page-routes') {
          RoutesModule.render();
        }
      }
      
      if (stationSearchInput) {
        stationSearchInput.value = '';
        // 如果切换到站点查询页面，清空搜索后显示初始状态
        if (pageId === 'page-stations') {
          StationsModule.render();
        }
      }
    }
  });
}

if (!window.CustomSelect) {
  window.CustomSelect = class CustomSelect {
    constructor(options) {
      this.id = options.id || `select-${Date.now()}`;
      this.options = options.options || [];
      this.value = options.value || '';
      this.placeholder = options.placeholder || '请选择';
      this.onChange = options.onChange || (() => {});
      this.disabled = options.disabled || false;
      this.container = null;
      this.isOpen = false;
      this.init();
    }

    init() {
      this.createSelect();
      this.bindEvents();
    }

    createSelect() {
      const container = document.createElement('div');
      container.className = 'custom-select-wrapper relative';
      container.id = `${this.id}-wrapper`;

      const input = document.createElement('div');
      input.className = `custom-select-input w-full px-4 py-2.5 text-sm bg-white rounded-lg cursor-pointer transition-all flex items-center justify-between ${
        this.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 disabled' : ''
      }`;
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-haspopup', 'listbox');
      input.setAttribute('tabindex', this.disabled ? '-1' : '0');

      const displayText = document.createElement('span');
      const hasValue = !!this.value;
      displayText.className = `custom-select-text flex-1 text-left ${
        hasValue ? 'text-gray-900' : 'text-gray-500'
      }`;
      displayText.textContent = this.getDisplayText();

      const arrow = document.createElement('span');
      arrow.className = 'custom-select-arrow text-gray-400 transition-transform duration-200';
      arrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      `;

      input.appendChild(displayText);
      input.appendChild(arrow);

      const dropdown = document.createElement('div');
      dropdown.className = 'custom-select-dropdown absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden overflow-hidden';
      dropdown.setAttribute('role', 'listbox');

      const optionsList = document.createElement('div');
      optionsList.className = 'custom-select-options max-h-60 overflow-y-auto';

      this.options.forEach((option, index) => {
        const optionEl = this.createOption(option, index);
        optionsList.appendChild(optionEl);
      });

      dropdown.appendChild(optionsList);
      container.appendChild(input);
      container.appendChild(dropdown);

      this.container = container;
      this.input = input;
      this.displayText = displayText;
      this.arrow = arrow;
      this.dropdown = dropdown;
      this.optionsList = optionsList;
    }

    createOption(option, index) {
      const optionEl = document.createElement('div');
      const isDisabled = option.disabled || false;
      const isSelected = option.value === this.value;

      optionEl.className = `custom-select-option px-4 py-2.5 text-sm cursor-pointer transition-colors ${
        isDisabled
          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
          : isSelected
          ? 'text-gray-900 bg-blue-50 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      }`;
      optionEl.setAttribute('role', 'option');
      optionEl.setAttribute('aria-selected', isSelected);
      optionEl.setAttribute('data-value', option.value);
      optionEl.textContent = option.label || option.value;

      if (!isDisabled) {
        optionEl.addEventListener('click', () => {
          this.selectOption(option.value);
        });
      }

      return optionEl;
    }

    bindEvents() {
      if (this.disabled) return;

      this.input.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      document.addEventListener('click', (e) => {
        if (!this.container.contains(e.target)) {
          this.close();
        }
      });

      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        } else if (e.key === 'Escape') {
          this.close();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.open();
          this.focusNextOption();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.focusPreviousOption();
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      if (this.disabled) return;
      this.isOpen = true;
      this.dropdown.classList.remove('hidden');
      this.input.classList.add('focused', 'border-blue-500');
      this.arrow.style.transform = 'rotate(180deg)';
      this.input.setAttribute('aria-expanded', 'true');
      this.scrollToSelected();
    }

    close() {
      this.isOpen = false;
      this.dropdown.classList.add('hidden');
      this.input.classList.remove('focused', 'border-blue-500');
      this.arrow.style.transform = 'rotate(0deg)';
      this.input.setAttribute('aria-expanded', 'false');
    }

    selectOption(value) {
      if (this.value === value) {
        this.close();
        return;
      }
      this.value = value;
      const displayText = this.getDisplayText();
      this.displayText.textContent = displayText;
      if (this.value) {
        this.displayText.classList.remove('text-gray-500');
        this.displayText.classList.add('text-gray-900');
      } else {
        this.displayText.classList.add('text-gray-500');
        this.displayText.classList.remove('text-gray-900');
      }
      this.updateSelectedState();
      this.close();
      this.onChange(value);
    }

    getDisplayText() {
      if (!this.value) {
        return this.placeholder;
      }
      const selectedOption = this.options.find(opt => opt.value === this.value);
      if (selectedOption) {
        return selectedOption.label || selectedOption.value;
      }
      return this.placeholder;
    }

    updateSelectedState() {
      const optionElements = this.optionsList.querySelectorAll('.custom-select-option');
      optionElements.forEach((el, index) => {
        const option = this.options[index];
        const isSelected = option.value === this.value;
        const isDisabled = option.disabled || false;
        el.setAttribute('aria-selected', isSelected);
        el.className = `custom-select-option px-4 py-2.5 text-sm cursor-pointer transition-colors ${
          isDisabled
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : isSelected
            ? 'text-gray-900 bg-blue-50 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        }`;
      });
    }

    scrollToSelected() {
      const selectedEl = this.optionsList.querySelector('[aria-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    focusNextOption() {
      const options = Array.from(this.optionsList.querySelectorAll('.custom-select-option:not([class*="cursor-not-allowed"])'));
      const currentIndex = options.findIndex(el => el.getAttribute('aria-selected') === 'true');
      const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
      if (options[nextIndex]) {
        options[nextIndex].focus();
        options[nextIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    focusPreviousOption() {
      const options = Array.from(this.optionsList.querySelectorAll('.custom-select-option:not([class*="cursor-not-allowed"])'));
      const currentIndex = options.findIndex(el => el.getAttribute('aria-selected') === 'true');
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
      if (options[prevIndex]) {
        options[prevIndex].focus();
        options[prevIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    getValue() {
      return this.value;
    }

    setValue(value) {
      this.value = value;
      this.displayText.textContent = this.getDisplayText();
      this.updateSelectedState();
      this.onChange(value);
    }

    updateOptions(newOptions) {
      this.options = newOptions;
      this.optionsList.innerHTML = '';
      this.options.forEach((option, index) => {
        const optionEl = this.createOption(option, index);
        this.optionsList.appendChild(optionEl);
      });
      this.updateSelectedState();
    }

    destroy() {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  };
}

// 从全局对象获取共享的工具类和组件
// 注意：由于 ES6 模块加载顺序，这些对象可能在模块导入时还未定义
// 因此在使用时直接访问 window.Storage 等全局对象，而不是创建本地常量
// 在 DOMContentLoaded 事件中，这些对象应该已经定义完成

/**
 * 应用初始化
 * 当DOM加载完成后执行，设置应用的基础功能和事件监听
 *
 * 注意：使用 type="module" 时脚本会延迟执行，可能在 DOMContentLoaded 已触发后才运行。
 * 若仅监听 DOMContentLoaded，回调可能永远不会执行，导致页面无法交互。
 * 因此：若 document.readyState 已非 'loading'，则立即执行初始化；否则再监听 DOMContentLoaded。
 */
function runAppInit() {
    // 确保 Storage 已定义且包含 init 方法
    if (!window.Storage || typeof window.Storage.init !== 'function') {
      console.error('Storage 对象未正确初始化，init 方法不存在');
      console.error('window.Storage:', window.Storage);
      return;
    }
    // 初始化本地存储：如果首次运行，加载初始数据
    window.Storage.init();

    // 渲染图标
    renderIcons();

    // 默认加载线路页
    RoutesModule.render();

    // 绑定导航事件
    bindNavEvents();

    // 绑定模态框事件
    bindModalEvents();

    // 绑定司机模态框事件
    bindDriverModalEvents();

    // 初始化自定义 Select 组件（车辆筛选）
    initVehicleFilter();

    // 初始化自定义 Select 组件（司机筛选）
    initDriverFilter();

    // 初始化线路搜索
    initRouteSearch();

    // 绑定站点搜索
    const searchInput = document.getElementById('station-search-input');
    const searchIcon = document.getElementById('icon-search-input');
    if (searchIcon && window.Icons) {
        searchIcon.innerHTML = window.Icons.search;
    }

    // 防抖处理：避免用户输入时频繁触发搜索
    // debounceTimer 用于存储定时器ID，每次输入时清除之前的定时器，重新计时
    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // 清除之前的定时器，重置防抖计时
            clearTimeout(debounceTimer);
            // 设置新的定时器：300毫秒后执行搜索
            // 如果用户在300毫秒内继续输入，定时器会被清除并重新设置
            debounceTimer = setTimeout(() => {
                StationsModule.search(e.target.value);
            }, 300);
        });
    }

    // 绑定移动端菜单按钮
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            window.UI.alert('请使用桌面端获得最佳体验，或旋转屏幕', {
                title: '移动端提示',
                type: 'info'
            });
        });
    }
}

// type="module" 脚本延迟执行时 DOMContentLoaded 可能已触发，需根据 readyState 决定立即执行或监听
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAppInit);
} else {
    runAppInit();
}

function renderIcons() {
    // 使用 window.Icons，避免 ES 模块下 Icons 未定义导致 ReferenceError
    const Icons = window.Icons;
    if (!Icons) return;

    const iconBusLogo = document.getElementById('icon-bus-logo');
    const iconPlus = document.getElementById('icon-plus');
    const iconPlusDriver = document.getElementById('icon-plus-driver');
    const iconSearchInput = document.getElementById('icon-search-input');
    const iconStatRoute = document.getElementById('icon-stat-route');
    const iconStatBus = document.getElementById('icon-stat-bus');
    const iconStatActive = document.getElementById('icon-stat-active');
    const iconFire = document.getElementById('icon-fire');

    if (iconBusLogo) iconBusLogo.innerHTML = Icons.bus;
    if (iconPlus) iconPlus.innerHTML = Icons.plus;
    if (iconPlusDriver) iconPlusDriver.innerHTML = Icons.plus;
    if (iconSearchInput) iconSearchInput.innerHTML = Icons.search;
    if (iconStatRoute) iconStatRoute.innerHTML = Icons.map;
    if (iconStatBus) iconStatBus.innerHTML = Icons.bus;
    if (iconStatActive) iconStatActive.innerHTML = Icons.chart;
    if (iconFire) iconFire.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" /></svg>`;
}

/**
 * 绑定导航事件
 * 为所有导航按钮添加点击事件，实现页面切换功能
 */
function bindNavEvents() {
    // 获取所有导航按钮元素
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 从按钮的 data-target 属性获取目标页面ID
            const targetId = btn.dataset.target;
            // 切换到目标页面（showPage 内部会清空搜索框并重置对应页面的显示）
            window.UI.showPage(targetId);

            // 切换时重新渲染对应模块的数据
            // 注意：page-routes 和 page-stations 的渲染已在 showPage 中处理，这里只处理其他页面
            switch(targetId) {
                case 'page-vehicles':
                    // 从自定义 Select 获取当前筛选值
                    const currentFilter = window.vehicleFilterInstance ? window.vehicleFilterInstance.getValue() : 'all';
                    VehiclesModule.render(currentFilter);
                    break;
                case 'page-drivers':
                    // 从自定义 Select 获取当前筛选值
                    const currentDriverFilter = window.driverFilterInstance ? window.driverFilterInstance.getValue() : 'all';
                    DriversModule.render(currentDriverFilter);
                    break;
                case 'page-stats': StatsModule.render(); break;
                // page-routes 和 page-stations 的渲染已在 showPage 中处理，避免重复调用
            }
        });
    });
}

/**
 * 绑定模态框事件
 * 处理线路新增/编辑弹窗的打开、关闭和表单提交逻辑
 */
function bindModalEvents() {
    // 获取模态框相关DOM元素；任一缺失则无法安全绑定，提前返回避免抛错导致后续初始化中断
    const modal = document.getElementById('modal-route');
    const modalContent = document.getElementById('modal-content');
    const form = document.getElementById('form-route');
    const btnAddRoute = document.getElementById('btn-add-route');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');

    if (!modal || !modalContent || !form || !btnAddRoute) {
        return;
    }

    const openModal = () => {
        modal.classList.remove('hidden');
        // Hack for animation
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        }, 10);
    };

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            form.reset();
            form.elements['originalId'].value = ''; // 清空原始线路号
        }, 300);
    };

    btnAddRoute.addEventListener('click', () => {
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) modalTitle.innerText = '新增线路';
        form.elements['id'].readOnly = false;
        form.elements['id'].removeAttribute('readonly');
        form.elements['isEdit'].value = 'false';
        form.elements['originalId'].value = '';
        openModal();
    });

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            isEdit: form.elements['isEdit'].value === 'true',
            originalId: form.elements['originalId'].value, // 原始线路号（编辑时使用）
            id: form.elements['id'].value.trim(),
            start: form.elements['start'].value.trim(),
            end: form.elements['end'].value.trim(),
            time: form.elements['time'].value.trim(),
            stationsStr: form.elements['stationsStr'].value
        };

        // 字符长度校验：线路号、起点站、终点站最多10个字符
        if (formData.id.length > 10) {
            window.UI.showToast('线路号不能超过10个字符', 'error');
            form.elements['id'].focus();
            return;
        }
        if (formData.start.length > 10) {
            window.UI.showToast('起点站名称不能超过10个字符', 'error');
            form.elements['start'].focus();
            return;
        }
        if (formData.end.length > 10) {
            window.UI.showToast('终点站名称不能超过10个字符', 'error');
            form.elements['end'].focus();
            return;
        }

        /**
         * 校验运营时间格式：HH:MM-HH:MM
         * 正则表达式说明：
         * - ^ 表示字符串开始
         * - ([0-1]?[0-9]|2[0-3]) 匹配小时：0-9或10-19或20-23
         *   - [0-1]?[0-9] 匹配 0-19（可选的前导0）
         *   - | 表示或
         *   - 2[0-3] 匹配 20-23
         * - : 匹配冒号分隔符
         * - [0-5][0-9] 匹配分钟：00-59
         * - - 匹配连字符
         * - 重复小时和分钟模式（结束时间）
         * - $ 表示字符串结束
         */
        const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        // 如果时间格式不正确，显示错误提示并聚焦到时间输入框
        if (formData.time && !timePattern.test(formData.time)) {
            window.UI.showToast('运营时间格式不正确，请使用格式：06:00-22:00', 'error');
            form.elements['time'].focus();
            return;
        }

        if(RoutesModule.handleSave(formData)) {
            closeModal();
        }
    });

    // 将全局需要的函数挂载到 Window
    window.deleteRoute = RoutesModule.handleDelete.bind(RoutesModule);
    window.editRoute = (id) => {
        const route = window.Storage.getRoutes().find(r => r.id === id);
        if(!route) return;

        form.elements['isEdit'].value = 'true';
        form.elements['originalId'].value = route.id; // 保存原始线路号
        form.elements['id'].value = route.id;
        form.elements['id'].readOnly = false; // 允许编辑线路号
        form.elements['id'].removeAttribute('readonly'); // 确保移除只读属性
        form.elements['start'].value = route.start;
        form.elements['end'].value = route.end;
        form.elements['time'].value = route.time;
        // 将站点数组转换为逗号分隔的字符串：使用 join(', ') 方法连接数组元素
        form.elements['stationsStr'].value = route.stations.join(', ');

        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) modalTitle.innerText = '编辑线路';
        openModal();
    };

    window.updateVehicleStatus = (id, status) => {
        VehiclesModule.updateStatus(id, status);
    };
}

/**
 * 绑定司机模态框事件
 * 处理司机新增/编辑弹窗的打开、关闭和表单提交逻辑
 */
function bindDriverModalEvents() {
    // 获取司机模态框相关DOM元素
    const modal = document.getElementById('modal-driver');
    const modalContent = document.getElementById('modal-driver-content');
    const form = document.getElementById('form-driver');
    const btnCloseModal = document.getElementById('btn-close-driver-modal');
    const btnCancelModal = document.getElementById('btn-cancel-driver-modal');

    if (!modal || !modalContent || !form) {
        return;
    }

    const openModal = () => {
        modal.classList.remove('hidden');
        // Hack for animation
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        }, 10);
    };

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            form.reset();
            form.elements['originalId'].value = '';
        }, 300);
    };

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            isEdit: form.elements['isEdit'].value === 'true',
            originalId: form.elements['originalId'].value,
            id: form.elements['id'].value.trim(),
            name: form.elements['name'].value.trim(),
            status: window.driverStatusSelectInstance ? window.driverStatusSelectInstance.getValue() : 'resting',
            vehicleId: window.driverVehicleSelectInstance ? window.driverVehicleSelectInstance.getValue() : '',
            driveTime: form.elements['driveTime'].value ? parseInt(form.elements['driveTime'].value) : 0
        };

        // 字符长度校验
        if (formData.id.length > 10) {
            window.UI.showToast('工号不能超过10个字符', 'error');
            form.elements['id'].focus();
            return;
        }
        if (formData.name.length > 10) {
            window.UI.showToast('姓名不能超过10个字符', 'error');
            form.elements['name'].focus();
            return;
        }

        if(DriversModule.handleSave(formData)) {
            closeModal();
        }
    });

    // 将全局需要的函数挂载到 Window
    window.updateDriverStatus = (id, status) => {
        DriversModule.updateStatus(id, status);
    };
    window.deleteDriver = DriversModule.handleDelete.bind(DriversModule);
    window.editDriver = (id) => {
        const driver = window.Storage.getDrivers().find(d => d.id === id);
        if(!driver) return;

        form.elements['isEdit'].value = 'true';
        form.elements['originalId'].value = driver.id;
        form.elements['id'].value = driver.id;
        form.elements['id'].readOnly = false;
        form.elements['id'].removeAttribute('readonly');
        form.elements['name'].value = driver.name;
        form.elements['driveTime'].value = driver.driveTime || 0;

        // 初始化状态选择器
        if (window.driverStatusSelectInstance) {
            window.driverStatusSelectInstance.destroy();
        }
        const statusSelectContainer = document.getElementById('driver-status-select');
        statusSelectContainer.innerHTML = '';
        const statusSelect = new window.CustomSelect({
            id: 'driver-status',
            placeholder: '选择状态',
            value: driver.status,
            options: [
                { value: 'working', label: '工作中' },
                { value: 'resting', label: '休息中' },
                { value: 'leave', label: '请假中' }
            ],
            onChange: () => {}
        });
        statusSelectContainer.appendChild(statusSelect.container);
        window.driverStatusSelectInstance = statusSelect;

        // 初始化车辆选择器
        const vehicles = window.Storage.getVehicles();
        const vehicleOptions = [
            { value: '', label: '未分配' },
            ...vehicles.map(v => ({ value: v.id, label: `${v.plate} - ${v.route}` }))
        ];
        if (window.driverVehicleSelectInstance) {
            window.driverVehicleSelectInstance.destroy();
        }
        const vehicleSelectContainer = document.getElementById('driver-vehicle-select');
        vehicleSelectContainer.innerHTML = '';
        const vehicleSelect = new window.CustomSelect({
            id: 'driver-vehicle',
            placeholder: '选择车辆',
            value: driver.vehicleId || '',
            options: vehicleOptions,
            onChange: () => {}
        });
        vehicleSelectContainer.appendChild(vehicleSelect.container);
        window.driverVehicleSelectInstance = vehicleSelect;

        const modalTitle = document.getElementById('modal-driver-title');
        if (modalTitle) modalTitle.innerText = '编辑司机';
        openModal();
    };
    window.addDriver = () => {
        const modalTitle = document.getElementById('modal-driver-title');
        if (modalTitle) modalTitle.innerText = '新增司机';
        form.elements['id'].readOnly = false;
        form.elements['id'].removeAttribute('readonly');
        form.elements['isEdit'].value = 'false';
        form.elements['originalId'].value = '';
        form.elements['id'].value = '';
        form.elements['name'].value = '';
        form.elements['driveTime'].value = '';

        // 初始化状态选择器
        if (window.driverStatusSelectInstance) {
            window.driverStatusSelectInstance.destroy();
        }
        const statusSelectContainer = document.getElementById('driver-status-select');
        statusSelectContainer.innerHTML = '';
        const statusSelect = new window.CustomSelect({
            id: 'driver-status',
            placeholder: '选择状态',
            value: 'resting',
            options: [
                { value: 'working', label: '工作中' },
                { value: 'resting', label: '休息中' },
                { value: 'leave', label: '请假中' }
            ],
            onChange: () => {}
        });
        statusSelectContainer.appendChild(statusSelect.container);
        window.driverStatusSelectInstance = statusSelect;

        // 初始化车辆选择器
        const vehicles = window.Storage.getVehicles();
        const vehicleOptions = [
            { value: '', label: '未分配' },
            ...vehicles.map(v => ({ value: v.id, label: `${v.plate} - ${v.route}` }))
        ];
        if (window.driverVehicleSelectInstance) {
            window.driverVehicleSelectInstance.destroy();
        }
        const vehicleSelectContainer = document.getElementById('driver-vehicle-select');
        vehicleSelectContainer.innerHTML = '';
        const vehicleSelect = new window.CustomSelect({
            id: 'driver-vehicle',
            placeholder: '选择车辆',
            value: '',
            options: vehicleOptions,
            onChange: () => {}
        });
        vehicleSelectContainer.appendChild(vehicleSelect.container);
        window.driverVehicleSelectInstance = vehicleSelect;

        openModal();
    };
}

/**
 * 初始化司机筛选下拉框
 * 创建自定义下拉选择组件，用于按状态筛选司机
 */
function initDriverFilter() {
    // 获取筛选容器元素
    const filterContainer = document.getElementById('driver-filter-container');
    if (!filterContainer) return;

    // 创建自定义下拉选择组件实例
    const driverFilter = new window.CustomSelect({
        id: 'driver-filter',
        placeholder: '全部人员',
        value: 'all',
        options: [
            { value: 'all', label: '全部人员' },
            { value: 'working', label: '工作中' },
            { value: 'resting', label: '休息中' },
            { value: 'leave', label: '请假中' }
        ],
        onChange: (value) => {
            DriversModule.render(value);
        }
    });

    // 将组件插入到容器中
    filterContainer.appendChild(driverFilter.container);

    // 保存引用以便后续使用
    window.driverFilterInstance = driverFilter;
}

/**
 * 初始化车辆筛选下拉框
 * 创建自定义下拉选择组件，用于按状态筛选车辆
 */
function initVehicleFilter() {
    // 获取筛选容器元素
    const filterContainer = document.getElementById('vehicle-filter-container');
    if (!filterContainer) return;

    // 创建自定义下拉选择组件实例
    const vehicleFilter = new window.CustomSelect({
        id: 'vehicle-filter',
        placeholder: '全部车辆',
        value: 'all',
        options: [
            { value: 'all', label: '全部车辆' },
            { value: 'running', label: '运行中' },
            { value: 'stopped', label: '已停运' },
            { value: 'maintenance', label: '维修中' }
        ],
        onChange: (value) => {
            VehiclesModule.render(value);
        }
    });

    // 将组件插入到容器中
    filterContainer.appendChild(vehicleFilter.container);

    // 保存引用以便后续使用
    window.vehicleFilterInstance = vehicleFilter;
}

/**
 * 初始化线路搜索功能
 * 为搜索输入框添加事件监听，实现实时搜索和防抖处理
 */
function initRouteSearch() {
    // 获取搜索相关DOM元素
    const searchInput = document.getElementById('route-search-input');      // 搜索输入框
    const clearBtn = document.getElementById('btn-clear-search');            // 清除按钮
    const resultEl = document.getElementById('route-search-result');         // 搜索结果提示元素
    
    if (!searchInput) return;
    
    // 防抖定时器：用于延迟搜索执行，避免频繁触发
    let debounceTimer;
    
    // 监听搜索输入事件
    searchInput.addEventListener('input', (e) => {
        // 获取输入值并去除首尾空格
        const keyword = e.target.value.trim();
        
        // 根据是否有输入内容，显示或隐藏清除按钮
        if (clearBtn) {
            if (keyword) {
                clearBtn.classList.remove('hidden');
                clearBtn.style.display = 'block';
            } else {
                clearBtn.classList.add('hidden');
                clearBtn.style.display = 'none';
            }
        }
        
        // 防抖处理：清除之前的定时器，设置新的定时器
        // 如果用户在300毫秒内继续输入，定时器会被重置
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            // 300毫秒后执行搜索，渲染匹配的线路
            RoutesModule.render(keyword);
        }, 300);
    });

    // 清除搜索（clearBtn 可能不存在，先判空再绑定）
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.classList.add('hidden');
            clearBtn.style.display = 'none';
            if (resultEl) resultEl.classList.add('hidden');
            RoutesModule.render('');
        });
    }

    // 渲染搜索图标（使用 window.Icons，避免 ES 模块下未定义）
    const searchIcon = document.getElementById('icon-route-search');
    if (searchIcon && window.Icons) {
        searchIcon.innerHTML = window.Icons.search;
    }
}
