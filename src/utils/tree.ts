/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} idField id字段 默认 'id'
 * @param {*} parentIdField 父节点字段 默认 'parentId'
 * @param {*} childrenField 孩子节点字段 默认 'children'
 */
export const buildTree = (
  data: any[],
  idField: string = 'id',
  parentIdField: string = 'parentId',
  childrenField: string = 'children'
) => {
  const childrenListMap: any = {}
  const nodeIds: any = {}
  const tree: any[] = []

  for (let d of data) {
    const parentId = d[parentIdField]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[idField]] = d
    childrenListMap[parentId].push(d)
  }

  for (let d of data) {
    let parentId = d[parentIdField]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[idField]] !== null) {
      o[childrenField] = childrenListMap[o[idField]]
    }
    if (o[childrenField]) {
      for (let c of o[childrenField]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}
