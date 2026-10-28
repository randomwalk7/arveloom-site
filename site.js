import {renderMarkdown} from './markdown.js';
import {siteTopics,validatePublicArticles,visibleArticles,articleIdFromHash} from './article-model.js';
const english=['CIVILIZATION','FINANCE','REAL ESTATE','RUNNING','TRAINING','BOOKS','TECHNOLOGY'];
const search=document.querySelector('#search'),dialog=document.querySelector('#article'),results=document.querySelector('#results');
let selected='전체',articles=[],loadError='',loaded=false;
function element(tag,text,className){const node=document.createElement(tag);if(text !== undefined)node.textContent=text;if(className)node.className=className;return node;}

function appendInline(parent,text){
 const pattern=/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
 let last=0;
 for(const match of text.matchAll(pattern)){
  parent.append(document.createTextNode(text.slice(last,match.index)));
  if(match[1]){const link=element('a',match[1]);link.href=match[2];link.target='_blank';link.rel='noopener noreferrer';parent.append(link);}
  else parent.append(element('strong',match[3]));
  last=match.index+match[0].length;
 }
 parent.append(document.createTextNode(text.slice(last)));
}
function appendArticleBlock(parent,block){
 const heading=block.match(/^#{2,6} (.+)\n?([\s\S]*)$/);
 const image=block.match(/^!\[([^\]]*)\]\((assets\/[a-z0-9-]+\.png)\)$/);
 if(heading){parent.append(element('h2',heading[1]));if(heading[2].trim())appendArticleBlock(parent,heading[2]);}
 else if(image){const figure=element('figure'),img=element('img');img.src=image[2];img.alt=image[1];img.loading='lazy';figure.append(img);parent.append(figure);}
 else if(/^-{3,}$/.test(block.trim()))parent.append(element('hr'));
 else{const p=element('p');appendInline(p,block);parent.append(p);}
}

function choose(topic){selected=topic;render();document.querySelector('#articles').scrollIntoView({behavior:'smooth'});}
siteTopics.forEach((topic,i)=>{const button=element('button',undefined,'topic');button.append(element('span',`${String(i+1).padStart(2,'0')} / ${english[i]}`),element('strong',`${topic} ↗`));button.onclick=()=>choose(topic);document.querySelector('#topic-grid').append(button);});
function openArticle(id){history.pushState({arveloomArticle:true},'',`#article/${encodeURIComponent(id)}`);renderRoute();}
function render(){
 const filters=document.querySelector('#filters');filters.replaceChildren();['전체',...siteTopics].forEach(topic=>{const button=element('button',topic);button.setAttribute('aria-pressed',String(selected===topic));button.onclick=()=>{selected=topic;render();};filters.append(button);});
 document.querySelector('#published-count').textContent=String(articles.filter(x=>x.status==='published').length);
 results.replaceChildren();
 if(!loaded || loadError){const status=element('p',loadError || '글 목록을 불러오는 중입니다.','site-message');if(loadError){status.setAttribute('role','alert');const retry=element('button','다시 불러오기');retry.onclick=()=>void loadArticles();status.append(document.createElement('br'),retry);}results.append(status);}else{
  const found=visibleArticles(articles,selected,search.value);
  found.forEach((row,index)=>{const card=element('article',undefined,'card');const button=element('button','글 읽기 ↗');button.onclick=()=>openArticle(row.id);card.append(element('div',`${String(index+1).padStart(2,'0')}.`,'number'),element('span',`${row.category} · ${row.kind}`,'tag'),element('h3',row.title),element('p',row.summary),button);results.append(card);});
  if(!found.length)results.append(element('p',articles.some(x=>x.status==='published') ? '조건에 맞는 글이 없습니다. 다른 분야나 검색어를 선택해 주세요.' : '아직 공개한 글이 없습니다. 첫 원고를 준비하고 있습니다.','site-message'));
 }
 const draftList=document.querySelector('#draft-list');draftList.replaceChildren();
 articles.filter(x=>x.status==='draft').forEach(row=>{const card=element('div',undefined,'draft-row'),description=element('div'),button=element('button','준비 상태 보기 ↗');description.append(element('h4',row.title),element('small',`${row.kind} · 임시 제목 · 원고 준비 중`));button.onclick=()=>openArticle(row.id);card.append(description,button);draftList.append(card);});
 document.querySelector('.drafts').hidden=!articles.some(x=>x.status==='draft');
}
function renderRoute(){
 const id=articleIdFromHash(location.hash);
 if(!id){if(dialog.open)dialog.close();return;}
 if(!loaded)return;
 const row=articles.find(x=>x.id===id),body=document.querySelector('#article-body');body.replaceChildren();
 if(!row){body.append(element('h1','글을 찾을 수 없습니다.'),element('p','목록으로 돌아가 다른 글을 선택해 주세요.'));}
 else{
  body.append(element('p',`${row.category} / ${row.kind}`,'eyebrow'),element('h1',row.title));
  if(row.status==='draft')body.append(element('p','임시 제목 · 미발행','muted'),element('p','본문과 출처를 준비하고 있습니다. 현재는 제목과 준비 상태만 안내합니다.','placeholder'));
  else{body.append(element('p',`공개 ${row.publishedAt}`,'muted')); if(row.markdown)renderMarkdown(body,row.markdown);else if(row.blocks)row.blocks.forEach(block=>appendArticleBlock(body,block));else row.sections.forEach(section=>body.append(element('h2',section.heading),element('p',section.text)));if(row.sources.length){body.append(element('h2','참고 자료'));const list=element('ul');row.sources.forEach(source=>{const item=element('li'),link=element('a',source.title);link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';item.append(link);list.append(item);});body.append(list);}}
  const contact=element('a','이 글에 관한 문의·의견 보내기 ↗');contact.href=`mailto:contact@arveloom.com?subject=${encodeURIComponent(`ONICS 의견: ${row.title}`)}`;body.append(document.createElement('hr'),contact);
 }
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
}
function closeArticle(){if(history.state?.arveloomArticle)history.back();else{history.replaceState(null,'','#articles');dialog.close();}}
async function loadArticles(){loaded=false;loadError='';render();try{const response=await fetch('./articles.json',{cache:'no-cache'});if(!response.ok)throw new Error();articles=validatePublicArticles(await response.json());loaded=true;render();renderRoute();}catch{loaded=true;loadError='글 목록을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';render();}}
document.querySelector('#close').onclick=closeArticle;dialog.addEventListener('cancel',event=>{event.preventDefault();closeArticle();});search.addEventListener('input',render);window.addEventListener('hashchange',renderRoute);window.addEventListener('popstate',renderRoute);void loadArticles();
