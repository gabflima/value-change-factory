function ValueChangeFactory(element, builder, args){
	if(element == null || builder == null) return;
		
	let store = Object.assign(Object.create(null), builder.buildValueChangeStore(element, args), {isTextSelected: false});
	
	let render = builder.getValueChangeRender(args, store);
	if(render == null) return;
	
	// [render] Create function and bind to render.
	// Will be called when the event "input" is triggered in element, 
	// after the element.onAfterInput.
	// Closure in created function: store.
	let onRenderAfterInput = builder.onRenderAfterInput(store).bind(render);
	
	// [element] Create function for processing input.
	// Will be called when the event "input" is triggered in element, 
	// before onRenderAfterInput.
	// Closure in created function: store.
	element.onAfterInput = builder.onAfterInput(store);
	
	// [element] Configure event listener on input for value change.
	// Closure: store and onRenderAfterInput.
	element.addEventListener("input", function(e){
		this.onAfterInput();
		store.isTextSelected = false;
		onRenderAfterInput();
	});
	
	// [element] Create function and add as event listener on keyboard press.
	// Closure in created function: store.
	element.onkeypress = builder.onKeyboardPress(store);
	
	// [Window] Configure event listener on selection.
	window.addEventListener("select", function(event){
		if(event.target.processSelection != null){
			event.target.processSelection((event.target.selectionEnd - event.target.selectionStart) > 0);
		}
	});
	
	// [element] Set processSelection to execute when is the selection's target.
	// Closure: store.
	element.processSelection = function(selected){
		store.isTextSelected = selected;
	};
	
	// Seal the store, 
	Object.seal(store);
};
