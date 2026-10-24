export const siteTopics=['문명사','금융','부동산','달리기','웨이트트레이닝','독서','AI'];
export function validatePublicArticles(data) {
 if(data?.version !== 1 || !Array.isArray(data.articles)) throw new Error('글 목록 형식을 확인해 주세요.');
 const ids=new Set();
 for(const row of data.articles){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.id || '') || ids.has(row.id)) throw new Error('글 주소가 비어 있거나 중복됩니다.');ids.add(row.id);
  if(!row.title?.trim() || !['draft','published'].includes(row.status) || !siteTopics.includes(row.category) || !['글','연구 노트','해설'].includes(row.kind) || typeof row.summary !== 'string' || !Array.isArray(row.sections) || !Array.isArray(row.sources)) throw new Error('글의 필수 항목을 확인해 주세요.');
  if(row.sections.some(x=>typeof x.heading !== 'string' || typeof x.text !== 'string')) throw new Error('본문 형식을 확인해 주세요.');
  for(const source of row.sources){let url;try{url=new URL(source.url);}catch{throw new Error('출처 주소를 확인해 주세요.');}if(!['https:','http:'].includes(url.protocol) || !source.title?.trim()) throw new Error('출처 주소를 확인해 주세요.');}
  if(row.status==='published' && (!row.summary.trim() || !row.sections.some(x=>x.text.trim()) || !/^\d{4}-\d{2}-\d{2}$/.test(row.publishedAt || '') || Number.isNaN(Date.parse(row.publishedAt)) || new Date(`${row.publishedAt}T12:00:00Z`).toISOString().slice(0,10)!==row.publishedAt)) throw new Error('공개 글에는 요약·본문·올바른 공개일이 필요합니다.');
 }
 return structuredClone(data.articles);
}
export function visibleArticles(articles,category='전체',query='') {
 const term=query.trim().toLocaleLowerCase();
 return articles.filter(x=>x.status==='published' && (category==='전체'||x.category===category) && `${x.title} ${x.summary} ${x.category}`.toLocaleLowerCase().includes(term)).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
export function articleIdFromHash(hash){try{const id=decodeURIComponent(hash.replace(/^#article\//,''));return hash.startsWith('#article/') && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ? id : null;}catch{return null;}}
