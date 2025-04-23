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

let currentBubble;
document.addEventListener('mouseover', (event) => {
	if (event.ctrlKey && event.shiftKey) {
		event.preventDefault();
		let currentElement = event.target; // 클릭된 요소
		
		// 상위 요소 탐색
		while (currentElement) {
			if (currentElement.tagName) {
				const tagName = currentElement.tagName.toLowerCase(); // 태그 이름 소문자로 변환
				if (tagName.startsWith("em") || tagName.startsWith("es") || tagName.startsWith("ep")) {
					showTagNameBubble(tagName);
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

function showTagNameBubble(tagName) {
	
	if (currentBubble) {
		currentBubble.remove();
		currentBubble = null;
	}
	
	const bubble = document.createElement('div');
	bubble.innerText = `Tag: <${tagName}>`;
	bubble.style.position = 'fixed';
	bubble.style.bottom = '40px';
	bubble.style.right = '40px';
	bubble.style.zIndex = '9999';
	bubble.style.backgroundColor = '#333';
	bubble.style.color = '#fff';
	bubble.style.padding = '10px 20px';
	bubble.style.borderRadius = '10px';
	bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
	bubble.style.fontSize = '14px';
	bubble.style.opacity = '0';
	bubble.style.transition = 'opacity 0.3s ease';
	
	document.body.appendChild(bubble);
	currentBubble = bubble;
	
	// 등장 효과
	setTimeout(() => {
		bubble.style.opacity = '1';
	}, 10);
	
}
