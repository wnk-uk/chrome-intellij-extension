document.addEventListener('click', (event) => {
    if (event.ctrlKey && event.shiftKey) {
        event.preventDefault();

        // 클릭한 요소의 최상위 부모 요소
        const topElement = event.target.closest('html');
        const elementInfo = topElement ? topElement.outerHTML.slice(0, 100) : '';

        // IntelliJ로 정보 전송
        fetch('http://localhost:8081/receive-element-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: "test"
        }).then(response => response.text())
          .then(data => console.log('Response from IntelliJ:', data))
          .catch(error => console.error('Error:', error));
    }
});