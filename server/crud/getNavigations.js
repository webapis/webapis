import visaMetaData from './visaMetaData/mockMetaData';
import stockMetaData from './stockMetaData/stockMetaData';
export default  function getNavigations({ appName }) {

  let metaData = appName === 'visa' ? visaMetaData : stockMetaData;

  let navigations = metaData
    .filter(d => !d.navigations)
    .map(s => ({ navigation: s.objectName, objectName: s.objectName }));

  metaData
    .filter(d => d.navigations)
    .map(function(m) {
      m.navigations.map(function(navigation) {
        navigations.push({
          navigation,
          objectName: m.objectName
        });
      });
    });

  return  navigations;
}
