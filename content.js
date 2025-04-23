document.addEventListener('click', (event) => {
    if (event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        let currentElement = event.target; // 클릭된 요소
        
        // 상위 요소 탐색
        while (currentElement) {
            if (currentElement.tagName) {
                const tagName = currentElement.tagName.toLowerCase(); // 태그 이름 소문자로 변환
                if (tagName.startsWith("em") || tagName.startsWith("es") || tagName.startsWith("ep")) {
                    // IntelliJ로 정보 전송
                    fetch('http://localhost:9999/receive-element-info', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ tagName }) // 태그 정보를 JSON으로 전송
                    }).then(response => response.text())
                    .then(data => console.log('Response from IntelliJ:', data))
                    .catch(error => console.error('Error:', error));

                    break;
                }
            }
            currentElement = currentElement.parentElement; // 상위 요소로 이동
        }
    }
});

function isKorean(text) {
	return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
}

let currentBubble;
document.addEventListener('mouseover', (event) => {
	if (event.ctrlKey && event.shiftKey) {
		event.preventDefault();
		let currentElement = event.target; // 클릭된 요소
		let lang;
		const parentTagName = currentElement.parentElement.tagName.toLowerCase();
		if (parentTagName.startsWith("sc") || parentTagName.startsWith("cc") && currentElement.parentElement.getAttribute("text")) {
			lang =  {
				us : currentElement.parentElement.getAttribute("text") ?? "",
				kr : currentElement.parentElement.innerText ?? ""
			};
		}
	
		// 상위 요소 탐색
		while (currentElement) {
			if (currentElement.tagName) {
				const tagName = currentElement.tagName.toLowerCase(); // 태그 이름 소문자로 변환
				if (tagName.startsWith("em") || tagName.startsWith("es") || tagName.startsWith("ep")) {
					showTagNameBubble(tagName, event.clientX, event.clientY, lang !== undefined && isKorean(lang.kr) ? lang : undefined);
					break;
				}
			}
			currentElement = currentElement.parentElement; // 상위 요소로 이동
		}
	} else {
		if (currentBubble) {
			currentBubble.remove();
			currentBubble = null;
		}
	}
});

function showTagNameBubble(tagName, x, y, lang) {
	
	if (currentBubble) {
		currentBubble.remove();
		currentBubble = null;
	}
	
	const bubble = document.createElement('div');
	bubble.innerText = `Tag: <${tagName}>`;
	lang !== undefined ? bubble.innerText += `\nTranslate: ${lang.us}` : "";
	bubble.style.position = 'fixed';
	bubble.style.left = `${x + 15}px`;  // 커서 오른쪽 약간 띄우기
	bubble.style.top = `${y + 15}px`;   // 커서 아래쪽 약간 띄우기
	bubble.style.zIndex = '9999';
	bubble.style.backgroundColor = '#333';
	bubble.style.color = '#fff';
	bubble.style.padding = '10px 20px';
	bubble.style.borderRadius = '10px';
	bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
	bubble.style.fontSize = '14px';
	bubble.style.opacity = '0';
	bubble.style.transition = 'opacity 0.3s ease';
	bubble.style.pointerEvents = 'none'; // 이벤트 방지 (중요)
	
	document.body.appendChild(bubble);
	currentBubble = bubble;
	
	// 등장 효과
	setTimeout(() => {
		bubble.style.opacity = '1';
	}, 10);
	
}
let isPixelMode = false;
let isDragging = false;
let startX = 0, startY = 0;
let guideBox = null;
let label = null;
let overlay = null;
let globalStyle = null;

// 스타일 동적으로 삽입
(function injectStyles() {
	const style = document.createElement('style');
	style.textContent = `
    #pixel-guide {
      position: fixed;
      border: 2px dashed red;
      background-color: rgba(255, 0, 0, 0.1);
      pointer-events: none;
      z-index: 999999;
    }
    #pixel-label {
      position: fixed;
      background: black;
      color: white;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 999999;
      pointer-events: none;
    }
  `;
	document.head.appendChild(style);
})();

function createOverlay() {
	overlay = document.createElement('div');
	overlay.id = 'pixel-overlay-bg';
	overlay.style.position = 'fixed';
	overlay.style.top = 0;
	overlay.style.left = 0;
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
	overlay.style.zIndex = 999998;
	overlay.style.pointerEvents = 'none';
	document.body.appendChild(overlay);
}

function removeOverlay() {
	overlay?.remove();
	overlay = null;
}

function applyGlobalPixelModeStyles() {
	globalStyle = document.createElement('style');
	globalStyle.id = 'pixel-global-block-style';
	globalStyle.textContent = `
    * {
      user-select: none !important;
      -webkit-user-select: none !important;
      cursor: crosshair !important;
    }
    html, body {
      pointer-events: none;
    }
  `;
	document.head.appendChild(globalStyle);
}

function removeGlobalPixelModeStyles() {
	globalStyle?.remove();
	globalStyle = null;
}

function resetGlobal() {
	guideBox?.remove();
	label?.remove();
	guideBox = null;
	label = null;
}

// 픽셀 모드 진입 단축키: Ctrl + Shift + Q
document.addEventListener('keydown', (e) => {
	if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'q') {
		isPixelMode = !isPixelMode;
		resetGlobal();
		if (isPixelMode) {
			createOverlay();
			applyGlobalPixelModeStyles();
		} else {
			removeGlobalPixelModeStyles();
			removeOverlay();
		}
	}
});


document.addEventListener('mousedown', (e) => {
	if (!isPixelMode) return;
	
	// 👇 이 조건이 새로 추가됨
	if (
		!isDragging &&
		guideBox &&
		!e.target.closest('#pixel-guide') &&
		!e.target.closest('#pixel-label')
	) {
		resetGlobal();
		return;
	}
	
	// 👇 이건 측정 시작
	isDragging = true;
	startX = e.clientX;
	startY = e.clientY;
	
	guideBox = document.createElement('div');
	guideBox.id = 'pixel-guide';
	document.body.appendChild(guideBox);
	
	label = document.createElement('div');
	label.id = 'pixel-label';
	document.body.appendChild(label);
});

document.addEventListener('mousemove', (e) => {
	if (!isPixelMode || !isDragging) return;
	
	const currX = e.clientX;
	const currY = e.clientY;
	const width = Math.abs(currX - startX);
	const height = Math.abs(currY - startY);
	const left = Math.min(startX, currX);
	const top = Math.min(startY, currY);
	
	guideBox.style.left = `${left}px`;
	guideBox.style.top = `${top}px`;
	guideBox.style.width = `${width}px`;
	guideBox.style.height = `${height}px`;
	
	label.textContent = `${width}px × ${height}px`;
	label.style.left = `${left}px`;
	label.style.top = `${top - 24}px`;
});

document.addEventListener('mouseup', () => {
	if (!isPixelMode || !isDragging) return;
	isDragging = false;
});
