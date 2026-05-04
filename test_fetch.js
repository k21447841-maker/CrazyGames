fetch('http://localhost:3000/api/games//rate', {method: 'POST'}).then(r => r.text()).then(t => console.log('RESPONSE1:',t.substring(0, 50)));

fetch('http://localhost:3000/api/games/undefined/rate', {method: 'POST'}).then(r => r.text()).then(t => console.log('RESPONSE2:',t.substring(0, 50)));
