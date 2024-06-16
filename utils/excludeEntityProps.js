export const excludeEntityprops = (entity, props = ["_id", "__v"]) => {
    const excludedObject = Object.entries(entity).filter(( [ key ] )=> !props.includes(key));        
    return Object.fromEntries(excludedObject);
}