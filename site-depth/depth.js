(() => {
 const tabs = [...document.querySelectorAll('[data-step]')];
 if (!tabs.length) return;
 const steps = [
  {message:'“I’d like to know more. Can someone contact me?”',context:'They respond to your campaign or complete the agreed enquiry form.',title:'New enquiry received',fields:[['Source','Campaign form'],['Owner','Your nominated team member'],['Next action','Contact the enquiry']],status:'Details captured. Your team notified.'},
  {message:'“Thanks for getting in touch. Here’s how to arrange a conversation.”',context:'An agreed acknowledgement makes the next step clear. Your team can see the message and continue the conversation.',title:'Follow-up in progress',fields:[['Message','Acknowledgement sent'],['Conversation','Saved with the contact'],['Next action','Respond or follow up as agreed']],status:'One shared history. A visible next action.'},
  {message:'“I’ve booked a time. Speak to you then.”',context:'They choose a time through the connected booking route. Your team has the details before the conversation.',title:'Ready for your team',fields:[['Stage','Introduction booked'],['Booking chase','Stopped'],['Next action','Prepare for the conversation']],status:'The agreed booking journey takes over.'}
 ];
 function select(index,focus=false) {
  const step=steps[index];
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  document.querySelector('#journey-panel').setAttribute('aria-labelledby',tabs[index].id);
  document.querySelector('#customer-message').textContent=step.message;
  document.querySelector('#customer-context').textContent=step.context;
  document.querySelector('#record-title').textContent=step.title;
  const fields=document.querySelector('#record-fields');fields.replaceChildren();
  step.fields.forEach(([term,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=term;dd.textContent=value;row.append(dt,dd);fields.append(row);});
  document.querySelector('#record-status').textContent=step.status;
  if(focus)tabs[index].focus();
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(next,true);}});});
})();
