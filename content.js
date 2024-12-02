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
                    fetch('http://localhost:8081/receive-element-info', {
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