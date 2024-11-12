chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'sendElementInfo') {
        const elementInfo = message.info;

        // HTTP 요청으로 IntelliJ 플러그인에 전송
        fetch('http://localhost:8081/receive-element-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ elementInfo })
        }).then(response => response.json())
          .then(data => console.log('IntelliJ response:', data))
          .catch(error => console.error('Error sending to IntelliJ:', error));
    }
});