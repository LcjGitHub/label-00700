/**
 * 线路管理模块
 */

// Storage 对象由 main.js 统一管理，此处直接使用全局对象 window.Storage
// 注意：由于 ES6 模块加载顺序，routes.js 可能在 main.js 的 Storage 定义之前执行
// 因此直接使用 window.Storage，而不是创建本地常量

// ========== SVG 图标库 ==========
/**
 * Icons 对象
 * 作用：提供线路管理模块所需的 SVG 图标字符串
 * 用途：在渲染线路卡片时，为操作按钮提供视觉图标，提升用户体验和界面美观度
 * 说明：使用内联 SVG 而非图片文件，可以更好地控制颜色和大小，且无需额外 HTTP 请求
 */
const Icons = {
  /**
   * 编辑图标
   * 用途：在线路卡片的"编辑"按钮中使用，表示编辑/修改操作
   * SVG 说明：显示一支笔和文档的图标，直观表示编辑功能
   */
  edit: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>`,
  /**
   * 删除图标
   * 用途：在线路卡片的"删除"按钮中使用，表示删除操作
   * SVG 说明：显示垃圾桶图标，直观表示删除/移除功能
   */
  trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`
};

// ========== UI 工具 ==========
// 注意：ConfirmDialog 类由 main.js 统一管理并暴露到全局 window.ConfirmDialog
// 此处直接使用全局对象，避免代码重复，提高可维护性
const UI = {
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
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
    // 使用全局 ConfirmDialog 类（由 main.js 定义并暴露）
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
    // 使用全局 ConfirmDialog 类（由 main.js 定义并暴露）
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
    document.getElementById(pageId).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if(btn.dataset.target === pageId) {
        btn.classList.add('bg-white/20', 'text-white', 'shadow-md');
        btn.classList.remove('text-blue-100', 'hover:bg-white/10');
      } else {
        btn.classList.remove('bg-white/20', 'text-white', 'shadow-md');
        btn.classList.add('text-blue-100', 'hover:bg-white/10');
      }
    });
  }
};

// ========== 线路管理模块 ==========
export const RoutesModule = {
  // 当前搜索关键词，用于高亮显示
  searchKeyword: '',

  /**
   * 渲染线路列表
   * @param {string} searchKeyword - 搜索关键词，用于过滤和高亮显示
   */
  render(searchKeyword = '') {
    // 保存搜索关键词到实例属性，供高亮函数使用
    this.searchKeyword = searchKeyword;
    // 从本地存储获取所有线路数据
    const routes = window.Storage.getRoutes();
    // 获取线路列表容器元素
    const listEl = document.getElementById('routes-list');
    // 获取搜索结果提示元素
    const resultEl = document.getElementById('route-search-result');

    let filteredRoutes = routes;
    /**
     * 如果有关键词，执行搜索过滤
     * 
     * trim() 方法的作用：
     * - 去除搜索关键词首尾的空白字符（空格、制表符、换行符等）
     * - 如果用户输入 "  火车站  "，trim() 后会变成 "火车站"
     * - 如果 trim() 后的字符串为空（如用户只输入空格），则返回空字符串 ''
     * - 空字符串在布尔上下文中为 false，因此可以用于判断是否有有效的搜索关键词
     * 
     * 为什么使用 trim()：
     * - 防止用户误输入首尾空格导致搜索失败
     * - 提升用户体验，即使输入有空格也能正常搜索
     * - 避免空白字符串被当作有效关键词
     * 
     * @example
     * searchKeyword.trim() // "  火车站  " => "火车站" => true（有内容）
     * searchKeyword.trim() // "   " => "" => false（无内容）
     * searchKeyword.trim() // "" => "" => false（无内容）
     */
    if (searchKeyword.trim()) {
      /**
       * 将关键词转换为小写，实现不区分大小写的搜索
       * 
       * toLowerCase() 方法的作用：
       * - 将字符串中的所有大写字母转换为小写字母
       * - 不影响数字、标点符号和中文等非字母字符
       * - 返回一个新的字符串，不修改原字符串
       * 
       * 为什么使用 toLowerCase()：
       * - 实现不区分大小写的搜索，提升用户体验
       * - 用户输入 "BEIJING"、"Beijing"、"beijing" 都能匹配到 "Beijing"
       * - 统一转换为小写后进行比较，避免大小写不匹配导致的搜索失败
       * 
       * @example
       * searchKeyword.toLowerCase() // "BEIJING" => "beijing"
       * searchKeyword.toLowerCase() // "Beijing" => "beijing"
       * searchKeyword.toLowerCase() // "火车站" => "火车站"（中文不受影响）
       */
      const keyword = searchKeyword.toLowerCase();
      
      /**
       * 过滤线路：使用 filter() 方法筛选出匹配搜索关键词的线路
       * 
       * filter() 方法的过滤逻辑：
       * - 遍历 routes 数组中的每个线路对象（route）
       * - 对每个线路对象执行回调函数，返回 true 或 false
       * - 返回 true 的线路会被保留在新数组中，返回 false 的线路会被过滤掉
       * - 最终返回一个新的数组，包含所有匹配的线路
       * 
       * 过滤条件（使用 || 逻辑或运算符，满足任一条件即可）：
       * 1. route.id.toLowerCase().includes(keyword)
       *    - 将线路号转换为小写，检查是否包含关键词
       *    - 例如：线路号 "101" 可以匹配关键词 "1"、"10"、"101"
       * 
       * 2. route.start.toLowerCase().includes(keyword)
       *    - 将起点站名称转换为小写，检查是否包含关键词
       *    - 例如：起点 "火车站" 可以匹配关键词 "火车"、"车站"、"火车站"
       * 
       * 3. route.end.toLowerCase().includes(keyword)
       *    - 将终点站名称转换为小写，检查是否包含关键词
       *    - 例如：终点 "市民中心" 可以匹配关键词 "市民"、"中心"、"市民中心"
       * 
       * 4. route.stations.some(s => s.toLowerCase().includes(keyword))
       *    - 使用 some() 方法检查途经站点数组中是否至少有一个站点名称包含关键词
       *    - 对每个站点名称转换为小写后检查是否包含关键词
       *    - 例如：途经站点 ["火车站", "商业街", "医院"] 中，关键词 "医院" 可以匹配到 "医院"
       * 
       * toLowerCase() 在过滤中的使用：
       * - 将线路号、起点、终点、站点名称都转换为小写
       * - 与已转换为小写的 keyword 进行比较
       * - 确保搜索不区分大小写，提升搜索的友好性
       * 
       * includes() 方法的作用：
       * - 检查字符串是否包含指定的子字符串
       * - 返回 true（包含）或 false（不包含）
       * - 支持部分匹配，如 "火车站" 包含 "火车"
       * 
       * @example
       * // 示例1：匹配线路号
       * routes.filter(route => route.id.toLowerCase().includes('101'))
       * // 线路号 "101"、"101A"、"101B" 都会被匹配
       * 
       * // 示例2：匹配起点站
       * routes.filter(route => route.start.toLowerCase().includes('火车'))
       * // 起点 "火车站"、"火车东站" 都会被匹配
       * 
       * // 示例3：匹配途经站点
       * routes.filter(route => route.stations.some(s => s.toLowerCase().includes('医院')))
       * // 途经站点中包含 "医院"、"人民医院"、"医院站" 的线路都会被匹配
       */
      filteredRoutes = routes.filter(route =>
        route.id.toLowerCase().includes(keyword) ||           // 匹配线路号
        route.start.toLowerCase().includes(keyword) ||        // 匹配起点站
        route.end.toLowerCase().includes(keyword) ||          // 匹配终点站
        route.stations.some(s => s.toLowerCase().includes(keyword))  // 匹配途经站点
      );

      // 显示搜索结果提示信息
      if (resultEl) {
        resultEl.classList.remove('hidden');
        // 显示匹配的线路数量
        resultEl.innerHTML = `找到 <span class="font-semibold text-blue-600">${filteredRoutes.length}</span> 条匹配的线路`;
      }
    } else {
      // 没有搜索关键词时，隐藏搜索结果提示
      if (resultEl) {
        resultEl.classList.add('hidden');
      }
    }

    // 如果没有匹配的线路，显示空状态提示
    if (filteredRoutes.length === 0) {
      /**
       * 根据是否有搜索关键词显示不同的空状态提示
       * 
       * trim() 方法在此处的作用：
       * - 判断用户是否输入了有效的搜索关键词
       * - 如果 trim() 后有内容，说明用户进行了搜索但未找到结果
       * - 如果 trim() 后为空，说明没有线路数据（可能是首次使用或数据被清空）
       * - 用于区分"搜索无结果"和"无数据"两种不同的空状态
       * 
       * 三元运算符的逻辑：
       * - searchKeyword.trim() ? ... : ...
       * - 如果 trim() 后有内容（truthy），显示搜索无结果的提示
       * - 如果 trim() 后为空（falsy），显示无数据的提示
       */
      const emptyMessage = searchKeyword.trim()
        ? `没有找到包含 "<span class="font-semibold text-gray-700">${searchKeyword}</span>" 的线路`
        : '暂无线路数据，请点击上方"新增线路"按钮添加第一条线路';

      listEl.innerHTML = `
        <div class="col-span-full text-center py-16 text-gray-500 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-300 shadow-inner">
          <div class="text-4xl mb-4">${searchKeyword.trim() ? '🔍' : '🚌'}</div>
          <p class="text-lg font-medium mb-2">${emptyMessage}</p>
          ${searchKeyword.trim() ? '<p class="text-small mt-2">请尝试其他关键词</p>' : ''}
        </div>`;
      return;
    }

    /**
     * 将过滤后的线路数组转换为HTML字符串并渲染到页面
     * 
     * map() 方法的作用：
     * - 遍历 filteredRoutes 数组中的每个线路对象（route）
     * - 对每个线路对象执行回调函数，生成对应的HTML卡片字符串
     * - 返回一个新的数组，包含所有生成的HTML字符串
     * - 例如：输入 [route1, route2] => 输出 ['<div>...</div>', '<div>...</div>']
     * 
     * join('') 方法的作用：
     * - 将 map() 返回的HTML字符串数组连接成一个完整的字符串
     * - 空字符串 '' 作为分隔符，表示直接连接，不留空格或换行
     * - 例如：['<div>...</div>', '<div>...</div>'] => '<div>...</div><div>...</div>'
     * 
     * 最终结果：将完整的HTML字符串赋值给 listEl.innerHTML，实现批量渲染线路卡片
     */
    listEl.innerHTML = filteredRoutes.map(route => {
      /**
       * highlight 内部函数
       * 
       * 作用：处理搜索关键词匹配，保留原文本格式（不添加任何高亮样式）
       * 
       * 用途：
       * 1. 在线路卡片中处理与搜索关键词匹配的部分（线路号、起点、终点、站点名称）
       * 2. 保留原文本格式，不添加任何高亮样式
       * 3. 支持不区分大小写的匹配，提升搜索的友好性
       * 
       * 工作原理：
       * - 如果没有搜索关键词，直接返回原文本，不做任何处理
       * - 使用正则表达式全局匹配搜索关键词（不区分大小写）
       * - 直接返回匹配的文本，不添加任何样式
       * - 保留原文本的大小写格式
       * 
       * 使用场景：
       * - 在线路号中处理：如搜索 "101" 时，匹配 "101路" 中的 "101"
       * - 在起点/终点中处理：如搜索 "火车站" 时，匹配 "火车站"
       * - 在站点名称中处理：如搜索 "医院" 时，匹配途经站点中的 "医院"
       * 
       * @param {string} text - 需要处理的文本（如线路号、起点站、终点站、站点名称等）
       * @returns {string} - 处理后的文本字符串，匹配的关键词保持原格式
       * 
       * @example
       * // 示例1：有搜索关键词
       * highlight('火车站') // 搜索 "火车" => 返回 '火车站'（无样式）
       * 
       * // 示例2：无搜索关键词
       * highlight('火车站') // 无搜索 => 返回 '火车站'
       * 
       * // 示例3：不区分大小写
       * highlight('Beijing') // 搜索 "beijing" => 返回 'Beijing'（保留原大小写）
       */
      const highlight = (text) => {
        // 如果没有搜索关键词，直接返回原文本，避免不必要的处理
        if (!searchKeyword.trim()) return text;
        
        /**
         * 创建正则表达式：用于匹配搜索关键词
         * 
         * 正则表达式说明：
         * - `(${searchKeyword})` - 使用括号捕获搜索关键词，$1 可以引用匹配的内容
         * - 'gi' 标志：
         *   - g (global): 全局匹配，匹配文本中所有出现的关键词，而不仅仅是第一个
         *   - i (ignore case): 不区分大小写，如搜索 "abc" 可以匹配 "ABC"、"Abc" 等
         * 
         * 示例：
         * - 搜索 "火车" => 正则：/(火车)/gi
         * - 文本 "火车站到火车东站" => 匹配两次："火车"（在"火车站"中）和"火车"（在"火车东站"中）
         */
        const regex = new RegExp(`(${searchKeyword})`, 'gi');
        
        /**
         * 替换匹配的关键词（不添加任何样式）
         * 
         * replace() 方法说明：
         * - 第一个参数：正则表达式，用于匹配要替换的文本
         * - 第二个参数：替换后的内容，使用 $1 引用正则表达式中第一个捕获组（即匹配到的关键词）
         * 
         * 说明：
         * - 直接返回匹配的文本，不添加任何高亮样式
         * - 使用 $1 保留原文本中的大小写格式，如搜索 "abc" 匹配到 "ABC" 时，显示的是 "ABC" 而不是 "abc"
         * - 这样用户可以清楚地看到匹配到的原始文本格式
         */
        // 移除高亮样式，直接返回匹配的文本（不添加任何样式）
        return text.replace(regex, '$1');
      };

      return `
      <div class="card card-hover flex flex-col justify-between h-full p-5 relative overflow-hidden border-l-4 border-l-blue-500">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"></div>
        <div class="flex-1 pt-2">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            <span class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-base shadow-lg border border-blue-800/20 max-w-[120px] truncate" title="${route.id}路">${highlight(route.id)}路</span>
            <span class="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold">${route.time}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-800 font-semibold mb-4 bg-gradient-to-r from-green-50 to-blue-50 p-2.5 rounded-lg border border-green-100">
            <span class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span>
            <span class="text-base font-bold flex-1 truncate">${highlight(route.start)}</span>
            <span class="text-gray-400 text-sm">→</span>
            <span class="text-base font-bold flex-1 truncate">${highlight(route.end)}</span>
          </div>
          <div class="mb-4">
            <div class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              途经站点 (${route.stations.length})
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${route.stations.slice(0, 4).map(s => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs border border-blue-200 font-medium max-w-[120px] truncate" title="${s}">${highlight(s)}</span>`).join('')}
              ${route.stations.length > 4 ? `<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs border border-gray-200 font-medium">+${route.stations.length - 4}</span>` : ''}
            </div>
          </div>
        </div>
        <!-- 操作按钮区域 -->
        <div class="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
          <!-- 编辑按钮：使用 Icons.edit 图标，点击后打开编辑模态框 -->
          <button onclick="window.editRoute('${route.id}')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 active:scale-95 transition-all text-xs font-semibold border border-blue-300 shadow-sm hover:shadow-md">
            ${Icons.edit} 编辑
          </button>
          <!-- 删除按钮：使用 Icons.trash 图标，点击后弹出确认对话框 -->
          <button onclick="window.deleteRoute('${route.id}')" class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:from-red-100 hover:to-red-200 active:scale-95 transition-all text-xs font-semibold border border-red-300 shadow-sm hover:shadow-md">
            ${Icons.trash} 删除
          </button>
        </div>
      </div>
    `;
    }).join('');
  },

  /**
   * 删除线路
   * @param {string} id - 要删除的线路ID
   */
  handleDelete(id) {
    // 显示确认对话框，用户确认后执行删除操作
    window.UI.confirm(
      '确定要删除这条线路吗？这将同时删除关联的车辆数据。',
      () => {
        // 过滤掉要删除的线路：保留所有 id 不等于传入 id 的线路
        const routes = window.Storage.getRoutes().filter(r => r.id !== id);
        window.Storage.saveRoutes(routes);
        // 级联删除：同时删除所有关联到该线路的车辆数据
        // 过滤掉所有 routeId 等于被删除线路 id 的车辆
        const vehicles = window.Storage.getVehicles().filter(v => v.routeId !== id);
        window.Storage.saveVehicles(vehicles);
        window.UI.showToast('删除成功');
        // 重新渲染列表，更新界面显示
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

  /**
   * 保存线路（新增或编辑）
   * @param {Object} formData - 表单数据对象
   * @param {boolean} formData.isEdit - 是否为编辑模式
   * @param {string} formData.originalId - 原始线路号（编辑模式下使用）
   * @param {string} formData.id - 线路号
   * @param {string} formData.start - 起点站
   * @param {string} formData.end - 终点站
   * @param {string} formData.time - 运营时间
   * @param {string} formData.stationsStr - 途经站点字符串（逗号分隔）
   * @returns {boolean} - 保存是否成功
   */
  handleSave(formData) {
    const routes = window.Storage.getRoutes();
    // 查找新线路号是否已存在：检查是否有其他线路使用了相同的线路号
    const existingIndex = routes.findIndex(r => r.id === formData.id);
    // 查找原始线路号的位置（编辑模式下使用）：用于定位要修改的线路
    const originalIndex = formData.originalId ? routes.findIndex(r => r.id === formData.originalId) : -1;

    /**
     * 处理途经站点字符串：分割、去空、过滤
     * 1. split(/[,，]/) - 使用正则表达式分割字符串，支持中文逗号（，）和英文逗号（,）
     * 2. map(s => s.trim()) - 遍历数组，去除每个站点名称前后的空白字符
     * 3. filter(s => s) - 过滤掉空字符串，确保只保留有效的站点名称
     */
    const stations = formData.stationsStr.split(/[,，]/).map(s => s.trim()).filter(s => s);

    const newRoute = {
      id: formData.id,
      start: formData.start,
      end: formData.end,
      time: formData.time,
      stations: stations
    };

    // 编辑模式：更新已存在的线路
    if (formData.isEdit) {
      // 如果修改了线路号（原始ID与新ID不同）
      if (formData.originalId && formData.originalId !== formData.id) {
        // 检查新线路号是否已被其他线路使用
        if (existingIndex > -1) {
          window.UI.showToast('该线路号已存在', 'error');
          return false;
        }
        // 删除原线路：从数组中移除原始线路
        if (originalIndex > -1) {
          routes.splice(originalIndex, 1);
        }
        // 添加新线路：将新线路数据添加到数组末尾
        routes.push(newRoute);
        window.UI.showToast('线路修改成功');
      } else {
        // 线路号未修改，直接更新线路数据
        if (originalIndex > -1) {
          // 直接替换原位置的数据
          routes[originalIndex] = newRoute;
          window.UI.showToast('线路修改成功');
        } else {
          window.UI.showToast('未找到要修改的线路', 'error');
          return false;
        }
      }
    } else {
      // 新增模式：添加新线路
      // 检查线路号是否已存在
      if (existingIndex > -1) {
        window.UI.showToast('该线路号已存在', 'error');
        return false;
      }
      // 将新线路添加到数组末尾
      routes.push(newRoute);
      window.UI.showToast('线路新增成功');
    }

    window.Storage.saveRoutes(routes);
    this.render();
    return true;
  }
};

// 只在 window.UI 不存在时创建，避免覆盖 main.js 中定义的完整版本
if (!window.UI) {
  window.UI = UI;
}
