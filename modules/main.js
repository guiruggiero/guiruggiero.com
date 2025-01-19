import*as UI from"./ui.js";import*as Validation from"./validation.js";import*as Firebase from"./firebase.js";import{callGuiPT}from"./guipt.js";let chatStart,chatID,guiptResponse,turnHistory,turnCount=0,messageCount=0,chatHistory=[];class TimeoutError extends Error{constructor(t){super(t),this.name="TimeoutError"}}const timeWindow=6e4;let requestCount=0,windowStart=Date.now();async function handleGuiPT(){0==turnCount&&(chatStart=new Date(Date.now())),UI.forbidSubmitButton(),UI.closeKeyboard(),UI.toggleInput();const t=UI.elements.input.value;2==messageCount&&UI.elements.disclaimer.remove(),messageCount++;const e=Validation.sanitizeInput(t),o=Validation.validateInput(e);if("OK"!==o.assessment)return"Too long"==o.assessment&&UI.clearInput(),"Empty"!==o.assessment&&(UI.chatWindowExpanded||UI.expandChatWindow(),UI.addMessage("error",o.errorMessage)),UI.toggleSubmitButton(),UI.toggleInput(),void UI.inputFocus();const n=Date.now();if(n-windowStart>6e4&&(requestCount=0,windowStart=n),requestCount>=5){const t=6e4-(n-windowStart);return UI.addMessage("error","⚠️ Whoa! Too many messages, too fast. Wait a bit to try again."),void setTimeout((()=>{UI.toggleSubmitButton(),UI.toggleInput(),UI.inputFocus()}),t)}requestCount++,UI.chatWindowExpanded||UI.expandChatWindow(),UI.clearInput(),UI.addMessage("user",e);const a=UI.showLoader();try{const t=new Promise(((t,e)=>{setTimeout((()=>e(new TimeoutError("Client timeout"))),17e3)}));guiptResponse=await Promise.race([callGuiPT(chatHistory,e),t])}catch(e){return a.remove(),"Client timeout"==e.message||e instanceof TimeoutError?(UI.addMessage("error","⚠️ ZzZzZ... This is taking too long, can you please try again?"),console.error(e)):UI.addMessage("error","⚠️ Oops! Something went wrong, can you please try again?"),UI.populateInput(t),UI.toggleSubmitButton(),UI.toggleInput(),void UI.inputFocus()}UI.addMessage("bot",guiptResponse.data,a),turnCount++,chatHistory.push({role:"user",parts:[{text:e}]},{role:"model",parts:[{text:guiptResponse.data}]});const s={user:e,model:guiptResponse.data};if(1==turnCount)turnHistory={[turnCount]:s},chatID=await Firebase.createLog(chatStart,turnHistory);else{turnHistory={...turnHistory,[turnCount]:s};let t=(new Date(Date.now())-chatStart)/6e4;t=Number(t.toFixed(2)),await Firebase.logTurn(chatID,turnCount,t,turnHistory)}UI.changePlaceholder(" Reply to GuiPT"),UI.toggleInput(),UI.inputFocus()}function debounce(t,e){let o;return function(...n){clearTimeout(o),o=setTimeout((()=>t.apply(this,n)),e)}}document.addEventListener("DOMContentLoaded",(()=>{UI.inputPlaceholderAndFocus(),UI.elements.input.addEventListener("input",debounce(UI.toggleSubmitButton,150)),UI.elements.submit.addEventListener("pointerup",handleGuiPT),UI.elements.input.addEventListener("keyup",debounce((t=>{"Enter"===t.key&&handleGuiPT()}),150))}));