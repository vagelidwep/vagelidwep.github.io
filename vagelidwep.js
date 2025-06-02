document.addEventListener('DOMContentLoaded', function() {

	const referrer = document.referrer;
	let refDomain = '';

	if (referrer) {
		try {
			const parsedReferrer = new URL(referrer);
			refDomain = parsedReferrer.hostname;
		} catch (e) {
			console.error("Error parsing referrer:", e);
		}
	} else {
		console.log("Referrer tidak tersedia");
	}

	const domain = location.hostname;

	let domainPattern = /(?:www\.)?(google\.com|ocefo\.com|buytostore\.com)$/;
	let effectiveDomain = (domainPattern.test(refDomain)) ? domain : (refDomain || domain);
	const subdomain = domain.split('.')[0];

	const urlParams = new URLSearchParams(window.location.search);	
	const idParam = urlParams.get('id');
	let id = idParam || window.location.search.slice(1); 
	let lang = 'ko';

	// console.log('Initial id:', id);
	console.log('effectiveDomain:', effectiveDomain);

	if (idParam) {
		id = idParam;
	}

	if (id && id.endsWith('=')) {
		id = id.slice(0, -1);
	}

	if (id && id.endsWith('.html')) {
		id = id.slice(0, -5);
	}

	if (id && id.endsWith('.txt')) {
		id = id.slice(0, -4);
	}


	const originalLangMap = {
		'ko': ['wf0', 'db1', 'xQ2', 'yLp', 'qJk', 'vBn', 'rTm', 'sYn', 'kUi', 'mWs', 'gHd', 'oVc', 'zNk', 'pLs', 'eFg', 'jMx', 'bJw', 'nAp', 'lQt', 'uXy'],
		'fr': ['aBc', 'pQr', 'zXy', 'cDf', 'uV1', 'jKl', 'gHv', 'BWx', 'rSt', 'bCd', 'qWs', 'xZn', 'dFe', 'lMk', 'yUi', 'kLo', 'eGh', 'nAj', 'tUp', 'jOz'],
		'es': ['sDf', 'wEr', 'vGh', 'rTy', 'bNq', 'mLa', 'oPz', 'xVu', 'nMk', 'iLo', 'yRe', 'pWq', 'fUb', 'hGt', 'zWx', 'cDk', 'jFq', 'gHz', '1Up', 'qWe'],
		'pt': ['jQx', 'bRf', 'vTb', 'pCs', 'qFk', 'rHu', 'tEr', 'gDs', 'hZl', 'aWp', 'cYj', 'eNf', 'lVt', 'xZm', 'sQw', 'dKi', 'uGp', 'oYq', 'iZs', 'qRo'],
		'it': ['uVw', 'cDp', 'bTl', 'yQr', 'hFn', 'jKw', 'rOp', 'xUl', 'tGp', 'mWi', 'oTk', 'aYp', 'vZe', 'dEr', 'sUb', 'fRq', 'gXt', 'pNl', 'nBv', 'kAs'],
		'ja': ['gHi', 'nOp', 'qRf', 'vWx', 'uPl', 'rDb', 'xCo', 'bJn', 'yTi', 'wMl', 'eQd', 'jBr', 'lVe', 'iFk', 'mZt', 'sAw', 'oLp', 'cFv', 'tJn', 'kPr'],
		'en': ['mNo', 'qRs', 'fTe', 'yXi', 'rWa', 'oLv', 'cBp', 'jMl', 'gKr', 'dNp', 'xVo', 'uWi', 'nQs', 'lEb', 'vXe', 'aFr', 'pUt', 'zAk', 'sMj', 'eXn'],
		'pl': ['wZh', 'kRg', 'sTn', 'jFb', 'lWx', 'cYp', 'qQk', 'uMs', 'aGt', 'nFl', 'vJd', 'xWb', 'oVq', 'iBr', 'mTe', 'yHu', 'zKx', 'pYl', 'dAr', 'eBc'],
		'de': ['G5h', 'R8g', 'S9t', 'J2b', 'L7x', 'P1m', 'Q6z', 'U4s', 'A9t', 'N0l', 'V2d', 'X3b', 'O7q', 'I5r', 'M8e', 'Y6u', 'Z4k', 'T3l', 'C1r', 'f1r'],
		'th': ['B2x', 'H9v', 'K5n', 'D3m', 'F7y', 'T8w', 'R6j', 'W1q', 'E4s', 'Z0p', 'Q3b', 'L8r', 'M2f', 'P7t', 'X9c', 'U5z', 'A6d', 'N0k', 'Y4h', 'G1l']
	};

	const lastThreeChars = id.slice(-3);
	let found = false;

	for (const [key, value] of Object.entries(originalLangMap)) {
		if (value.includes(lastThreeChars)) {
			lang = key;
			found = true;
			break;
		}
	}

	if (found) {
		id = id.slice(0, -3);
	}

	if (id.length > 2) {
		id = id.slice(-2) + id.slice(0, -2);
	}

	if (!id || !lang) return;

	function MersenneTwister(seed) {
		if (seed === undefined) {
			seed = new Date().getTime();
		}

		this.N = 624;
		this.M = 397;
		this.MATRIX_A = 0x9908b0df;
		this.UPPER_MASK = 0x80000000;
		this.LOWER_MASK = 0x7fffffff;

		this.mt = new Array(this.N);
		this.mti = this.N + 1;

		this.init_genrand(seed);
	}

	MersenneTwister.prototype.init_genrand = function (s) {
		this.mt[0] = s >>> 0;
		for (this.mti = 1; this.mti < this.N; this.mti++) {
			var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
			this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253 + ((s & 0x0000ffff) * 1812433253)) >>> 0;
			this.mt[this.mti] += this.mti;
			this.mt[this.mti] >>>= 0;
		}
	}

	MersenneTwister.prototype.genrand_int32 = function () {
		var y;
		var mag01 = new Array(0x0, this.MATRIX_A);
		if (this.mti >= this.N) { 
			var kk;
			if (this.mti === this.N + 1)
				this.init_genrand(5489);

			for (kk = 0; kk < this.N - this.M; kk++) {
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for (; kk < this.N - 1; kk++) {
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
			this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

			this.mti = 0;
		}

		y = this.mt[this.mti++];

		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);

		return y >>> 0;
	}

	MersenneTwister.prototype.random = function () {
		return this.genrand_int32() * (1.0 / 4294967296.0);
	}

	function hashStringToSeed(str) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash * 31 + str.charCodeAt(i)) >>> 0; 
		}
		return hash;
	}

	function shuffleArray(array, seed) {
		const generator = new MersenneTwister(seed);
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(generator.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	// const stringSeed = effectiveDomain + lang;
	const stringSeed = 'vagelidwep.github.io' + lang;
	const seed = hashStringToSeed(stringSeed);
	const shuffledChars = shuffleArray(base62Chars.slice(), seed).join('');

	function base10ToShuffledBase62(num, charSet) {
		let result = '';

		if (num === 0) {
			return charSet[0];
		}

		while (num > 0) {
			const remainder = num % 62;
			result = charSet[remainder] + result;
			num = Math.floor(num / 62);
		}

		return result;
	}
	function shuffledBase62ToBase10(str, charSet) {
		let result = 0;

		for (let i = 0; i < str.length; i++) {
			const value = charSet.indexOf(str[i]);
			result = result * 62 + value;
		}

		return result;
	}


	const base62String = id;
	const base10Result = shuffledBase62ToBase10(base62String, shuffledChars);
	const productId = base10Result;

	const affKey = '_DefkpWT'; // _oke0LJF
	const aff_short_key = '_DefkpWT'; // _oke0LJF
	const api_url = `https://api.buytostore.com/i/${effectiveDomain}/${lang}/${productId}`;
	const aff_Url_button = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${aff_short_key}&dl_target_url=https://www.aliexpress.com/item/${productId}.html`;

	function escapeHtml(text) {
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	function htmlToElement(html) {
		var template = document.createElement('template');
		template.innerHTML = html.trim();
		return template.content.firstChild;
	}
	function stripHtmlTags(html) {
		var tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	}
	function createElementWithText(tagName, innerText) {
		var element = document.createElement(tagName);
		element.innerText = innerText;
		return element;
	}
	function createImageListHTML(images, title) {
		// Create the main div for large images
		var largeDiv = document.createElement('div');
		largeDiv.classList.add('separator', 'image-holder');
		largeDiv.style.cssText = 'clear: both; text-align: center;';

		// Create the anchor element for the large image
		var largeAnchor = document.createElement('a');
		largeAnchor.href = images[0];
		largeAnchor.setAttribute('imageanchor', '1');
		largeAnchor.style.cssText = 'margin-left: 1em; margin-right: 1em;';

		// Create the large image element
		var largeImg = document.createElement('img');
		largeImg.src = images[0];
		largeImg.alt = title;
		largeImg.title = title;
		largeImg.border = '0';

		// Append the large image element to the anchor element
		largeAnchor.appendChild(largeImg);

		// Append the anchor element to the main div for large images
		largeDiv.appendChild(largeAnchor);

		// Create the main div for small images
		var smallDiv = document.createElement('div');
		smallDiv.classList.add('separator');
		smallDiv.style.cssText = 'clear: both; text-align: center;';

		// Create small image elements and append them to the small div
		for (var i = 0; i < images.length; i++) {
			var smallAnchor = document.createElement('a');
			smallAnchor.href = images[i];
			smallAnchor.classList.add('image-list');
			if (i === 0) smallAnchor.classList.add('active');
			smallAnchor.style.background = 'center no-repeat url(' + images[i] + '_50x50.jpg)';
			smallAnchor.title = title + ' #' + (i + 1);
			smallDiv.appendChild(smallAnchor);
		}

		// Return an array containing the two main divs
		return [largeDiv, smallDiv];
	}
	function createProductInfoElement(data, aff_Url_button) {
		const container = document.createElement('div');
		container.classList.add('product-info');
		container.style.marginBottom = '1em';
		const rows = [
			{ label: 'Price', value: `${data.target_sale_price_formatted} <span class="discount">${data.discount} OFF</span>` },
			{ label: 'Original Price', value: `<strike>${data.target_original_price_formatted}</strike>` },
			{ label: 'Sold', value: `${data.latest_volume} pcs` },
			{ label: 'SKU', value: data.productId },
			{ label: 'Store', value: `Store-${data.shop_id}` }
		];

		// 					rows.forEach(row => {
		// 						const rowElement = document.createElement('div');
		// 						rowElement.classList.add('flex-row');

		// 						const labelElement = document.createElement('div');
		// 						labelElement.classList.add('flex-col');
		// 						labelElement.innerHTML = `<b>${row.label}</b>`;
		// 						rowElement.appendChild(labelElement);

		// 						const valueElement = document.createElement('div');
		// 						valueElement.classList.add('flex-double-col');
		// 						// valueElement.classList.add('text-nowrap');
		// 						valueElement.innerHTML = `<div class="text-nowrap">${row.value}</div>`;
		// 						rowElement.appendChild(valueElement);

		// 						container.appendChild(rowElement);
		// 					});

		const buttonContainer = document.createElement('div');
		buttonContainer.style.textAlign = 'center';
		buttonContainer.style.marginTop = '1em';

		const buyButton = document.createElement('a');
		buyButton.href = aff_Url_button; // URL tombol berasal dari variabel aff_Url
		buyButton.className = 'btn btn-success';
		buyButton.target = '_blank'; // Membuka URL di tab baru
		buyButton.style.display = 'inline-block';
		buyButton.style.padding = '10px 20px';
		buyButton.style.fontSize = '16px';
		buyButton.style.fontWeight = 'bold';
		buyButton.style.color = '#fff';
		buyButton.style.backgroundColor = '#007af5';
		buyButton.style.textDecoration = 'none';
		buyButton.style.borderRadius = '5px';
		buyButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
		buyButton.textContent = 'BUYNOW';

		buttonContainer.appendChild(buyButton);
		container.appendChild(buttonContainer);
		return container;
	}

	function setTitle(title) {
		document.title = title;
	}
	function setMetaRobots(value) {
		document.querySelector('meta[name=robots]').content = value;
	}
	function setBreadcrumb(title) {
		document.querySelector('#breadcrumb .current').textContent = title;
	}
	function setPostTitle(title) {
		document.querySelector('h1.post-title').textContent = title;
	}
	function appendMetaTag(...attributes) {
		if(!Array.isArray(attributes) || attributes.length % 2 !== 0)
			return;
		const meta = document.createElement('meta');
		for (let i = 0; i < attributes.length; i += 2) {
			const attrName = attributes[i];
			const attrValue = attributes[i + 1];
			meta.setAttribute(attrName, attrValue);
		}
		document.head.appendChild(meta);
	}
	function appendRichSnippet(data) {
		const richSnippet = {
			"@context": "https://schema.org/",
			"@type": "Product",
			"name": data.titlesingle,
			"image": data.product_small_image_urls,
			"description": data.description_single,
			"sku": data.product_id,
			"aggregateRating": {
				"@type": "AggregateRating",
				"ratingValue": data.stars,
				"reviewCount": data.latest_volume
			},
			"offers": {
				"@type": "Offer",
				"url": location.href,
				"priceCurrency": data.target_currency,
				"price": Number(data.sale_price),
				"availability": "https://schema.org/InStock"
			}
		};
		const scriptElement = document.createElement('script');
		scriptElement.type = 'application/ld+json';
		scriptElement.textContent = JSON.stringify(richSnippet);
		document.head.appendChild(scriptElement);
	}
	function appendPostBodyContent(...elements) {
		var postBodyContent = document.querySelector('#post-body-content');
		// postBodyContent.innerHTML = '';
		elements.forEach(function(element) {
			postBodyContent.appendChild(element);
		});
	}
	function productHandler(data) {
		document.querySelector('#post-body-content').innerHTML = '';
		setTitle(data.document_title);
		setMetaRobots('index,follow');
		appendMetaTag('name', 'description', 'content', data.description_single);
		appendMetaTag('property', 'og:description', 'content', data.description_single);
		appendMetaTag('property', 'og:title', 'content', data.meta_product_title || data.titlesingle);
		appendMetaTag('property', 'og:url', 'content', location.href);
		data.product_small_image_urls.forEach(img_url => appendMetaTag('property', 'og:image', 'content', img_url))
		appendRichSnippet(data);
		setBreadcrumb(data.page_title);
		setPostTitle(data.page_title);
		appendPostBodyContent(...createImageListHTML(data.product_small_image_urls, data.title));
		appendPostBodyContent(createElementWithText('p', data.description_single));
		appendPostBodyContent(createProductInfoElement(data, aff_Url_button));
		if(data.bekling)
			appendPostBodyContent(htmlToElement(`<div>${data.bekling}</div>`));
		var isBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent);
		var aff_Url = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${aff_short_key}&dl_target_url=https://www.aliexpress.com/item/${data.productId}.html`;
		var baseUrl = location.href;
		if (!isBot) {
			setTimeout(function() {
				window.location.href = aff_Url;
			}, 2000); // 5000 milidetik = 5 detik
		} else {
			var redirectUrl = baseUrl;
		}
	}
	function pageNotFoundHandler(is_product) {
		document.querySelector('#post-body-content').innerHTML = '';
		setBreadcrumb('404 Not Found');
		setPostTitle('404 Not Found');
		var separator = document.createElement('div');
		separator.className = 'separator';
		separator.style.clear = 'both';
		separator.style.textAlign = 'center';
		separator.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQBAMAAAAVaP+LAAAAGFBMVEUAAABTU1NNTU1TU1NPT09SUlJSUlJTU1O8B7DEAAAAB3RSTlMAoArVKvVgBuEdKgAAAJ1JREFUeF7t1TEOwyAMQNG0Q6/UE+RMXD9d/tC6womIFSL9P+MnAYOXeTIzMzMzMzMzaz8J9Ri6HoITmuHXhISE8nEh9yxDh55aCEUoTGbbQwjqHwIkRAEiIaG0+0AA9VBMaE89Rogeoww936MQrWdBr4GN/z0IAdQ6nQ/FIpRXDwHcA+JIJcQowQAlFUA0MfQpXLlVQfkzR4igS6ENjknm/wiaGhsAAAAASUVORK5CYII=" alt="404 Not Found" title="404 Not Found" border="0">';
		var message = document.createElement('p');
		message.textContent = (is_product ? 'Product' : 'Page') + ' Not Found. The item you are looking for probably was deleted or eaten by T-Rex.';
		appendPostBodyContent(separator, message);
	}
	if(!id) return pageNotFoundHandler();
	setTitle(`Item ${id}`);
	fetch(api_url).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error('Network response was not ok.');
		}
	}).then(data => {
		if (data.success) {
			productHandler(data);
		} else {
			pageNotFoundHandler(true);
		}
	}).catch(error => pageNotFoundHandler(true));
});
