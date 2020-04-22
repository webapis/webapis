export default function getNavigationFilter({
  metaData,
  navigation,
  objectName
}) {
  try {
    const object = metaData.find(m => m.objectName === objectName);
    if (object && object.navFilters !== undefined) {
      return object.navFilters.find(f => f.nav === navigation).filter;
    }
    return undefined;
  } catch (error) {
    throw new Error(error);
  }
}
