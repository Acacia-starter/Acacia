module.exports = (component = {}, additionnals = {}) => {
  // componentId
  component.componentId = component.componentId || additionnals.componentId

  // id
  component.id = component.id || additionnals.id

  // tag
  component.tag = component.tag || additionnals.tag || 'div'

  // classes
  component.classes = (component.classes || []).concat(additionnals.classes)
  component.classes = Array.from(new Set(component.classes))

  // style vars
  component.styleVars = Object.assign({}, component.styleVars, additionnals.styleVars)

  // attributes
  component.attributes = Object.assign({}, component.attributes, additionnals.attributes)

  // dataset
  component.dataset = Object.assign({}, component.dataset, additionnals.dataset)

  return component
}
