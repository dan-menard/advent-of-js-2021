
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function formatPrice(price) {
      return `$${(price / 100).toFixed(2)}`;
    }

    /* src/CartItem.svelte generated by Svelte v3.44.3 */
    const file$3 = "src/CartItem.svelte";

    function create_fragment$3(ctx) {
    	let li;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let img0_alt_value;
    	let t0;
    	let div0;
    	let t1_value = /*menuItem*/ ctx[0].count + "";
    	let t1;
    	let t2;
    	let div2;
    	let p0;
    	let t3_value = /*menuItem*/ ctx[0].name + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5_value = formatPrice(/*menuItem*/ ctx[0].price) + "";
    	let t5;
    	let t6;
    	let div4;
    	let button0;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let div3;
    	let t8_value = /*menuItem*/ ctx[0].count + "";
    	let t8;
    	let t9;
    	let button1;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let div5;
    	let t11_value = formatPrice(/*menuItem*/ ctx[0].price * /*menuItem*/ ctx[0].count) + "";
    	let t11;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			div4 = element("div");
    			button0 = element("button");
    			img1 = element("img");
    			t7 = space();
    			div3 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			button1 = element("button");
    			img2 = element("img");
    			t10 = space();
    			div5 = element("div");
    			t11 = text(t11_value);
    			if (!src_url_equal(img0.src, img0_src_value = "images/" + /*menuItem*/ ctx[0].image)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", img0_alt_value = /*menuItem*/ ctx[0].alt);
    			attr_dev(img0, "class", "plate");
    			add_location(img0, file$3, 8, 4, 131);
    			attr_dev(div0, "class", "quantity");
    			add_location(div0, file$3, 9, 4, 208);
    			attr_dev(div1, "class", "plate");
    			add_location(div1, file$3, 7, 2, 107);
    			attr_dev(p0, "class", "menu-item");
    			add_location(p0, file$3, 13, 4, 291);
    			attr_dev(p1, "class", "price");
    			add_location(p1, file$3, 14, 4, 336);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file$3, 12, 2, 265);
    			if (!src_url_equal(img1.src, img1_src_value = "images/chevron.svg")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$3, 19, 6, 467);
    			attr_dev(button0, "class", "decrease");
    			add_location(button0, file$3, 18, 4, 435);
    			attr_dev(div3, "class", "quantity");
    			add_location(div3, file$3, 22, 4, 519);
    			if (!src_url_equal(img2.src, img2_src_value = "images/chevron.svg")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$3, 25, 6, 601);
    			attr_dev(button1, "class", "increase");
    			add_location(button1, file$3, 24, 4, 569);
    			attr_dev(div4, "class", "quantity__wrapper");
    			add_location(div4, file$3, 17, 2, 399);
    			attr_dev(div5, "class", "subtotal");
    			add_location(div5, file$3, 29, 2, 660);
    			add_location(li, file$3, 6, 0, 100);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(li, t2);
    			append_dev(li, div2);
    			append_dev(div2, p0);
    			append_dev(p0, t3);
    			append_dev(div2, t4);
    			append_dev(div2, p1);
    			append_dev(p1, t5);
    			append_dev(li, t6);
    			append_dev(li, div4);
    			append_dev(div4, button0);
    			append_dev(button0, img1);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, t8);
    			append_dev(div4, t9);
    			append_dev(div4, button1);
    			append_dev(button1, img2);
    			append_dev(li, t10);
    			append_dev(li, div5);
    			append_dev(div5, t11);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menuItem*/ 1 && !src_url_equal(img0.src, img0_src_value = "images/" + /*menuItem*/ ctx[0].image)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*menuItem*/ 1 && img0_alt_value !== (img0_alt_value = /*menuItem*/ ctx[0].alt)) {
    				attr_dev(img0, "alt", img0_alt_value);
    			}

    			if (dirty & /*menuItem*/ 1 && t1_value !== (t1_value = /*menuItem*/ ctx[0].count + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*menuItem*/ 1 && t3_value !== (t3_value = /*menuItem*/ ctx[0].name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*menuItem*/ 1 && t5_value !== (t5_value = formatPrice(/*menuItem*/ ctx[0].price) + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*menuItem*/ 1 && t8_value !== (t8_value = /*menuItem*/ ctx[0].count + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*menuItem*/ 1 && t11_value !== (t11_value = formatPrice(/*menuItem*/ ctx[0].price * /*menuItem*/ ctx[0].count) + "")) set_data_dev(t11, t11_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CartItem', slots, []);
    	let { menuItem } = $$props;
    	const writable_props = ['menuItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CartItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('menuItem' in $$props) $$invalidate(0, menuItem = $$props.menuItem);
    	};

    	$$self.$capture_state = () => ({ menuItem, formatPrice });

    	$$self.$inject_state = $$props => {
    		if ('menuItem' in $$props) $$invalidate(0, menuItem = $$props.menuItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuItem];
    }

    class CartItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { menuItem: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CartItem",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*menuItem*/ ctx[0] === undefined && !('menuItem' in props)) {
    			console.warn("<CartItem> was created without expected prop 'menuItem'");
    		}
    	}

    	get menuItem() {
    		throw new Error("<CartItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuItem(value) {
    		throw new Error("<CartItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CartSummary.svelte generated by Svelte v3.44.3 */
    const file$2 = "src/CartSummary.svelte";

    function create_fragment$2(ctx) {
    	let div9;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2_value = formatPrice(/*subtotal*/ ctx[0]) + "";
    	let t2;
    	let t3;
    	let div5;
    	let div3;
    	let t5;
    	let div4;
    	let t6_value = formatPrice(/*subtotal*/ ctx[0] * taxRate) + "";
    	let t6;
    	let t7;
    	let div8;
    	let div6;
    	let t9;
    	let div7;
    	let t10_value = formatPrice(/*subtotal*/ ctx[0] + /*subtotal*/ ctx[0] * taxRate) + "";
    	let t10;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Subtotal:";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Tax:";
    			t5 = space();
    			div4 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div6.textContent = "Total:";
    			t9 = space();
    			div7 = element("div");
    			t10 = text(t10_value);
    			attr_dev(div0, "class", "label");
    			add_location(div0, file$2, 10, 4, 178);
    			attr_dev(div1, "class", "amount price subtotal");
    			add_location(div1, file$2, 11, 4, 217);
    			attr_dev(div2, "class", "line-item");
    			add_location(div2, file$2, 9, 2, 150);
    			attr_dev(div3, "class", "label");
    			add_location(div3, file$2, 14, 4, 321);
    			attr_dev(div4, "class", "amount price tax");
    			add_location(div4, file$2, 15, 4, 355);
    			attr_dev(div5, "class", "line-item");
    			add_location(div5, file$2, 13, 2, 293);
    			attr_dev(div6, "class", "label");
    			add_location(div6, file$2, 18, 4, 470);
    			attr_dev(div7, "class", "amount price total");
    			add_location(div7, file$2, 19, 4, 506);
    			attr_dev(div8, "class", "line-item total");
    			add_location(div8, file$2, 17, 2, 436);
    			attr_dev(div9, "class", "totals");
    			add_location(div9, file$2, 8, 0, 127);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div9, t3);
    			append_dev(div9, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, t6);
    			append_dev(div9, t7);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t9);
    			append_dev(div8, div7);
    			append_dev(div7, t10);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*subtotal*/ 1 && t2_value !== (t2_value = formatPrice(/*subtotal*/ ctx[0]) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*subtotal*/ 1 && t6_value !== (t6_value = formatPrice(/*subtotal*/ ctx[0] * taxRate) + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*subtotal*/ 1 && t10_value !== (t10_value = formatPrice(/*subtotal*/ ctx[0] + /*subtotal*/ ctx[0] * taxRate) + "")) set_data_dev(t10, t10_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const taxRate = 0.0975;

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CartSummary', slots, []);
    	let { subtotal } = $$props;
    	const writable_props = ['subtotal'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CartSummary> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('subtotal' in $$props) $$invalidate(0, subtotal = $$props.subtotal);
    	};

    	$$self.$capture_state = () => ({ subtotal, formatPrice, taxRate });

    	$$self.$inject_state = $$props => {
    		if ('subtotal' in $$props) $$invalidate(0, subtotal = $$props.subtotal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [subtotal];
    }

    class CartSummary extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { subtotal: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CartSummary",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*subtotal*/ ctx[0] === undefined && !('subtotal' in props)) {
    			console.warn("<CartSummary> was created without expected prop 'subtotal'");
    		}
    	}

    	get subtotal() {
    		throw new Error("<CartSummary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtotal(value) {
    		throw new Error("<CartSummary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MenuItem.svelte generated by Svelte v3.44.3 */
    const file$1 = "src/MenuItem.svelte";

    // (18:4) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = text("\n        In Cart");
    			if (!src_url_equal(img.src, img_src_value = "images/check.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Check");
    			add_location(img, file$1, 19, 8, 463);
    			attr_dev(button, "class", "in-cart");
    			add_location(button, file$1, 18, 6, 430);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(18:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if !menuItem.count}
    function create_if_block$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Add to Cart";
    			attr_dev(button, "class", "add");
    			add_location(button, file$1, 16, 6, 371);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(16:4) {#if !menuItem.count}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let li;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let p0;
    	let t1_value = /*menuItem*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3_value = formatPrice(/*menuItem*/ ctx[0].price) + "";
    	let t3;
    	let t4;

    	function select_block_type(ctx, dirty) {
    		if (!/*menuItem*/ ctx[0].count) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			if_block.c();
    			if (!src_url_equal(img.src, img_src_value = "images/" + /*menuItem*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*menuItem*/ ctx[0].alt);
    			attr_dev(img, "class", "plate");
    			add_location(img, file$1, 8, 4, 131);
    			attr_dev(div0, "class", "plate");
    			add_location(div0, file$1, 7, 2, 107);
    			attr_dev(p0, "class", "menu-item");
    			add_location(p0, file$1, 12, 4, 242);
    			attr_dev(p1, "class", "price");
    			add_location(p1, file$1, 13, 4, 287);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$1, 11, 2, 216);
    			add_location(li, file$1, 6, 0, 100);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div0);
    			append_dev(div0, img);
    			append_dev(li, t0);
    			append_dev(li, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(p1, t3);
    			append_dev(div1, t4);
    			if_block.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menuItem*/ 1 && !src_url_equal(img.src, img_src_value = "images/" + /*menuItem*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*menuItem*/ 1 && img_alt_value !== (img_alt_value = /*menuItem*/ ctx[0].alt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*menuItem*/ 1 && t1_value !== (t1_value = /*menuItem*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*menuItem*/ 1 && t3_value !== (t3_value = formatPrice(/*menuItem*/ ctx[0].price) + "")) set_data_dev(t3, t3_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuItem', slots, []);
    	let { menuItem } = $$props;
    	const writable_props = ['menuItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('menuItem' in $$props) $$invalidate(0, menuItem = $$props.menuItem);
    	};

    	$$self.$capture_state = () => ({ menuItem, formatPrice });

    	$$self.$inject_state = $$props => {
    		if ('menuItem' in $$props) $$invalidate(0, menuItem = $$props.menuItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuItem];
    }

    class MenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { menuItem: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuItem",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*menuItem*/ ctx[0] === undefined && !('menuItem' in props)) {
    			console.warn("<MenuItem> was created without expected prop 'menuItem'");
    		}
    	}

    	get menuItem() {
    		throw new Error("<MenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuItem(value) {
    		throw new Error("<MenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.3 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (22:8) {#each menuItems as menuItem}
    function create_each_block_1(ctx) {
    	let menuitem;
    	let current;

    	menuitem = new MenuItem({
    			props: { menuItem: /*menuItem*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menuitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menuitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menuitem_changes = {};
    			if (dirty & /*menuItems*/ 1) menuitem_changes.menuItem = /*menuItem*/ ctx[2];
    			menuitem.$set(menuitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(22:8) {#each menuItems as menuItem}",
    		ctx
    	});

    	return block;
    }

    // (33:6) {:else}
    function create_else_block(ctx) {
    	let ul;
    	let t;
    	let cartsummary;
    	let current;
    	let each_value = /*menuItems*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	cartsummary = new CartSummary({
    			props: { subtotal: /*calculateSubtotal*/ ctx[1]() },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(cartsummary.$$.fragment);
    			attr_dev(ul, "class", "cart-summary");
    			add_location(ul, file, 33, 8, 800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(cartsummary, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menuItems*/ 1) {
    				each_value = /*menuItems*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(cartsummary.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(cartsummary.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(cartsummary, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(33:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:6) {#if !menuItems.reduce((total, item) => total + item.count, 0)}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Your cart is empty.";
    			attr_dev(p, "class", "empty");
    			add_location(p, file, 31, 8, 737);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(31:6) {#if !menuItems.reduce((total, item) => total + item.count, 0)}",
    		ctx
    	});

    	return block;
    }

    // (36:12) {#if menuItem.count}
    function create_if_block_1(ctx) {
    	let cartitem;
    	let current;

    	cartitem = new CartItem({
    			props: { menuItem: /*menuItem*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cartitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cartitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cartitem_changes = {};
    			if (dirty & /*menuItems*/ 1) cartitem_changes.menuItem = /*menuItem*/ ctx[2];
    			cartitem.$set(cartitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cartitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cartitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cartitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(36:12) {#if menuItem.count}",
    		ctx
    	});

    	return block;
    }

    // (35:10) {#each menuItems as menuItem}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*menuItem*/ ctx[2].count && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*menuItem*/ ctx[2].count) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*menuItems*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:10) {#each menuItems as menuItem}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let h10;
    	let t1;
    	let ul;
    	let t2;
    	let div1;
    	let h11;
    	let t4;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let each_value_1 = /*menuItems*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*menuItems*/ 1) show_if = !!!/*menuItems*/ ctx[0].reduce(func, 0);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "To Go Menu";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Your Cart";
    			t4 = space();
    			if_block.c();
    			add_location(h10, file, 18, 6, 438);
    			attr_dev(ul, "class", "menu");
    			add_location(ul, file, 20, 6, 465);
    			attr_dev(div0, "class", "panel");
    			add_location(div0, file, 17, 4, 412);
    			add_location(h11, file, 28, 6, 639);
    			attr_dev(div1, "class", "panel cart");
    			add_location(div1, file, 27, 4, 608);
    			attr_dev(div2, "class", "wrapper menu");
    			add_location(div2, file, 16, 2, 381);
    			add_location(main, file, 15, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t1);
    			append_dev(div0, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, h11);
    			append_dev(div1, t4);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menuItems*/ 1) {
    				each_value_1 = /*menuItems*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = (total, item) => total + item.count;

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { menuItems } = $$props;

    	function calculateSubtotal() {
    		return menuItems.reduce(
    			(total, item) => {
    				const itemTotal = item.price * item.count;
    				return total + itemTotal;
    			},
    			0
    		);
    	}

    	const writable_props = ['menuItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('menuItems' in $$props) $$invalidate(0, menuItems = $$props.menuItems);
    	};

    	$$self.$capture_state = () => ({
    		menuItems,
    		CartItem,
    		CartSummary,
    		MenuItem,
    		calculateSubtotal
    	});

    	$$self.$inject_state = $$props => {
    		if ('menuItems' in $$props) $$invalidate(0, menuItems = $$props.menuItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuItems, calculateSubtotal];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { menuItems: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*menuItems*/ ctx[0] === undefined && !('menuItems' in props)) {
    			console.warn("<App> was created without expected prop 'menuItems'");
    		}
    	}

    	get menuItems() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuItems(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const menuItems = [
      {
        name: 'French Fries with Ketchup',
        price: 223,
        image: 'plate__french-fries.png',
        alt: 'French Fries',
        count: 0
      },
      {
        name: 'Salmon and Vegetables',
        price: 512,
        image: 'plate__salmon-vegetables.png',
        alt: 'Salmon and Vegetables',
        count: 0
      },
      {
        name: 'Spaghetti Meat Sauce',
        price: 782,
        image: 'plate__spaghetti-meat-sauce.png',
        alt: 'Spaghetti with Meat Sauce',
        count: 0
      },
      {
        name: 'Bacon, Eggs, and Toast',
        price: 599,
        image: 'plate__bacon-eggs.png',
        alt: 'Bacon, Eggs, and Toast',
        count: 0
      },
      {
        name: 'Chicken Salad with Parmesan',
        price: 698,
        image: 'plate__chicken-salad.png',
        alt: 'Chicken Salad with Parmesan',
        count: 0
      },
      {
        name: 'Fish Sticks and Fries',
        price: 634,
        image: 'plate__fish-sticks-fries.png',
        alt: 'Fish Sticks and Fries',
        count: 0
      }
    ];

    const app = new App({
      target: document.body,
      props: { menuItems }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
