<template>
  <div class="yf-tree-select" :class="selectClass">
    <!-- 下拉文本 -->
    <el-select
        :id="'yf-tree-select-' + guid"
        :style="styles"
        class="yf-tree-select-input"
        v-model="labels"
        :disabled="disabled"
        popper-class="select-option"
        ref="select"
        v-bind="selectParams"
        :popper-append-to-body="false"
        :filterable="false"
        :multiple="selectParams.multiple"
        v-popover:popover
        @remove-tag="_selectRemoveTag"
        :title="labels"
        @clear="_selectClearFun"
        @focus="_popoverShowFun"
    >
    </el-select>
    <!-- 弹出框 -->
    <el-popover
        ref="popover"
        :placement="placement"
        :transition="transition"
        :popper-class="popperClass"
        :width="width"
        v-model="visible"
        trigger="click"
    >
      <!-- 是否显示搜索框 -->
      <el-input
          v-if="treeParams.filterable"
          v-model="keywords"
          size="mini"
          class="input-with-select mb10"
          @change="_searchFun"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-scrollbar
          tag="div"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          class="is-empty"
      >
        <!-- 树列表 -->
        <el-tree
            ref="tree"
            :class="{'single-select':!selectParams.multiple}"
            v-show="data.length > 0"
            v-bind="treeParams"
            :data="data"
            :node-key="propsValue"
            :draggable="false"
            :current-node-key="ids.length > 0 ? ids[0] : ''"
            :show-checkbox="selectParams.multiple"
            :render-content="treeRenderFun"
            @node-click="_treeNodeClickFun"
            @check="_treeCheckFun"
        ></el-tree>
        <!-- 暂无数据 -->
        <div v-if="data.length === 0" class="no-data">暂无数据</div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<script>
import { on, off } from "./dom";
import { guid,debounce } from "./utils";
export default {
  name: "yf-tree-select",
  props: {
    // v-model,存储的是treeParams.data里面的id
    value: {
      // `String` / `Array` / `Number` / `Object`
      type: [String, Array, Number,Object],
      default() {
        return "";
      },
    },
    // el-select样式
    styles: {
      type: Object,
      default() {
        return {};
      },
    },
    // 下拉框 挂类
    selectClass: {
      type: String,
      default() {
        return "";
      },
    },
    // popover 挂类
    popoverClass: {
      type: String,
      default() {
        return "";
      },
    },
    // 是否禁用文本框
    disabled: {
      type: Boolean,
      // false
      default() {
        return false;
      },
    },
    // 弹出框位置
    placement: {
      type: String,
      //  bottom
      default() {
        return "bottom";
      },
    },
    // 弹出框过渡动画
    transition: {
      type: String,
      //  el-zoom-in-top
      default() {
        return "el-zoom-in-top";
      },
    },
    // 树渲染方法，具体参考el-tree Function(h, { node, data, store }) {}
    treeRenderFun: Function,
    // 搜索过滤方法，具体参考el-tree Function(h, { value, data, node }) {}
    filterNodeMethod: Function,
    /*
        文本框参数，几乎支持el-select所有的API<br>
        取消参数：<br>
        设定下拉框的弹出框隐藏：<br>
        `:popper-append-to-body="false"` <br>
        搜索从弹出框里面执行： <br>
        `filterable="false"`
        */
    selectAttrs: {
      type: Object,
      /*
      Object默认参数：<br><br>
      是否可以清空选项：<br>
      `clearable: true,`<br><br>
      是否禁用：<br>
      `disabled: false,`<br><br>
      搜索框placeholder文字：<br>
      `placeholder: '请选择',`<br><br>
      */
      default() {
        return {};
      },
    },
    /*
    下拉树参数，几乎支持el-tree所有的API<br>
     取消参数:<br>
    `:show-checkbox="selectParams.multiple"`<br>
    使用下拉框参数multiple判断是否对树进行多选<br>
    取消对el-tree的人为传参show-checkbox<br>
    `:node-key="propsValue"`     自动获取treeParams.props.value<br>
    `:draggable="false"`         屏蔽拖动
    */
    treeAttrs: {
      type: Object,
      /*
        Object默认参数：<br><br>
        在有子级的情况下是否点击父级关闭弹出框,false 只能点击子级关闭弹出框：<br><br>
        `clickParent: false`<br><br>
        是否显示搜索框：<br><br>
        `filterable: false`<br><br>
        是否只是叶子节点：<br><br>
        `leafOnly: false`<br><br>
        是否包含半选节点：<br><br>
        `includeHalfChecked: false`<br><br>
        下拉树的数据：<br><br>
        `data:[]`<br><br>
        下拉树的props：<br><br>
        `props: {`<br>
            `children: 'children',`<br>
            `label: 'name',`<br>
            `value: 'flowId',`<br>
            `disabled: 'disabled'`<br>
        `}`
        */
      default() {
        return {}
      },
    },
    customerFilter: { //是否自定义过滤
      type: Boolean,
      default: false
    },
    foldLabels: { //是否折叠labels
      type: Boolean,
      default: false
    },
    onlyLeaf: { // 只能选择叶子节点
      type: Boolean,
      default: false
    },
    needValueName: { // 是否需要返回value和name
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      guid: guid(),
      propsValue: "id",
      propsLabel: "label",
      propsCode: null, // 可能有空的情况
      propsDisabled: "disabled",
      propsChildren: "children",
      leafOnly: false,
      includeHalfChecked: false,
      data: [],
      keywords: "",
      labels: "", // 存储名称，用于下拉框显示内容
      ids: [], // 存储id
      visible: false, // popover v-model
      width: 150,
      dataTrans: [],
      treeParams:{
        filterable: false,
        leafOnly: false,
        'expand-on-click-node':false,
        includeHalfChecked: false,
        data: [],
        multiple: false,
        props: {
          children: "children",
          label: "name",
          code: "",
          value: "value",
          disabled: "disabled",
        },
      },
      selectParams: {
        clearable: true,
        disabled: false,
        placeholder: "请选择",
        multiple: false, // v-model控制单选还是多选，多选是数组
      },
      singleSelectDom:'',
      timer: ''
    };
  },
  watch: {
    ids: function(val) {
      if (val !== undefined) {
        this.$nextTick(() => {
          this._setSelectNodeFun(val);
        });
      }
    },
    value: function(val) {
      if (this.ids !== val) {
        this._setMultipleFun();
        this.ids = this.getIds(val);
        this.singleSelectDom&&this.singleSelectDom.classList.remove("is-current")
      }
    },
    treeAttrs: {
      handler(val) {
        this.deepMerge(this.treeParams, val)
        this.initTree()
      },
      deep: true,
      immediate: true
    },
    selectAttrs: {
      handler(val) {
        this.deepMerge(this.selectParams, val)
        this.initSelect()
      },
      deep: true,
      immediate: true
    },
    visible(){
      this._updatePopoverLocationFun()
      this.removeAriaHidden()
    }
  },
  computed: {
    popperClass() {
      let onlyLeafClass = this.onlyLeaf ? " only-leaf " : " not-only-leaf ";
      let _c = "yf-tree-select-popper " + this.popoverClass + onlyLeafClass
      return this.disabled ? _c + " disabled " : _c;
    },
  },
  created() {
    this.initTree()
  },
  mounted() {
    this._updateH();
    this.$nextTick(() => {
      on(document, "mouseup", this._popoverHideFun);
    });
  },
  methods: {
    initTree(){
      const { props, data, leafOnly, includeHalfChecked } = this.treeParams;
      this._setMultipleFun();
      this.propsValue = props.value;
      this.propsLabel = props.label;
      this.propsCode = props.code || null; // 可能为空
      this.propsDisabled = props.disabled;
      this.propsChildren = props.children;
      this.leafOnly = leafOnly;
      this.includeHalfChecked = includeHalfChecked;
      this.data = data.length > 0 ? [...data] : [];
      this.dataTrans = this.transformTreeToObjects(this.data)
    },
    initSelect(){
      if (this.selectParams.multiple) {
        this.labels = [];
      } else {
        this.labels = "";
      }
      this.ids = this.getIds(this.value);
    },
    getIds(val) {
      if (this.selectParams.multiple) {
        if (this.isArrayObject(val)) {
          return val.map(v => v[this.propsValue])
        } else {
          return val
        }
      } else {
        return val === "" ? [] : this.isObject(val)?[val[this.propsValue]]:[val]
      }
    },
    // 根据类型判断单选，多选
    _setMultipleFun() {
      let multiple = false;
      if (this.value instanceof Array) {
        multiple = true;
      } else {
        this.treeParams.checkOnClickNode = false
      }
      this.$set(this.selectParams, "multiple", multiple);
    },
    // 输入文本框输入内容抛出
    _searchFun() {
      /*
        对外抛出搜索方法，自行判断是走后台查询，还是前端过滤<br>
        前端过滤：this.$refs.treeSelect.$refs.tree.filter(value);<br>
        后台查询：this.$refs.treeSelect.treeDataUpdateFun(data);
      */
      this.$emit("searchFun", this.keywords);
      if (this.customerFilter) {
        return
      }
      const {filterable,data} = this.treeParams
      if (filterable) {
        let list = JSON.parse(JSON.stringify(data))
        this.data = this.filterTreeArray(list, this.keywords)
        this.treeDataUpdateFun(this.data)
        if (!this.keywords) {
          this.treeParams["default-expanded-keys"] = []
          return
        }
        this.treeParams["default-expanded-keys"] = this.extractAllIds(this.data)
      }
    },
    //  根据id筛选当前树名称，以及选中树列表
    _setSelectNodeFun(ids) {
      const el = this.$refs.tree;
      if (!el) {
        throw new Error("找不到tree dom");
      }
      const { multiple } = this.selectParams;
      // 长度为0，清空选择
      if (ids.length === 0 || this.data.length === 0) {
        this.labels = multiple ? [] : "";
        if (multiple) {
          el.setCheckedKeys([]);
        } else {
          el.setCurrentKey(null);
        }
        return;
      }
      if (multiple) {
        // element-ui bug. 如果是父子节点全选 el.setCheckedKeys([非全量id]);之后el.getCheckedNodes()还是全量
        el.getCheckedNodes(this.leafOnly, this.includeHalfChecked).forEach(
            (item) => {
              el.setChecked(item, false);
            }
        );
        ids.forEach((id) => {
          el.setChecked(id, true);
        });
        const nodes = el.getCheckedNodes(
            this.leafOnly,
            this.includeHalfChecked
        );
        const debouncedSetMultipleLabels = debounce(this.setMultipleLabels)
        debouncedSetMultipleLabels(ids,nodes)
      } else {
        el.setCurrentKey(ids[0]);
        const node = el.getCurrentNode();
        const debouncedSetSingleLabel = debounce(this.setSingleLabel);
        debouncedSetSingleLabel(node)
      }
      this._updatePopoverLocationFun();
    },
    setMultipleLabels(ids,nodes){
      const {propsValue,propsLabel,propsCode} = this
      let labelIds = []
      if (!this.foldLabels) {
        if (propsCode) {
          // 如果有code   labels=code(name)
          this.labels =
              nodes.map((item) =>
                  item[propsCode]
                      ? item[propsLabel] + "(" + item[propsCode] + ")"
                      : item[propsLabel]
              ) || [];
        } else {
          this.labels = nodes.map((item) => item[propsLabel]) || [];
        }
        labelIds = nodes.map(v => v[propsValue])
      } else {
        let newIds = this.filterDeptIds(this.dataTrans, ids)
        if (propsCode) {
          // 如果有code   labels=code(name)
          this.labels = this.dataTrans.filter(v => newIds.includes(v[propsValue]))
              .map(v => v[propsCode]
                  ? v[propsLabel] + "(" + v[propsCode] + ")"
                  : v[propsLabel])||[]
        } else {
          this.labels = this.dataTrans.filter(v => newIds.includes(v[propsValue]))
              .map(v => v[propsLabel])||[]
        }
        labelIds = newIds
      }
      this.getLabelIdsDetail(labelIds)
    },
    setSingleLabel(node){
      let labelIds = []
      if (node) {
        if (this.propsCode) {
          // 如果有code   labels=code(name)
          this.labels = node[this.propsCode]
              ? node[this.propsLabel] + "(" + node[this.propsCode] + ")"
              : node[this.propsLabel];
        } else {
          this.labels = node[this.propsLabel];
        }
        labelIds = [node[this.propsValue]]
      } else {
        this.labels = "";
      }
      this.getLabelIdsDetail(labelIds)
    },
    getLabelIdsDetail(labelIds){
      const detailList = this.dataTrans.filter(v => labelIds.includes(v[this.propsValue])).map(item => {
        const { children, parent, ...rest } = item
        return rest
      })
      this.$emit('getLabelIdsDetail',detailList)
    },
    // 更新popover位置
    _updatePopoverLocationFun() {
      // dom高度还没有更新，做一个延迟
      setTimeout(() => {
        this.$refs.popover.updatePopper();
      }, 50);
    },
    // 获取MouseEvent.path 针对浏览器兼容性兼容ie11,edge,chrome,firefox,safari
    _getEventPath(evt) {
      const path = (evt.composedPath && evt.composedPath()) || evt.path;
      const target = evt.target;
      if (path != null) {
        return path.indexOf(window) < 0 ? path.concat(window) : path;
      }
      if (target === window) {
        return [window];
      }
      function getParents(node, memo) {
        memo = memo || [];
        const parentNode = node.parentNode;
        if (!parentNode) {
          return memo;
        } else {
          return getParents(parentNode, memo.concat(parentNode));
        }
      }
      return [target].concat(getParents(target), window);
    },
    // 树点击
    _treeNodeClickFun(data, node, vm) {
      const { multiple } = this.selectParams;
      const onlyLeaf = this.onlyLeaf
      const { propsValue, propsChildren, propsDisabled } = this;
      const children = data[propsChildren] || [];
      if (data[propsDisabled]) {
        // 禁用
        return;
      }
      if (multiple) {
        //点击树node会触发check选择框
        return
      }
      if (node.checked) {
        const value = data[propsValue];
        this.ids = this.ids.filter((id) => id !== value);
      } else {
        if (!multiple) {
          // 多选，不关闭，单选，判断是否允许点击父级关闭弹出框
          if (onlyLeaf) {
            // 如果不允许点击父级,自身为末级，允许点击之后关闭
            if (children.length === 0) {
              setTimeout(() => {
                this.singleSelectDom&&this.singleSelectDom.classList.remove("is-current")
                vm.$el.classList.add("is-current")
                this.singleSelectDom = vm.$el
              })
              this.ids = [data[propsValue]];
              this.visible = false;
            } else {
              setTimeout(() => {
                this.singleSelectDom.classList.add("is-current")
              })
              // 不允许父级，阻止继续派发
              return false;
            }
          } else {
            // setTimeout(() => {
            //   this.singleSelectDom&&this.singleSelectDom.classList.remove("is-current")
            //   vm.$el.classList.add("is-current")
            //   this.singleSelectDom = vm.$el
            // })
            this.ids = [data[propsValue]];
            this.visible = false;
          }
        }
      }
      this._emitFun();
      /*
        点击节点，对外抛出   `data, node, vm`<br>
        `data:` 当前点击的节点数据<br>
        `node:` 当前点击的node<br>
        `vm:` 当前组件的vm
      */
      this.$emit("node-click", data, node, vm);
    },
    // 树勾选
    _treeCheckFun(data, node, vm) {
      this.ids = [];
      const { propsValue } = this;
      node.checkedNodes.forEach((item) => {
        this.ids.push(item[propsValue]);
      });
      /*
        点击复选框，对外抛出   `data, node, vm`<br>
        `data:` 当前点击的节点数据<br>
        `node:` 当前点击的node<br>
        `vm:` 当前组件的vm
      */
      this.$emit("check", data, node, vm);
      this._emitFun();
    },
    // 下拉框移除tag时触发
    _selectRemoveTag(tag) {
      const { propsValue, propsLabel } = this;
      let tagId = this.dataTrans.find(v => v[propsLabel] === tag)[propsValue]
      this.ids = this.removeIds(tagId, this.dataTrans, this.ids)
      this.$refs.tree.setCheckedKeys(this.ids);
      this.$emit("removeTag", this.ids, tag);
      this._emitFun();
    },
    // 下拉框清空数据
    _selectClearFun() {
      this.ids = [];
      const { multiple } = this.selectParams;
      // 下拉框清空，对外抛出``this.$emit('input', multiple ? [] : '');`
      this.$emit("input", multiple ? [] : "");
      // 下拉框清空，对外抛出``this.$emit('select-clear');`
      this.$emit("select-clear");
      this._updatePopoverLocationFun();
    },
    // 判断类型，抛出当前选中id
    _emitFun() {
      const { multiple } = this.selectParams;
      let ids = JSON.parse(JSON.stringify(this.ids))
      const allList = this.dataTrans.filter(v => ids.includes(v[this.propsValue]))
      const detailList = allList.map(item => {
        const { children, parent, ...rest } = item
        return rest
      })
      this.$emit('getAllDetail', detailList)
      if (this.onlyLeaf) {
        ids = this.filterNodesWithEmptyChildren(this.dataTrans, this.ids)
      }
      const filterList = this.dataTrans.filter(v => ids.includes(v[this.propsValue]))
      const list = filterList.map(v => {
        return {
          [this.propsValue]: v[this.propsValue],
          [this.propsLabel]: v[this.propsLabel]
        }
      })
      let returnVal = this.needValueName ? list : ids
      this.$emit(
          "input",
          multiple ? returnVal : returnVal.length > 0 ? returnVal[0] : ""
      )
      this.$emit('getValueDetail', list)
      this._updatePopoverLocationFun();
    },
    // 更新宽度
    _updateH() {
      this.$nextTick(() => {
        this.width = this.$refs.select.$el.getBoundingClientRect().width;
      });
    },
    // 显示弹出框的时候容错，查看是否和el宽度一致
    _popoverShowFun(val) {
      this._updateH();
    },
    // 判断是否隐藏弹出框
    _popoverHideFun(e) {
      const path = this._getEventPath(e);
      let isInside = path.some((list) => {
        // 鼠标在弹出框内部，阻止隐藏弹出框
        return (
            list.className &&
            typeof list.className === "string" &&
            list.className.indexOf("yf-tree-select") !== -1
        );
      });
      if (!isInside) {
        this.visible = false;
      }
    },
    /**
     * @vuese
     * 树列表更新数据
     * @arg Array
     */
    treeDataUpdateFun(data) {
      this.data = data;
      // 数据更新完成之后，判断是否回显内容
      if (data.length > 0) {
        setTimeout(() => {
          this._setSelectNodeFun(this.ids);
        }, 300);
      }
    },
    /**
     * @vuese
     * 本地过滤方法
     * @arg String
     */
    filterFun(val) {
      this.$refs.tree.filter(val);
    },
    transformTreeToObjects(tree) { // 将原数据转换为每个id带parent和children的对象
      const { propsValue, propsLabel, propsChildren } = this;
      const result = []
      const traverse = (node, parent) => {
        // 深度复制当前节点的 children
        const newNode = {
          ...node,
          parent: parent ? { [propsValue]: parent[propsValue], [propsLabel]: parent[propsLabel] } : null,
          [propsChildren]: node[propsChildren] ? node[propsChildren].map(child => deepCopyNode(child)) : []
        }

        result.push(newNode)

        if (node[propsChildren]) {
          for (const child of node[propsChildren]) {
            traverse(child, newNode)
          }
        }
      }

      const deepCopyNode = (node) => {
        return {
          ...node,
          [propsChildren]: node[propsChildren] ? node[propsChildren].map(deepCopyNode) : []
        }
      }

      for (const rootNode of tree) {
        traverse(rootNode, null)
      }

      return result
    },
    removeIds(tagId, nodes, idList) {
      const { propsValue, propsChildren } = this;

      // 创建一个映射来快速查找节点
      const idToNodeMap = {};
      nodes.forEach(item => {
        idToNodeMap[item[propsValue]] = item;
      });

      // 创建一个集合来存储需要删除的所有 ID
      const idsToRemove = new Set();

      const node = idToNodeMap[tagId];
      if (!node) return idList; // 如果节点不存在，直接返回原列表

      // 如果该节点有子节点，收集所有子节点的 ID
      if (node[propsChildren] && node[propsChildren].length > 0) {
        const collectChildIds = (node) => {
          idsToRemove.add(node[propsValue]);
          if (node[propsChildren]) {
            node[propsChildren].forEach(child => {
              collectChildIds(child);
            });
          }
        };
        collectChildIds(node);
      }

      // 如果该节点有父节点，收集父节点的 ID
      if (node.parent) {
        idsToRemove.add(node.parent[propsValue]);
        idsToRemove.add(tagId); // 也要移除自身
      } else {
        // 如果没有父节点（即是根节点），也要移除自身
        idsToRemove.add(tagId);
      }

      // 返回过滤后的已选择列表
      return idList.filter(id => !idsToRemove.has(id));
    },
    deepMerge(target, source) {
      for (const key in source) {
        // 使用 Object.prototype.hasOwnProperty.call() 而不是 source.hasOwnProperty(key)
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key] || typeof target[key] !== 'object') {
              target[key] = Array.isArray(source[key]) ? [] : {}
            }
            this.deepMerge(target[key], source[key])
          } else {
            target[key] = source[key]
          }
        }
      }
      return target
    },
    filterTreeArray(treeArray, keyword) {
      const { propsValue,propsLabel, propsChildren } = this;
      if (!keyword) {
        return treeArray
      }
      return treeArray.filter(item => {
        if (item[propsLabel].toLowerCase().includes(keyword.toLowerCase())) {
          return true
        }
        if (String(item[propsValue]).toLowerCase().includes(keyword.toLowerCase()+'')) {
          return true
        }

        if (item[propsChildren] && item[propsChildren].length > 0) {
          item[propsChildren] = this.filterTreeArray(
              item[propsChildren],
              keyword
          )
          return item[propsChildren].length > 0
        }

        return false
      })
    },
    extractAllIds(list) {
      const { propsValue, propsChildren } = this;
      const ids = [];

      const traverse = (item) => {
        ids.push(item[propsValue]);
        if (item[propsChildren]) {
          item[propsChildren].forEach(child => traverse(child));
        }
      }

      list.forEach(v => traverse(v));

      return ids;
    },
    filterDeptIds(nodes2, list) {
      // 遍历每个id得到只包含父级或者子级的id,用来查询下拉，获取labels
      const { propsValue, propsChildren } = this;
      if (typeof list === 'number') {
        list = String(list)
      }
      const idSet = new Set(list)
      // Helper function to find a node by its [this.propsValue]
      const findNodeById = (nodes, id) => {
        for (const node of nodes) {
          if (String(node[propsValue]) === id+'') {
            return node
          }
          const found = findNodeById(node[propsChildren], id)
          if (found) {
            return found
          }
        }
        return null
      }

      // Iterate over the list
      for (const id of list) {
        const node = findNodeById(nodes2, id)
        if (node && node[propsChildren]&&node[propsChildren].length > 0) {
          // If node has children, remove all children ids from the list
          for (const child of node[propsChildren]) {
            idSet.delete(child[propsValue])
          }
        }
      }

      return Array.from(idSet)
    },
    filterNodesWithEmptyChildren(nodeArray, ids) {
      // 使用 filter 方法筛选节点
      return nodeArray.filter(node => {
        // 检查节点的 deptId 是否在给定的 ids 数组中，并且 children 是否为空
        return ids.includes(node[this.propsValue]) && (!node[this.propsChildren] || !node[this.propsChildren].length)
      }).map(node => node[this.propsValue]) // 映射到 deptId 数组
    },
    isArrayObject(arr) {
      // 检查数组是否为对象数组
      return arr.every(item => typeof item === 'object' && !Array.isArray(item))
    },
    isObject(obj) {
      return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    },
    removeAriaHidden() {
      // 解决console包aria-hidden报错
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      const container = document.querySelector('body')
      const options = {
        attributes: true,
        childList: true,
        subtree: true
      }
      const mutation = new MutationObserver(function() {
        document.querySelectorAll('.yf-tree-select-popper[aria-hidden]').forEach(e=>{
          e.removeAttribute('aria-hidden')
        })
      })
      mutation.observe(container, options);
    }
  },
  components: {},
  beforeDestroy() {
    off(document, "mouseup", this._popoverHideFun);
  },
};
</script>
<style>
.yf-tree-select .select-option {
  display: none !important;
}
.is-empty .el-tree-node.is-current {
  position: relative;
}
.not-only-leaf .single-select .el-tree-node.is-current>.el-tree-node__content .el-tree-node__label{
  color: #409eff;
  font-weight: bold;
  position: relative;
  flex: 1;
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 20px;
    border-top: none;
    border-right: none;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #409eff;
    mask: url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;
    mask-size: 100% 100%;
    -webkit-mask: url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;
    -webkit-mask-size: 100% 100%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
  }
}
.only-leaf .single-select .el-tree-node.is-current>.el-tree-node__content .is-leaf + .el-tree-node__label{
  color: #409eff;
  font-weight: bold;
  position: relative;
  flex: 1;
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 20px;
    border-top: none;
    border-right: none;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #409eff;
    mask: url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;
    mask-size: 100% 100%;
    -webkit-mask: url("data:image/svg+xml;utf8,%3Csvg class='icon' width='200' height='200' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='currentColor' d='M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z'%3E%3C/path%3E%3C/svg%3E") no-repeat;
    -webkit-mask-size: 100% 100%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
  }
}
[aria-disabled="true"] > .el-tree-node__content {
  color: inherit !important;
  background: transparent !important;
  cursor: no-drop !important;
}
.yf-tree-select-popper {
  max-height: 400px;
  overflow: auto;
}
.yf-tree-select-popper.disabled {
  display: none !important;
}
.yf-tree-select-popper .el-button--small {
  width: 25px !important;
  min-width: 25px !important;
}
.yf-tree-select-popper[x-placement^="bottom"] {
  margin-top: 5px;
}
.mb10 {
  margin-bottom: 10px;
}
.no-data {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #cccccc;
  text-align: center;
}
.only-leaf .is-leaf+.el-checkbox .el-checkbox__inner {
  display: inline-block;
}
.only-leaf .el-checkbox .el-checkbox__inner {
  display: none;
}
</style>
