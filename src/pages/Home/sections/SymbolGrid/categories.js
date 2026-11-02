export const categories=[['ALL','전체'],['L','L'],['E','E'],['T','T'],['S1','S₁'],['S2','S₂'],['Y','Y'],['N','N'],['C','C'],['EXCLAMATION','!'],['APOSTROPHE','’']];
// Figma의 느낌표 중 일부는 apost 또는 S1 변형 이름으로 저장되어 있다.
const exclamationIds=new Set([
  '1215:3660','1215:3665','1215:3670','1215:3675','1215:3680','1215:3684','1215:3688',
  '1215:4017','1215:4023','1215:4028','1215:4061','1215:4045','1215:4050','1215:4056',
  '1215:3894','1215:3899','1215:3904','1215:3909','1215:3917','1215:3921','1215:3927',
  '1215:3812','1215:3817','1215:3822','1215:3827','1215:3832','1215:3837','1215:3850'
]);
export function categoryOf(item){
  if(exclamationIds.has(item.id))return 'EXCLAMATION';
  if(item.name==='apost')return 'APOSTROPHE';
  const [prefix,suffix]=item.name.split('_');
  return suffix==='default'?prefix:suffix;
}
