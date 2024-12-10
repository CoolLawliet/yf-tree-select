# yf-tree-select（树形下拉选择）

基于element-ui，el-tree-select的二次封装。

## 使用说明
### 安装
```
    npm install yf-tree-select -S
```
### 全局引入
```
    // main.js
    import YfTreeSelect from 'yf-tree-select'
    Vue.use(YfTreeSelect)
```
### 组件内引入
```
    import {YfTreeSelect} from 'yf-tree-select'
    components:{
        YfTreeSelect
    }
```
[预览地址](https://coollawliet.github.io/yf-tree-select/dist/)
## Attribute

| 参数             | 说明                                          | 类型                         | 默认值    |
|:---------------|:--------------------------------------------|:---------------------------|:-------|
| v-model        | 绑定值                                         | string/number/array/object |        |
| selectAttrs    | select的属性                                   | object                     | 见下表    |
| treeAttrs      | tree的属性                                     | object                     | 见下表    |
| customerFilter | 是否自定义过滤(默认标签名过滤)，true配合_treeDataUpdateFun使用 | boolean                    | false  |
| foldLabels     | 是否折叠labels                                  | boolean                    | false  |
| onlyLeaf       | 只能选择叶子节点                                    | boolean                    | false  |
| needValueName  | 绑定值是否需要返回id和标签名(object)                     | boolean                    | false  |
| placement      | 弹出框出现位置(el-popover参数)                       | string                     | bottom |

### selectAttrs
| 参数          | 说明    | 类型      | 默认值   |
|:------------|:------|:--------|:------|
| placeholder | 占位符   | string  | 请选择   |
| disabled    | 是否禁用  | boolean | false |
| clearable   | 是否可清空 | boolean | true  |

其他与element-ui一致，可覆盖。 详情[el-select](https://element.eleme.io/#/zh-CN/component/select)


#### 特殊说明
```
    :popper-append-to-body="false" // 固定false
    :filterable="false" // 固定false 改为弹出中搜索
    multiple // 根据v-model类型判断是否多选 string、number、object单选, array多选
    传入selectAttrs不会影响默认值，除非覆盖
    
```
### treeAttrs
| 参数                   | 说明                                                 | 类型      | 默认值   |
|:---------------------|:---------------------------------------------------|:--------|:------|
| filterable           | 是否展示搜索块                                            | boolean | false |
| leafOnly             | v-model是否只是叶子节点                                    | boolean | false |
| includeHalfChecked   | v-model是否包含半选节点                                    | boolean | false |
| data                 | 展示数据	                                              | array   |       |
| props                | 配置选项	                                              | object  | 见下表   |

#### props
    
| 参数       | 说明                       | 类型     | 默认值      |
|:---------|:-------------------------|:-------|:---------|
| label    | 指定节点标签为节点对象的某个属性值        | string | name     |
| children | 指定子树为节点对象的某个属性值          | string | children |
| value    | 指定节点id为节点对象的某个属性值        | string | value    |
| code     | 如果有code，则标签显示为name(code) | string |          |

其他与element-ui一致，可覆盖。 详情[el-tree](https://element.eleme.io/#/zh-CN/component/tree)

#### 特殊说明
```
    :show-checkbox="selectAttrs.multiple"  // 使用v-model值类型判断是否对树进行多项，取消对el-tree的人为传参show-checkbox
    :node-key="propsValue"  自动获取treeAttrs.props.value
    :draggable="false"      屏蔽拖动
    传入treeAttrs不会影响默认值，除非覆盖
```
## 方法
this.$refs.xxx.method

| 方法名                       | 说明      | 参数           |
|:--------------------------|:--------|:-------------|
| _updatePopoverLocationFun | 更新弹出框位置 |              |
| _updateH                  | 更新弹出框宽度 |              |
| _treeDataUpdateFun        | 更新树data | (data)接收一个数组 |

#### 注意事项
```
    如果数据改变但是树没更新，使用this.$refs.xxx._treeDataUpdateFun手动更新
```

## Events
| 时间名称             | 说明        | 回调参数                                                            |
|:-----------------|:----------|:----------------------------------------------------------------|
| search-fun       | 文本框输入内容触发 | 输入框的值                                                           |
| remove-tag       | 删除标签触发    | 第一个参数是删除的id，第二个参数是删除的标签名(如果标签名有重复的可能会错，标签唯一才能获取到正确id，可配合code使用) |
| select-clear     | 清空输入框触发   |                                                                 |
| value-detail     | 选中改变触发    | v-model的标签和标签id的数组对象                                            |
| all-detail       | 选中改变触发    | v-model的所有属性的数组对象                                               |
| label-ids-detail | 标签改变触发    | 展示标签的数组对象                                                       |
