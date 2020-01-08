const getFirstLetterUppercase = str => str.replace(/^./, str[0].toUpperCase())

module.exports = component => {
  const componentInfos = {}

  // id
  componentInfos.id = component.id

  // tag
  componentInfos.tag = component.tag || 'div'

  // classes
  componentInfos.classes = [`${getFirstLetterUppercase(component.id)}--component`, 'component', ...component.classes]
  componentInfos.classes = Array.from(new Set(componentInfos.classes))
  componentInfos.classesString = componentInfos.classes.join(' ')

  // style vars
  componentInfos.styleVars = component.styleVars
  componentInfos.styleVarsString = Object.entries(componentInfos.styleVars)
    .map(([key, value]) => `--${key}:${value};`)
    .join('')
  componentInfos.styleVarsString = `style="${componentInfos.styleVarsString}"`

  // attributes
  componentInfos.attributes = component.attributes
  componentInfos.attributesString = Object.entries(componentInfos.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  // dataset
  componentInfos.dataset = Object.assign({}, component.dataset, {
    component: component.id,
    uid: '_' + Math.random().toString(36).substr(2, 9)
  })
  componentInfos.datasetString = Object.entries(componentInfos.dataset)
    .map(([key, value]) => `data-${key}="${value}"`)
    .join(' ')

  return componentInfos
}
